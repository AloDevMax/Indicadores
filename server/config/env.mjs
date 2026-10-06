import { z } from 'zod';

// Defaults só valem fora de produção; em produção as variáveis são obrigatórias.
const DEV_AUTH_SECRET = 'dev-only-auth-secret-change-me';
const DEV_DEVELOPER_PASSWORD = '2665398';
const PRODUCTION_REQUIRED = ['DATABASE_URL', 'AUTH_SECRET', 'DEVELOPER_INITIAL_PASSWORD'];

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional(),
);

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4004),
    DATABASE_URL: optionalString,
    DATABASE_SSL: optionalString.transform((value) => value !== 'false'),
    AUTH_SECRET: optionalString,
    DEVELOPER_INITIAL_PASSWORD: optionalString,
    ALLOWED_ORIGINS: z
      .string()
      .default('http://localhost:3000')
      .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;
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
