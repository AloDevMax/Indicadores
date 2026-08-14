import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUpload } from './ImageUpload';

function makeFile(name: string, sizeInBytes: number, type = 'image/png'): File {
  const file = new File(['x'.repeat(Math.min(sizeInBytes, 10))], name, { type });
  Object.defineProperty(file, 'size', { value: sizeInBytes });
  return file;
}

describe('ImageUpload', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the label', () => {
    render(
      <ImageUpload
        label="Foto do selo"
        onImageUpload={vi.fn()}
        uploadEndpoint="badge-image"
        fieldName="image"
      />,
    );

    expect(screen.getByText('Foto do selo')).toBeInTheDocument();
  });

  it('uploads a file within the size limit and calls onImageUpload with the returned URL', async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const mockedFetch = vi.mocked(fetch);
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ imageUrl: '/uploads/badge-123.png' }),
    } as Response);

    render(
      <ImageUpload
        label="Foto do selo"
        onImageUpload={onImageUpload}
        uploadEndpoint="badge-image"
        fieldName="image"
      />,
    );

    const input = document.getElementById('file-input-image') as HTMLInputElement;
    const file = makeFile('badge.png', 1024);

    await user.upload(input, file);

    await waitFor(() => expect(onImageUpload).toHaveBeenCalledWith('/uploads/badge-123.png'));

    expect(mockedFetch).toHaveBeenCalledWith('/api/upload/badge-image', {
      method: 'POST',
      body: expect.any(FormData),
    });
  });

  it('shows a size-limit error and does not call fetch for an oversized file', async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const mockedFetch = vi.mocked(fetch);

    render(
      <ImageUpload
        label="Foto do selo"
        onImageUpload={onImageUpload}
        uploadEndpoint="badge-image"
        fieldName="image"
      />,
    );

    const input = document.getElementById('file-input-image') as HTMLInputElement;
    const oversizedFile = makeFile('too-big.png', 6 * 1024 * 1024);

    await user.upload(input, oversizedFile);

    expect(await screen.findByText('Arquivo muito grande. Máximo: 5MB')).toBeInTheDocument();
    expect(mockedFetch).not.toHaveBeenCalled();
    expect(onImageUpload).not.toHaveBeenCalled();
  });

  it('shows the server error message when the upload response is not ok', async () => {
    const user = userEvent.setup();
    const onImageUpload = vi.fn();
    const mockedFetch = vi.mocked(fetch);
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Formato inválido' }),
    } as Response);

    render(
      <ImageUpload
        label="Foto do selo"
        onImageUpload={onImageUpload}
        uploadEndpoint="user-avatar"
        fieldName="avatar"
      />,
    );

    const input = document.getElementById('file-input-avatar') as HTMLInputElement;
    const file = makeFile('avatar.png', 1024);

    await user.upload(input, file);

    expect(await screen.findByText('Formato inválido')).toBeInTheDocument();
    expect(onImageUpload).not.toHaveBeenCalled();
  });
});
