import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Project } from '@/entities/project/model/types';
import { ImageUploader } from '@/features/projects/ui/ImageUploader';
import {
  categoryOptions,
  normalizeProjectCategory,
} from '@/shared/constants/categories';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';

const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Введите название')
    .max(80, 'Название не должно превышать 80 символов'),
  description: z
    .string()
    .min(1, 'Введите описание')
    .max(1000, 'Описание не должно превышать 1000 символов'),
  url: z
    .string()
    .min(1, 'Укажите ссылку на проект')
    .url('Введите корректный URL'),
  category: z.enum([
    'saas',
    'web_app',
    'mobile_app',
    'ai_tool',
    'ecommerce',
    'education',
    'other',
  ]),
  tags: z.array(z.string()).max(5, 'Можно указать максимум 5 тегов').optional(),
  contact: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema> & {
  imageFile?: File | null;
};

interface ProjectFormProps {
  initialValues?: Partial<Project>;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
}

export function ProjectForm({
  initialValues,
  mode,
  isSubmitting,
  onSubmit,
}: ProjectFormProps) {
  const initialCategory = initialValues?.category
    ? normalizeProjectCategory(initialValues.category)
    : 'ai_tool';
  const [tagDraft, setTagDraft] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      url: initialValues?.url || '',
      category: initialCategory,
      tags: initialValues?.tags || [],
      contact: initialValues?.contact || '',
    },
  });

  useEffect(() => {
    reset({
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      url: initialValues?.url || '',
      category: initialValues?.category
        ? normalizeProjectCategory(initialValues.category)
        : 'ai_tool',
      tags: initialValues?.tags || [],
      contact: initialValues?.contact || '',
    });
  }, [initialValues, reset]);

  const tags = watch('tags') || [];

  const addTag = () => {
    const nextTag = tagDraft.trim().replace(/^#/, '');

    if (!nextTag || tags.includes(nextTag) || tags.length >= 5) {
      setTagDraft('');
      return;
    }

    setValue('tags', [...tags, nextTag], { shouldValidate: true });
    setTagDraft('');
  };

  const removeTag = (tag: string) => {
    setValue(
      'tags',
      tags.filter((item) => item !== tag),
      { shouldValidate: true },
    );
  };

  const submit = handleSubmit(async (values) => {
    await onSubmit({ ...values, imageFile });
  });

  return (
    <form className="space-y-5" onSubmit={submit}>
      <Input
        label="Название"
        maxLength={80}
        error={errors.name?.message}
        {...register('name')}
      />
      <Textarea
        label="Описание"
        maxLength={1000}
        error={errors.description?.message}
        {...register('description')}
      />
      <Input
        label="Ссылка на проект"
        type="url"
        error={errors.url?.message}
        {...register('url')}
      />
      <Select
        label="Категория"
        error={errors.category?.message}
        {...register('category')}
      >
        {categoryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <div className="space-y-2">
        <Input
          label="Теги"
          value={tagDraft}
          onChange={(event) => setTagDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder="Введите тег и нажмите Enter"
          disabled={tags.length >= 5}
        />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => removeTag(tag)}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-700"
            >
              #{tag}
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          ))}
        </div>
        {errors.tags?.message ? (
          <p className="text-sm text-red-600">{errors.tags.message}</p>
        ) : null}
      </div>
      <Input
        label="Контакт автора"
        placeholder="@telegram или email"
        error={errors.contact?.message}
        {...register('contact')}
      />
      <ImageUploader
        existingUrl={initialValues?.image_url}
        disabled={isSubmitting}
        onFileChange={setImageFile}
      />
      <Button type="submit" isLoading={isSubmitting}>
        {mode === 'create' ? 'Создать проект' : 'Сохранить изменения'}
      </Button>
    </form>
  );
}
