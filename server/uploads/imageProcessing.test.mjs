// @vitest-environment node
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { optimizeImage } from './imageProcessing.mjs';

const solidImage = (width, height, format = 'png') =>
  sharp({ create: { width, height, channels: 4, background: { r: 221, g: 50, b: 68, alpha: 1 } } })
    .toFormat(format)
    .toBuffer();

// Cores distintas por frame: o encoder de GIF funde frames idênticos.
const animatedGif = async (width, height, colors) => {
  const frames = await Promise.all(
    colors.map((background) => sharp({ create: { width, height, channels: 3, background } }).png().toBuffer())
  );
  return sharp(frames, { join: { animated: true } }).gif({ delay: 100 }).toBuffer();
};

describe('optimizeImage', () => {
  it('recorta o avatar em um quadrado de 256px e converte para WebP', async () => {
    const result = await optimizeImage(await solidImage(1200, 800, 'jpeg'), 'avatar');

    expect(result.mimeType).toBe('image/webp');
    expect(result.ext).toBe('webp');
    const meta = await sharp(result.buffer).metadata();
    expect(meta).toMatchObject({ format: 'webp', width: 256, height: 256 });
  });

  it.each(['badge'])('reduz %s para caber em 512px mantendo a proporção', async (kind) => {
    const result = await optimizeImage(await solidImage(2000, 1000), kind);

    const meta = await sharp(result.buffer).metadata();
    expect(meta).toMatchObject({ format: 'webp', width: 512, height: 256 });
  });

  it('não amplia imagens menores que o limite', async () => {
    const result = await optimizeImage(await solidImage(100, 60), 'badge');

    const meta = await sharp(result.buffer).metadata();
    expect(meta).toMatchObject({ width: 100, height: 60 });
  });

  it('gera um arquivo bem menor que o original', async () => {
    const original = await sharp({
      create: { width: 3000, height: 3000, channels: 3, noise: { type: 'gaussian', mean: 128, sigma: 40 } },
    }).png().toBuffer();

    const result = await optimizeImage(original, 'avatar');

    expect(result.buffer.length).toBeLessThan(original.length / 20);
  });

  it('mantém a animação de GIFs animados', async () => {
    const result = await optimizeImage(await animatedGif(600, 600, ['#EF8044', '#DD3244', '#000000']), 'badge');

    const meta = await sharp(result.buffer, { animated: true }).metadata();
    expect(meta).toMatchObject({ format: 'webp', pages: 3, width: 512, pageHeight: 512 });
  });

  it('rejeita bytes que não são uma imagem válida com uma mensagem amigável', async () => {
    await expect(optimizeImage(Buffer.from('não sou uma imagem'), 'avatar')).rejects.toThrow(
      'Arquivo de imagem inválido ou corrompido.'
    );
  });

  it('rejeita imagens com dimensões acima do limite de pixels', async () => {
    const huge = await sharp({ create: { width: 8000, height: 8000, channels: 3, background: '#000' } })
      .png({ compressionLevel: 9 })
      .toBuffer();

    await expect(optimizeImage(huge, 'badge')).rejects.toThrow('Arquivo de imagem inválido ou corrompido.');
  });

  it('rejeita um tipo de upload desconhecido', async () => {
    await expect(optimizeImage(await solidImage(10, 10), 'banner')).rejects.toThrow('Tipo de upload desconhecido: banner');
  });
});
