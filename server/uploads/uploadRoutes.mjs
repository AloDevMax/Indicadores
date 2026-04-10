import express from 'express';
import { saveUploadedFile } from './uploadService.mjs';
import busboy from 'busboy';

export const uploadRouter = express.Router();

// Middleware para parsing de multipart/form-data
const parseFormData = (req, res, next) => {
  const bb = busboy({ headers: req.headers });
  req.files = {};
  req.fields = {};

  bb.on('file', (fieldname, file, info) => {
    const chunks = [];
    file.on('data', data => {
      chunks.push(data);
    });
    file.on('end', () => {
      req.files[fieldname] = {
        buffer: Buffer.concat(chunks),
        filename: info.filename,
        mimeType: info.mimeType,
      };
    });
  });

  bb.on('field', (fieldname, val) => {
    req.fields[fieldname] = val;
  });

  bb.on('close', () => {
    next();
  });

  bb.on('error', (error) => {
    next(error);
  });

  req.pipe(bb);
};

// Upload de imagem de selo
uploadRouter.post('/badge-image', parseFormData, async (req, res) => {
  try {
    if (!req.files.image) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { buffer, mimeType } = req.files.image;
    const imageUrl = await saveUploadedFile(buffer, mimeType, 'badge');

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Erro ao fazer upload de imagem de selo:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upload de logo de empresa
uploadRouter.post('/company-logo', parseFormData, async (req, res) => {
  try {
    if (!req.files.logo) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { buffer, mimeType } = req.files.logo;
    const logoUrl = await saveUploadedFile(buffer, mimeType, 'company');

    res.json({ success: true, logoUrl });
  } catch (error) {
    console.error('Erro ao fazer upload de logo de empresa:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upload de avatar de usuário
uploadRouter.post('/user-avatar', parseFormData, async (req, res) => {
  try {
    if (!req.files.avatar) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const { buffer, mimeType } = req.files.avatar;
    const avatarUrl = await saveUploadedFile(buffer, mimeType, 'avatar');

    res.json({ success: true, avatarUrl });
  } catch (error) {
    console.error('Erro ao fazer upload de avatar:', error);
    res.status(400).json({ error: error.message });
  }
});
