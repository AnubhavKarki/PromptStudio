import { z } from 'zod';
import { insertPromptSchema, insertTestCaseSchema, prompts, testCases, runs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  prompts: {
    list: {
      method: 'GET' as const,
      path: '/api/prompts',
      responses: {
        200: z.array(z.custom<typeof prompts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/prompts',
      input: insertPromptSchema,
      responses: {
        201: z.custom<typeof prompts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/prompts/:id',
      responses: {
        200: z.custom<typeof prompts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    run: {
        method: 'POST' as const,
        path: '/api/prompts/:id/run',
        responses: {
            200: z.array(z.custom<typeof runs.$inferSelect>()),
            404: errorSchemas.notFound,
        }
    }
  },
  testCases: {
      create: {
          method: 'POST' as const,
          path: '/api/test-cases',
          input: insertTestCaseSchema,
          responses: {
              201: z.custom<typeof testCases.$inferSelect>(),
              400: errorSchemas.validation,
          }
      },
      listByPrompt: {
          method: 'GET' as const,
          path: '/api/prompts/:id/test-cases',
          responses: {
              200: z.array(z.custom<typeof testCases.$inferSelect>()),
          }
      }
  },
  runs: {
      listByPrompt: {
          method: 'GET' as const,
          path: '/api/prompts/:id/runs',
          responses: {
              200: z.array(z.custom<typeof runs.$inferSelect>()),
          }
      }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
