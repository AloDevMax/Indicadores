import { z } from 'zod';

// DATABASE_URL é sempre obrigatória. Os demais defaults só valem fora de produção.
const DEV_AUTH_SECRET = 'dev-only-auth-secret-change-me';
const DEV_DEVELOPER_PASSWORD = 'dev-only-developer-password';
const PRODUCTION_REQUIRED = ['AUTH_SECRET', 'DEVELOPER_INITIAL_PASSWORD'];
const SUPABASE_REQUIRED = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const AUTH_SECRET_MIN_LENGTH = 32;
// Valores públicos (este arquivo e o .env.example): quem os conhece forja tokens de sessão.
const EXAMPLE_AUTH_SECRETS = [DEV_AUTH_SECRET, 'troque-por-um-segredo-forte-em-producao'];
const EXAMPLE_DEVELOPER_PASSWORDS = [DEV_DEVELOPER_PASSWORD, 'troque-por-uma-senha-forte'];
const DEVELOPER_PASSWORD_MIN_LENGTH = 12;

// O fallback de desenvolvimento só vale na máquina local (sem produção e com storage local). Fora dela,
// um NODE_ENV esquecido faria o servidor assinar os tokens com o segredo público.
const checkAuthSecret = (env, ctx) => {
  const isLocalOnly = env.NODE_ENV !== 'production' && env.STORAGE_DRIVER === 'local';
  if (isLocalOnly) return;

  const addIssue = (message) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['AUTH_SECRET'], message });
  if (!env.AUTH_SECRET) {
    // Em produção a ausência já é apontada por PRODUCTION_REQUIRED.
    if (env.NODE_ENV !== 'production') addIssue('obrigatória fora do ambiente local');
  } else if (EXAMPLE_AUTH_SECRETS.includes(env.AUTH_SECRET)) {
    addIssue('não use o valor de exemplo');
  } else if (env.AUTH_SECRET.length < AUTH_SECRET_MIN_LENGTH) {
    addIssue(`deve ter pelo menos ${AUTH_SECRET_MIN_LENGTH} caracteres`);
  }
};

// Checada no seed, ao gravar a senha (criação ou --reset-developer-password), e não no boot: o servidor não a usa,
// e o seed do release roda no CI sem NODE_ENV=production. O valor de dev só vale na máquina local.
export const developerPasswordProblem = (password, { NODE_ENV, STORAGE_DRIVER }) => {
  const isLocalOnly = NODE_ENV !== 'production' && STORAGE_DRIVER === 'local';
  if (password === DEV_DEVELOPER_PASSWORD && isLocalOnly) return null;
  if (EXAMPLE_DEVELOPER_PASSWORDS.includes(password)) return 'não use o valor de exemplo';
  if (password.length < DEVELOPER_PASSWORD_MIN_LENGTH) return `deve ter pelo menos ${DEVELOPER_PASSWORD_MIN_LENGTH} caracteres`;
  return null;
};

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional(),
);

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4004),
    // Quantos proxies reversos ficam à frente do app (0: nenhum). Define o req.ip usado no limite de login.
    TRUST_PROXY: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.coerce.number().int().min(0).default(0),
    ),
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
    checkAuthSecret(env, ctx);

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
