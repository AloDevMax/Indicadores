import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  label: string;
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => void;
  uploadEndpoint: 'badge-image' | 'company-logo' | 'user-avatar';
  fieldName: 'image' | 'logo' | 'avatar';
  accepts?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  currentImageUrl,
  onImageUpload,
  uploadEndpoint,
  fieldName,
  accepts = 'image/jpeg,image/png,image/webp,image/gif'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo: 5MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await fetch(`/api/upload/${uploadEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer upload');
      }

      const data = await response.json();
      const imageUrl = data.imageUrl || data.logoUrl || data.avatarUrl;
      
      if (imageUrl) {
        onImageUpload(imageUrl);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer upload';
      setError(message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-4">
        {currentImageUrl && (
          <div className="relative">
            <img
              src={currentImageUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-slate-200"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={accepts}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id={`file-input-${fieldName}`}
          />
          <label
            htmlFor={`file-input-${fieldName}`}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-dark transition-colors cursor-pointer disabled:bg-slate-400"
          >
            {isUploading ? 'Enviando...' : 'Escolher arquivo'}
          </label>
          <p className="text-xs text-slate-500">
            {accepts === 'image/jpeg,image/png,image/webp,image/gif' 
              ? 'JPG, PNG, WebP, GIF - Máx: 5MB'
              : 'Verificar formato aceito'}
          </p>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        </div>
      </div>
    </div>
  );
};
