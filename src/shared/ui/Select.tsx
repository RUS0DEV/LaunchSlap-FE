import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, error, children, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <label className="block">
        {label ? (
          <span className="mb-1 block text-sm font-medium text-gray-800">
            {label}
          </span>
        ) : null}
        <select
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10',
            error && 'border-red-500 focus:border-red-600 focus:ring-red-500/10',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <span id={`${inputId}-error`} className="mt-1 block text-sm text-red-600">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

Select.displayName = 'Select';
