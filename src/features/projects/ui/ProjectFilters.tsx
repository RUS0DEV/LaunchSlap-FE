import { useMemo, useState } from 'react';
import type { ProjectCategory } from '@/entities/project/model/types';
import { categoryOptions } from '@/shared/constants/categories';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';

interface ProjectFiltersProps {
  category?: string;
  tags: string[];
  onChange: (filters: { category?: ProjectCategory | ''; tags: string[] }) => void;
}

export function ProjectFilters({
  category,
  tags,
  onChange,
}: ProjectFiltersProps) {
  const [tagValue, setTagValue] = useState(tags.join(', '));
  const parsedTags = useMemo(
    () =>
      tagValue
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagValue],
  );

  return (
    <form
      className="grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[220px_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault();
        onChange({ category: (category as ProjectCategory) || '', tags: parsedTags });
      }}
    >
      <Select
        label="Категория"
        value={category || ''}
        onChange={(event) =>
          onChange({
            category: event.target.value as ProjectCategory | '',
            tags: parsedTags,
          })
        }
      >
        <option value="">Все категории</option>
        {categoryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        label="Теги"
        value={tagValue}
        onChange={(event) => setTagValue(event.target.value)}
        placeholder="ai, productivity"
      />
      <div className="flex items-end">
        <Button type="submit" variant="secondary" className="w-full">
          Применить
        </Button>
      </div>
    </form>
  );
}
