import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import helmet from 'helmet';

// O frontend ainda carrega o Tailwind pelo CDN em tempo de execução, com a configuração num <script> inline.
const TAILWIND_CDN = 'https://cdn.tailwindcss.com';
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

/** Hashes CSP ('sha256-...') dos <script> inline da página, exatamente como estão escritos. */
export const inlineScriptHashes = (html) => [...html.matchAll(INLINE_SCRIPT)]
  .map(([, source]) => `'sha256-${crypto.createHash('sha256').update(source).digest('base64')}'`);

const readInlineScriptHashes = (clientDir) => {
  const indexHtmlPath = path.join(clientDir, 'index.html');
  return fs.existsSync(indexHtmlPath) ? inlineScriptHashes(fs.readFileSync(indexHtmlPath, 'utf8')) : [];
};

/**
 * Cabeçalhos de segurança (helmet). A CSP libera só o app, o CDN do Tailwind e o script inline de configuração
 * (pelo hash, calculado do index.html servido). HSTS e upgrade-insecure-requests só em produção: em
 * http://localhost eles forçariam HTTPS.
 */
export const securityHeaders = ({ clientDir, isProduction }) => helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", TAILWIND_CDN, ...readInlineScriptHashes(clientDir)],
      scriptSrcAttr: ["'none'"],
      // O Tailwind do CDN injeta <style> em tempo de execução, e o React usa atributos style.
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      // https: cobre o bucket do Supabase e avatares/selos antigos gravados com URL externa.
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'"],
      ...(isProduction && { upgradeInsecureRequests: [] }),
    },
  },
  strictTransportSecurity: isProduction,
  xFrameOptions: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});
