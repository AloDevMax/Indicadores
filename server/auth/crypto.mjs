import crypto from 'node:crypto';

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

if (!process.env.AUTH_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET must be set in production');
}
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-only-auth-secret-change-me';

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
