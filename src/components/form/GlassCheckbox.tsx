import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface GlassCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

const GlassCheckbox = React.forwardRef<HTMLInputElement, GlassCheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const checkboxId = id || props.name;

    return (
      <div className="space-y-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            'flex items-center gap-2.5 cursor-pointer group',
            className
          )}
        >
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="peer sr-only"
              {...props}
            />
            <div className="w-4 h-4 rounded border border-border bg-background/50 backdrop-blur-sm transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary peer-focus:ring-2 peer-focus:ring-primary/50 group-hover:border-primary/50">
              <Check className="w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity" />
            </div>
            <Check className="w-3 h-3 text-primary-foreground opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity peer-checked:opacity-100" />
          </div>
          <span className="text-xs text-foreground/70">{label}</span>
        </label>
        {error && (
          <p className="text-xs text-destructive ml-6">{error}</p>
        )}
      </div>
    );
  }
);

GlassCheckbox.displayName = 'GlassCheckbox';

export default GlassCheckbox;
