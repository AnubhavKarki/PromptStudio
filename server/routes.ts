import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI - API key is automatically handled by Replit AI integration
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.prompts.list.path, async (req, res) => {
    const prompts = await storage.getPrompts();
    res.json(prompts);
  });

  app.post(api.prompts.create.path, async (req, res) => {
    try {
      const input = api.prompts.create.input.parse(req.body);
      const prompt = await storage.createPrompt(input);
      res.status(201).json(prompt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.prompts.get.path, async (req, res) => {
    const prompt = await storage.getPrompt(Number(req.params.id));
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.json(prompt);
  });

  app.delete(api.prompts.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    const prompt = await storage.getPrompt(id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    await storage.deletePrompt(id);
    res.status(204).end();
  });

  // Test Cases
  app.post(api.testCases.create.path, async (req, res) => {
    try {
      const input = api.testCases.create.input.parse(req.body);
      const testCase = await storage.createTestCase(input);
      res.status(201).json(testCase);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.testCases.listByPrompt.path, async (req, res) => {
    const testCases = await storage.getTestCases(Number(req.params.id));
    res.json(testCases);
  });

  // Runs
  app.get(api.runs.listByPrompt.path, async (req, res) => {
    const runs = await storage.getRuns(Number(req.params.id));
    res.json(runs);
  });

  app.post(api.prompts.run.path, async (req, res) => {
    const promptId = Number(req.params.id);
    const prompt = await storage.getPrompt(promptId);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    const testCases = await storage.getTestCases(promptId);
    const results = [];

    for (const testCase of testCases) {
      // Interpolate variables
      let content = prompt.content;
      const variables = testCase.variables as Record<string, string>;
      for (const [key, value] of Object.entries(variables)) {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content }],
        });

        const actualOutput = response.choices[0].message.content || "";
        
        // Simple assertion: check if expected output is contained in actual output
        // If no expected output, it passes by default (just a run)
        let isPass = true;
        if (testCase.expectedOutput) {
          isPass = actualOutput.includes(testCase.expectedOutput);
        }

        const run = await storage.createRun({
          promptId,
          testCaseId: testCase.id,
          output: actualOutput,
          isPass
        });
        results.push(run);

      } catch (error) {
        console.error("OpenAI API error:", error);
        // Log failed run
         const run = await storage.createRun({
          promptId,
          testCaseId: testCase.id,
          output: "Error calling OpenAI",
          isPass: false
        });
        results.push(run);
      }
    }

    res.json(results);
  });

  // Call seed function
  await seedDatabase();

  return httpServer;
}

// Seed function
async function seedDatabase() {
    const prompts = await storage.getPrompts();
    if (prompts.length === 0) {
        const prompt = await storage.createPrompt({
            name: "Sentiment Analysis",
            content: "Analyze the sentiment of this text: {{text}}. Return only Positive, Negative, or Neutral."
        });
        
        await storage.createTestCase({
            promptId: prompt.id,
            variables: { text: "I love this product!" },
            expectedOutput: "Positive"
        });
         await storage.createTestCase({
            promptId: prompt.id,
            variables: { text: "This is the worst thing ever." },
            expectedOutput: "Negative"
        });
    }
}
