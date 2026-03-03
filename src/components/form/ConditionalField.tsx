import React from 'react';
import { cn } from '@/lib/utils';

interface ConditionalFieldProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

const ConditionalField: React.FC<ConditionalFieldProps> = ({
  show,
  children,
  className,
}) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        'animate-fade-in',
        className
      )}
    >
      {children}
    </div>
  );
};

export default ConditionalField;
