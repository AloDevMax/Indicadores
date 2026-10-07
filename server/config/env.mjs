import { z } from 'zod';

// DATABASE_URL é sempre obrigatória. Os demais defaults só valem fora de produção.
const DEV_AUTH_SECRET = 'dev-only-auth-secret-change-me';
const DEV_DEVELOPER_PASSWORD = '2665398';
const PRODUCTION_REQUIRED = ['AUTH_SECRET', 'DEVELOPER_INITIAL_PASSWORD'];
const SUPABASE_REQUIRED = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional(),
);

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4004),
    DATABASE_URL: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.string({ required_error: 'obrigatória' }),
    ),
    AUTH_SECRET: optionalString,
    DEVELOPER_INITIAL_PASSWORD: optionalString,
    STORAGE_DRIVER: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.enum(['local', 'supabase']).default('local'),
    ),
    SUPABASE_URL: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z
        .string()
        .regex(/^https?:\/\/[^/\s]+/, 'deve ser uma URL http(s)')
        .transform((value) => value.replace(/\/+$/, ''))
        .optional(),
    ),
    SUPABASE_SERVICE_ROLE_KEY: optionalString,
    SUPABASE_STORAGE_BUCKET: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.string().default('uploads'),
    ),
    ALLOWED_ORIGINS: z
      .string()
      .default('http://localhost:3000')
      .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  })
  .superRefine((env, ctx) => {
    if (env.STORAGE_DRIVER === 'supabase') {
      for (const key of SUPABASE_REQUIRED) {
        if (!env[key]) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: 'obrigatória com STORAGE_DRIVER=supabase' });
        }
      }
    }

    if (env.NODE_ENV !== 'production') return;
    if (env.STORAGE_DRIVER !== 'supabase') {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['STORAGE_DRIVER'], message: 'deve ser "supabase" em produção' });
    }
    for (const key of PRODUCTION_REQUIRED) {
      if (!env[key]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: 'obrigatória em produção' });
      }
    }
  });

export const parseEnv = (source) => {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Variáveis de ambiente inválidas:\n${details}`);
  }

  return Object.freeze({
    ...result.data,
    AUTH_SECRET: result.data.AUTH_SECRET ?? DEV_AUTH_SECRET,
    DEVELOPER_INITIAL_PASSWORD: result.data.DEVELOPER_INITIAL_PASSWORD ?? DEV_DEVELOPER_PASSWORD,
  });
};

export const env = parseEnv(process.env);
