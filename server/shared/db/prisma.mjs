import { PrismaClient } from '@prisma/client';
import { env } from '../../config/env.mjs';

// Instância única por processo: o PrismaClient mantém o pool de conexões.
export const prisma = new PrismaClient({ datasourceUrl: env.DATABASE_URL });
