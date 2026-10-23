import crypto from 'node:crypto';
import { env } from '../config/env.mjs';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const AUTH_SECRET = env.AUTH_SECRET;

const base64url = (value) => Buffer.from(value).toString('base64url');
const fromBase64url = (value) => Buffer.from(value, 'base64url').toString('utf8');

export const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  return `scrypt:${salt}:${Buffer.from(derivedKey).toString('hex')}`;
};

export const verifyPassword = async (password, storedHash) => {
  const [scheme, salt, expectedHash] = storedHash.split(':');
  if (scheme !== 'scrypt' || !salt || !expectedHash) {
    return false;
  }

  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const actualBuffer = Buffer.from(derivedKey);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

// Hash de uma senha aleatória descartada: nenhuma senha confere. O login de um e-mail inexistente
// verifica contra ele, para gastar o mesmo scrypt e não revelar pelo tempo de resposta quem tem conta.
export const DUMMY_PASSWORD_HASH = 'scrypt:8d52a9d0a03302de38c3adf2055bb090:36efa9f18098eb11638445217bef0080206487bee506e1e888b1cfb01854288a6830288832803497c26f926a3b2e405a7fd5655a97c405e5ce24917d227aae30';

const sign = (payload) =>
  crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');

export const createSessionToken = ({ sessionId, userId, role }) => {
  const payload = {
    sessionId,
    userId,
    role,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

export const verifySessionToken = (token) => {
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64url(encodedPayload));
    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
};

export const generateSessionId = () => crypto.randomUUID();

// Sem 0/O, 1/l/I: a senha temporária é lida pelo admin e repassada ao colaborador.
const TEMPORARY_PASSWORD_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
const TEMPORARY_PASSWORD_LENGTH = 12;

export const generateTemporaryPassword = () => Array.from(
  { length: TEMPORARY_PASSWORD_LENGTH },
  () => TEMPORARY_PASSWORD_ALPHABET[crypto.randomInt(TEMPORARY_PASSWORD_ALPHABET.length)],
).join('');
