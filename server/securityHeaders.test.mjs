// @vitest-environment node
import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { inlineScriptHashes } from './securityHeaders.mjs';

const sha256 = (source) => `'sha256-${crypto.createHash('sha256').update(source).digest('base64')}'`;

describe('inlineScriptHashes', () => {
  it('hashes each inline script exactly as written, ignoring scripts loaded by src', () => {
    const config = '\n      tailwind.config = { theme: {} }\n    ';
    const html = `<html><head>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>${config}</script>
      <script type="module" crossorigin src="/assets/index-abc.js"></script>
    </head></html>`;

    expect(inlineScriptHashes(html)).toEqual([sha256(config)]);
  });

  it('returns no hashes when the page has no inline script', () => {
    expect(inlineScriptHashes('<html><script src="/a.js"></script></html>')).toEqual([]);
  });
});
