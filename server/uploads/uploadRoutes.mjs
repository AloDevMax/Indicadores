import express from 'express';
import { saveUploadedFile } from './uploadService.mjs';
import busboy from 'busboy';
import { requireAuthenticatedUser } from '../auth/service.mjs';

export const uploadRouter = express.Router();

const UPLOAD_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB

// Roda antes do parser: quem não pode enviar é recusado sem que o corpo seja lido.
const requireUploader = (canUpload) => async (req, res, next) => {
  try {
    const auth = await requireAuthenticatedUser(req.headers.authorization);
    if (auth.status !== 200) return res.status(auth.status).json(auth.body);
    if (!canUpload(auth.body.user)) return res.status(403).json({ error: 'Acesso restrito.' });

    req.authUser = auth.body.user;
    next();
  } catch (error) {
    next(error);
  }
};

// Aceita exatamente um arquivo, no campo esperado e dentro do limite de tamanho.
const parseSingleFile = (fieldName) => (req, res, next) => {
  let bb;
  try {
    bb = busboy({ headers: req.headers, limits: { files: 1, fields: 0, fileSize: UPLOAD_SIZE_LIMIT } });
  } catch {
    return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  let responded = false;
  const reject = (status, error) => {
    if (responded) return;
    responded = true;
    req.unpipe(bb);
    req.resume();
    res.status(status).json({ error });
  };
  const rejectShape = () => reject(400, `Envie um único arquivo no campo "${fieldName}".`);

  bb.on('file', (name, file, info) => {
    if (name !== fieldName) {
      file.resume();
      return rejectShape();
    }
    const chunks = [];
    file.on('data', (data) => chunks.push(data));
    file.on('limit', () => reject(413, `Arquivo muito grande. Máximo: ${UPLOAD_SIZE_LIMIT / 1024 / 1024}MB`));
    file.on('end', () => {
      if (file.truncated) return;
      req.file = { buffer: Buffer.concat(chunks), filename: info.filename, mimeType: info.mimeType };
    });
  });
  bb.on('filesLimit', rejectShape);
  bb.on('fieldsLimit', rejectShape);
  bb.on('close', () => {
    if (responded) return;
    if (!req.file) return reject(400, 'Nenhum arquivo enviado');
    next();
  });
  bb.on('error', () => reject(400, 'Envio de arquivo inválido.'));

  req.pipe(bb);
};

const handleImageUpload = ({ kind, responseKey, label }) => async (req, res) => {
  try {
    const { buffer, mimeType } = req.file;
    const url = await saveUploadedFile(buffer, mimeType, kind);
    res.json({ success: true, [responseKey]: url });
  } catch (error) {
    console.error(`Erro ao fazer upload de ${label}:`, error);
    res.status(400).json({ error: error.message });
  }
};

// A biblioteca de selos é do developer (ver POST /api/admin/badges); avatar, qualquer usuário autenticado.
uploadRouter.post(
  '/badge-image',
  requireUploader((user) => user.role === 'developer'),
  parseSingleFile('image'),
  handleImageUpload({ kind: 'badge', responseKey: 'imageUrl', label: 'imagem de selo' }),
);

uploadRouter.post(
  '/user-avatar',
  requireUploader(() => true),
  parseSingleFile('avatar'),
  handleImageUpload({ kind: 'avatar', responseKey: 'avatarUrl', label: 'avatar' }),
);
