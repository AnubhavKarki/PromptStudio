# Prompt Testing Application

A full-stack application for testing and evaluating LLM prompts (PromptFoo style).

## Features
- **Prompt Management**: Create and edit prompt templates with variables (e.g., `{{topic}}`).
- **Test Cases**: Define test cases with variables and expected outputs.
- **Evaluation**: Run tests against OpenAI (GPT-4o) and verify results.
- **History**: View past run results and pass/fail status.

## Tech Stack
- **Frontend**: React, Shadcn UI, Tailwind CSS, TanStack Query.
- **Backend**: Express, Drizzle ORM, PostgreSQL.
- **AI**: OpenAI (via Replit AI Integrations).

## Setup
- Database schema is managed via Drizzle.
- AI integration uses Replit's built-in provider (no API key required).
