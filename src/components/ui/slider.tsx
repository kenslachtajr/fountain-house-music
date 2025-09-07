'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '~/lib/cn';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer touch-none select-none items-center',
      className,
    )}
    {...props}
  >
  <SliderPrimitive.Track className="relative h-2 md:h-0.5 w-full grow overflow-hidden rounded-full bg-neutral-600">
      <SliderPrimitive.Range className="absolute h-full bg-white" />
    </SliderPrimitive.Track>
  <SliderPrimitive.Thumb className="block h-7 w-7 md:h-4 md:w-4 rounded-full border-2 border-gray-200 bg-white ring-offset-[#0096FF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

type SimpleSliderProps = Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'value' | 'defaultValue' | 'onValueCommit' | 'onValueChange'
> & {
  value?: number;
  defaultValue?: number;
  onValueCommit?: (value: number) => void;
  onValueChange?: (value: number) => void;
};

const SimpleSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SimpleSliderProps
>(({ ...props }, ref) => (
  <Slider
    ref={ref}
    {...props}
    value={props.value ? [props.value] : undefined}
    defaultValue={props.defaultValue ? [props.defaultValue] : undefined}
    onValueCommit={([value]) => props.onValueCommit?.(value)}
    onValueChange={([value]) => props.onValueChange?.(value)}
  />
));

SimpleSlider.displayName = `Simple${SliderPrimitive.Root.displayName}`;

export { SimpleSlider, Slider };
