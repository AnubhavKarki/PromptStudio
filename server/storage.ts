import { db } from "./db";
import {
  prompts, testCases, runs,
  type Prompt, type InsertPrompt,
  type TestCase, type InsertTestCase,
  type Run, type InsertRun
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPrompts(): Promise<Prompt[]>;
  getPrompt(id: number): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  deletePrompt(id: number): Promise<void>;
  
  getTestCases(promptId: number): Promise<TestCase[]>;
  createTestCase(testCase: InsertTestCase): Promise<TestCase>;
  
  getRuns(promptId: number): Promise<Run[]>;
  createRun(run: InsertRun): Promise<Run>;
}

export class DatabaseStorage implements IStorage {
  async getPrompts(): Promise<Prompt[]> {
    return await db.select().from(prompts).orderBy(desc(prompts.createdAt));
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt;
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const [prompt] = await db.insert(prompts).values(insertPrompt).returning();
    return prompt;
  }

  async deletePrompt(id: number): Promise<void> {
    await db.delete(runs).where(eq(runs.promptId, id));
    await db.delete(testCases).where(eq(testCases.promptId, id));
    await db.delete(prompts).where(eq(prompts.id, id));
  }

  async getTestCases(promptId: number): Promise<TestCase[]> {
    return await db.select().from(testCases).where(eq(testCases.promptId, promptId));
  }

  async createTestCase(insertTestCase: InsertTestCase): Promise<TestCase> {
    const [testCase] = await db.insert(testCases).values(insertTestCase).returning();
    return testCase;
  }

  async getRuns(promptId: number): Promise<Run[]> {
    return await db.select().from(runs)
      .where(eq(runs.promptId, promptId))
      .orderBy(desc(runs.createdAt));
  }

  async createRun(insertRun: InsertRun): Promise<Run> {
    const [run] = await db.insert(runs).values(insertRun).returning();
    return run;
  }
}

export const storage = new DatabaseStorage();
