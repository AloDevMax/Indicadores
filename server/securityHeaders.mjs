import helmet from 'helmet';

/**
 * Cabeçalhos de segurança (helmet). A CSP só deixa rodar scripts do próprio app: o Tailwind é compilado no
 * build, sem CDN nem script inline. HSTS e upgrade-insecure-requests só em produção: em
 * http://localhost eles forçariam HTTPS.
 */
export const securityHeaders = ({ isProduction }) => helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      // O React usa atributos style; tirar 'unsafe-inline' exige conferir a CSP no build servido.
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
