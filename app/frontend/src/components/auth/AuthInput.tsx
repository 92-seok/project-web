import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface IAuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  rightElement?: React.ReactNode;
  error?: boolean;
}

export function AuthInput({ icon: Icon, rightElement, error, className, ...props }: IAuthInputProps) {
  return (
    <div className='relative flex items-center'>
      <span className='pointer-events-none absolute left-3 z-10 text-muted-foreground'>
        <Icon size={16} />
      </span>
      <Input
        className={cn(
          'pl-9',
          rightElement && 'pr-10',
          error && 'border-destructive ring-3 ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20',
          className,
        )}
        {...props}
      />
      {rightElement && (
        <span className='absolute right-1 z-10 flex items-center'>
          {rightElement}
        </span>
      )}
    </div>
  );
}
