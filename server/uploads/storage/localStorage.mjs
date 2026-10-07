import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mesmo diretório servido em /uploads pelo server/index.mjs (public/uploads, ao lado de server/).
export const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../../public/uploads');

const URL_PREFIX = '/uploads/';
// Nomes gerados pelo uploadService: sem barras e nunca só pontos (evita path traversal).
export const OBJECT_NAME = /^(?!\.+$)[\w.-]+$/;

export const nameFromUrl = (url, prefix) =>
  typeof url === 'string' && url.startsWith(prefix) && OBJECT_NAME.test(url.slice(prefix.length))
    ? url.slice(prefix.length)
    : null;

export const createLocalStorage = ({ dir = LOCAL_UPLOADS_DIR } = {}) => ({
  ownsUrl: (url) => nameFromUrl(url, URL_PREFIX) !== null,

  async put(name, buffer) {
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(path.join(dir, name), buffer);
    return `${URL_PREFIX}${name}`;
  },

  async remove(url) {
    const name = nameFromUrl(url, URL_PREFIX);
    if (!name) return;
    await fs.promises.rm(path.join(dir, name), { force: true });
  },
});
