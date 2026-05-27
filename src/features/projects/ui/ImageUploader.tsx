import { useEffect, useState, type ChangeEvent } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

interface ImageUploaderProps {
  existingUrl?: string;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
}

export function ImageUploader({
  existingUrl,
  disabled,
  onFileChange,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(existingUrl || null);
  }, [existingUrl]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setError(null);

    if (!file) {
      onFileChange(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Поддерживаются только JPG и PNG');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Размер изображения не должен превышать 2 МБ');
      event.target.value = '';
      return;
    }

    onFileChange(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    onFileChange(null);
    setPreview(existingUrl || null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-gray-800">Изображение</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 sm:w-40">
          {preview ? (
            <img
              src={preview}
              alt="Preview проекта"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus className="h-8 w-8 text-gray-400" aria-hidden="true" />
          )}
        </div>
        <div className="space-y-2">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            disabled={disabled}
            onChange={handleChange}
            className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white disabled:opacity-60"
          />
          <p className="text-xs text-gray-500">JPG или PNG, до 2 МБ.</p>
          {preview ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
              leftIcon={<X className="h-4 w-4" aria-hidden="true" />}
            >
              Сбросить выбор
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
