// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  createSessionToken,
  generateSessionId,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from './crypto.mjs';

describe('hashPassword / verifyPassword', () => {
  it('produces a hash that verifies against the original password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    await expect(verifyPassword('correct-horse-battery-staple', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });

  it('salts each hash differently for the same password', async () => {
    const first = await hashPassword('same-password');
    const second = await hashPassword('same-password');
    expect(first).not.toBe(second);
  });

  it('rejects a malformed stored hash instead of throwing', async () => {
    await expect(verifyPassword('anything', 'not-a-valid-hash')).resolves.toBe(false);
  });
});

describe('createSessionToken / verifySessionToken', () => {
  it('round-trips the session payload', () => {
    const token = createSessionToken({ sessionId: 's1', userId: 'u1', role: 'admin' });
    const payload = verifySessionToken(token);

    expect(payload).toMatchObject({ sessionId: 's1', userId: 'u1', role: 'admin' });
  });

  it('rejects a tampered token', () => {
    const token = createSessionToken({ sessionId: 's1', userId: 'u1', role: 'user' });
    const [encodedPayload] = token.split('.');
    const tampered = `${encodedPayload}.invalid-signature`;

    expect(verifySessionToken(tampered)).toBeNull();
  });

  it('rejects a malformed token', () => {
    expect(verifySessionToken('not-a-token')).toBeNull();
  });
});

describe('generateSessionId', () => {
  it('returns unique ids', () => {
    const a = generateSessionId();
    const b = generateSessionId();
    expect(a).not.toBe(b);
  });
});
