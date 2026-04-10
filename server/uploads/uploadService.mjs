import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../public/uploads');

// Criar diretório de uploads se não existir
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageFile = (mimeType, size) => {
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${ALLOWED_TYPES.join(', ')}`);
  }
  if (size > MAX_FILE_SIZE) {
    throw new Error(`Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
};

export const saveUploadedFile = async (buffer, mimeType, filename) => {
  validateImageFile(mimeType, buffer.length);
  
  const ext = mimeType.split('/')[1];
  const uniqueName = `${crypto.randomBytes(8).toString('hex')}-${Date.now()}.${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);
  
  await fs.promises.writeFile(filePath, buffer);
  
  return `/uploads/${uniqueName}`;
};

export const deleteUploadedFile = async (fileUrl) => {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
    return;
  }
  
  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
  }
};
