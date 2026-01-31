# PromptStudio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)

PromptStudio is a full-stack application for testing and evaluating LLM prompts, inspired by tools like PromptFoo. It allows users to manage prompt templates, define test cases with variables, and run automated evaluations against GPT-4o to verify results with pass/fail tracking.

## Features

- Prompt Management: Create and edit prompt templates using variables (e.g., `{{variable}}`).
- Test Case Definitions: Define test cases with variables and expected outputs.
- Automated Evaluation: Run tests against OpenAI GPT-4o and verify results.
- Run History: Track past execution results and success rates.

## Tech Stack

| Frontend | Backend | Database | AI |
|----------|---------|----------|----|
| React | Express | PostgreSQL | OpenAI GPT-4o |
| Shadcn UI | Drizzle ORM | | Replit AI |
| Tailwind CSS | | | |
| TanStack Query | | | |

## Demo
![PromptStudio Demo](demo.png)

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL database
- OpenAI API key (for GPT-4o evaluations)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/AnubhavKarki/PromptStudio.git
   cd PromptStudio
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/promptstudio"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. Set up the database
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:studio  # Optional: Explore database with Drizzle Studio
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

   Open http://localhost:3000 in your browser.

## Project Structure

```
PromptStudio/
├── frontend/           # React + Shadcn UI + Tailwind
├── backend/            # Express + Drizzle ORM
├── db/                 # Database schema & migrations
├── .env.example        # Environment variable template
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# Database
DATABASE_URL="postgresql://..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Server
PORT=3001
```

## Running Tests

```bash
# Run backend tests
npm run test:backend

# Run frontend tests
npm run test:frontend

# Run all tests
npm run test
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

Recommended platforms:
- Vercel (Frontend)
- Railway (Backend + PostgreSQL)
- Render

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

MIT License

Copyright (c) 2026 Anubhav Karki

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) - Beautiful component library
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database ORM
- [TanStack Query](https://tanstack.com/query) - Data synchronization
- [PromptFoo](https://promptfoo.dev/) - Inspiration for the evaluation workflow
