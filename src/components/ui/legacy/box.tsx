import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '~/lib/cn';

export const Box = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-neutral h-fit w-full rounded-lg', className)}
      >
        {children}
      </div>
    );
  },
);

Box.displayName = 'Box';
