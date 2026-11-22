import crypto from 'node:crypto';
import { optimizeImage } from './imageProcessing.mjs';
import { getStorage } from './storage/index.mjs';

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

// kind: 'avatar' | 'badge' — define o tamanho final (ver imageProcessing.mjs).
export const saveUploadedFile = async (buffer, mimeType, kind) => {
  validateImageFile(mimeType, buffer.length);

  const optimized = await optimizeImage(buffer, kind);
  const uniqueName = `${crypto.randomBytes(8).toString('hex')}-${Date.now()}.${optimized.ext}`;
  return getStorage().put(uniqueName, optimized.buffer, optimized.mimeType);
};

// true só para URLs que o storage atual emitiu (ex.: /uploads/<nome> ou a URL pública do bucket).
export const isStoredUploadUrl = (url) => getStorage().ownsUrl(url);

export const deleteUploadedFile = async (fileUrl) => {
  try {
    await getStorage().remove(fileUrl);
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
  }
};
