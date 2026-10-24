import sharp from 'sharp';

// Tamanho final de cada tipo de upload. As imagens são exibidas pequenas na UI;
// guardar o original (até 5MB) só gasta Storage e egress do Supabase.
const PRESETS = {
  avatar: { width: 256, height: 256, fit: 'cover' },
  badge: { width: 512, height: 512, fit: 'inside' },
};

// Bem abaixo do padrão do sharp (~268M): barra "bombas" de descompressão,
// arquivos pequenos que declaram dimensões enormes.
const MAX_INPUT_PIXELS = 40_000_000;
const WEBP_QUALITY = 80;

export const optimizeImage = async (buffer, kind) => {
  const preset = PRESETS[kind];
  if (!preset) throw new Error(`Tipo de upload desconhecido: ${kind}`);

  try {
    const output = await sharp(buffer, { animated: true, autoOrient: true, limitInputPixels: MAX_INPUT_PIXELS })
      .resize({ ...preset, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    return { buffer: output, mimeType: 'image/webp', ext: 'webp' };
  } catch {
    throw new Error('Arquivo de imagem inválido ou corrompido.');
  }
};
