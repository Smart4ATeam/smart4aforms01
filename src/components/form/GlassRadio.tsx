import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
}

interface GlassRadioProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
}

const GlassRadio = forwardRef<HTMLDivElement, GlassRadioProps>(({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required,
  className,
}, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)}>
      {label && (
        <p className="text-xs font-medium text-foreground/70">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </p>
      )}
      <div className="space-y-1.5">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                className="peer sr-only"
              />
              <div className="w-4 h-4 rounded-full border border-border bg-background/50 backdrop-blur-sm transition-all duration-200 peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/50 group-hover:border-primary/50">
                <div className="w-2 h-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
              </div>
              <div className="w-2 h-2 rounded-full bg-primary opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity peer-checked:opacity-100" />
            </div>
            <span className="text-xs text-foreground/70">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
});

GlassRadio.displayName = 'GlassRadio';

export default GlassRadio;
