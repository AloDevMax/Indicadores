import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mesmo diretório servido em /uploads pelo server/index.mjs (public/uploads, ao lado de server/).
export const LOCAL_UPLOADS_DIR = path.join(__dirname, '../../../public/uploads');

const URL_PREFIX = '/uploads/';

export const createLocalStorage = ({ dir = LOCAL_UPLOADS_DIR } = {}) => ({
  async put(name, buffer) {
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(path.join(dir, name), buffer);
    return `${URL_PREFIX}${name}`;
  },

  async remove(url) {
    if (!url || !url.startsWith(URL_PREFIX)) return;
    // basename impede path traversal (/uploads/../../x)
    await fs.promises.rm(path.join(dir, path.basename(url)), { force: true });
  },
});
