// @vitest-environment node
//
// Mounts the real uploadRouter on a bare Express app instead of importing
// server/index.mjs directly — the latter runs DB-connection checks and other
// startup side effects at module load time, which makes it unsuitable to
// import inside a test file.
import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { uploadRouter } from './uploadRoutes.mjs';

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/uploads', uploadRouter);
  return app;
};

describe('POST /api/uploads/badge-image', () => {
  it('rejects requests with no Authorization header', async () => {
    const app = buildApp();

    const response = await request(app)
      .post('/api/uploads/badge-image')
      .attach('image', Buffer.from('fake-image-bytes'), 'badge.png');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Sessão inválida ou expirada.' });
  });

  it('rejects requests with a malformed bearer token', async () => {
    const app = buildApp();

    const response = await request(app)
      .post('/api/uploads/badge-image')
      .set('Authorization', 'Bearer not-a-real-token')
      .attach('image', Buffer.from('fake-image-bytes'), 'badge.png');

    expect(response.status).toBe(401);
  });
});
