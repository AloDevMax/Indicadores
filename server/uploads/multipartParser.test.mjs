// @vitest-environment node
//
// Exercises the real parseMultipartData() against hand-built multipart/form-data
// bodies delivered through actual 'data'/'end'/'error' stream events (via a real
// PassThrough stream), rather than mocking the parser's internals.
import { PassThrough } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { parseMultipartData } from './multipartParser.mjs';

const BOUNDARY = 'TestBoundary123456';

const buildFakeRequest = (contentType) => {
  const req = new PassThrough();
  if (contentType !== undefined) {
    req.headers = { 'content-type': contentType };
  } else {
    req.headers = {};
  }
  req.connection = { destroy: () => {} };
  return req;
};

describe('parseMultipartData', () => {
  it('parses a valid multipart payload into exact fields and file shape', async () => {
    const req = buildFakeRequest(`multipart/form-data; boundary=${BOUNDARY}`);

    const body =
      `--${BOUNDARY}\r\n` +
      `Content-Disposition: form-data; name="title"\r\n` +
      `\r\n` +
      `Hello World\r\n` +
      `--${BOUNDARY}\r\n` +
      `Content-Disposition: form-data; name="image"; filename="test.png"\r\n` +
      `Content-Type: image/png\r\n` +
      `\r\n` +
      `PNGDATA123\r\n` +
      `--${BOUNDARY}--\r\n`;

    const promise = parseMultipartData(req);
    req.emit('data', Buffer.from(body, 'binary'));
    req.emit('end');

    const result = await promise;

    expect(result.fields).toEqual({ title: 'Hello World' });
    expect(Object.keys(result.files)).toEqual(['image']);
    expect(result.files.image.filename).toBe('test.png');
    expect(result.files.image.mimeType).toBe('image/png');
    // The real parser's split-based extraction leaves a trailing \r\n on the
    // file content (it strips the boundary marker but not the CRLF that
    // precedes it) — this test characterizes that exact, current behavior.
    expect(result.files.image.buffer).toEqual(Buffer.from('PNGDATA123\r\n', 'binary'));
  });

  it('parses multiple chunks delivered across separate data events', async () => {
    const req = buildFakeRequest(`multipart/form-data; boundary=${BOUNDARY}`);

    const body =
      `--${BOUNDARY}\r\n` +
      `Content-Disposition: form-data; name="note"\r\n` +
      `\r\n` +
      `chunked-value\r\n` +
      `--${BOUNDARY}--\r\n`;

    const half = Math.floor(body.length / 2);
    const promise = parseMultipartData(req);
    req.emit('data', Buffer.from(body.slice(0, half), 'binary'));
    req.emit('data', Buffer.from(body.slice(half), 'binary'));
    req.emit('end');

    const result = await promise;

    expect(result.fields).toEqual({ note: 'chunked-value' });
    expect(result.files).toEqual({});
  });

  it('rejects with "Arquivo muito grande" and destroys the connection when payload exceeds 50MB', async () => {
    const req = buildFakeRequest(`multipart/form-data; boundary=${BOUNDARY}`);
    let destroyed = false;
    req.connection.destroy = () => {
      destroyed = true;
    };

    const promise = parseMultipartData(req);
    // Swallow the eventual rejection so Node doesn't flag an unhandled rejection
    // before we get to the assertion below.
    promise.catch(() => {});

    const oversizedChunk = Buffer.alloc(51 * 1024 * 1024, 'a');
    req.emit('data', oversizedChunk);

    await expect(promise).rejects.toThrow('Arquivo muito grande');
    expect(destroyed).toBe(true);
  });

  it('rejects when the content-type header is missing entirely (malformed request)', async () => {
    const req = buildFakeRequest(undefined);

    const promise = parseMultipartData(req);
    req.emit('data', Buffer.from('irrelevant body', 'binary'));
    req.emit('end');

    // req.headers['content-type'] is undefined, so .split('boundary=') throws
    // a TypeError inside the try/catch, which is caught and reject()ed.
    await expect(promise).rejects.toThrow("Cannot read properties of undefined (reading 'split')");
  });

  it('resolves with empty fields and files when the body contains no matching boundary/Content-Disposition parts', async () => {
    const req = buildFakeRequest(`multipart/form-data; boundary=${BOUNDARY}`);

    const promise = parseMultipartData(req);
    req.emit('data', Buffer.from('random data with no boundary markers at all', 'binary'));
    req.emit('end');

    const result = await promise;

    expect(result).toEqual({ fields: {}, files: {} });
  });

  it('rejects with the stream error when the request emits an "error" event', async () => {
    const req = buildFakeRequest(`multipart/form-data; boundary=${BOUNDARY}`);
    const streamError = new Error('stream boom');

    const promise = parseMultipartData(req);
    req.emit('error', streamError);

    await expect(promise).rejects.toBe(streamError);
  });
});
