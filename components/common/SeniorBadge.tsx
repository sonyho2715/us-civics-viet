'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SeniorBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function SeniorBadge({
  className,
  size = 'sm',
  showLabel = true,
}: SeniorBadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 font-medium',
        sizes[size],
        className
      )}
    >
      <Star className={cn('text-amber-500 fill-amber-500', iconSizes[size])} />
      {showLabel && '65/20'}
    </span>
  );
}
