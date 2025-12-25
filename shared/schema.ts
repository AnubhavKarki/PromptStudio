import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const testCases = pgTable("test_cases", {
  id: serial("id").primaryKey(),
  promptId: integer("prompt_id").notNull(),
  variables: jsonb("variables").notNull().$type<Record<string, string>>(),
  expectedOutput: text("expected_output"),
});

export const runs = pgTable("runs", {
  id: serial("id").primaryKey(),
  promptId: integer("prompt_id").notNull(),
  testCaseId: integer("test_case_id").notNull(),
  output: text("output"),
  isPass: boolean("is_pass"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPromptSchema = createInsertSchema(prompts).omit({ id: true, createdAt: true });
export const insertTestCaseSchema = createInsertSchema(testCases).omit({ id: true });
export const insertRunSchema = createInsertSchema(runs).omit({ id: true, createdAt: true });

export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type TestCase = typeof testCases.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;
export type Run = typeof runs.$inferSelect;
export type InsertRun = z.infer<typeof insertRunSchema>;
