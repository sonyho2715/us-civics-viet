'use client';

import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'senior' | 'dynamic' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({
  variant = 'default',
  size = 'sm',
  className,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full';

  const variants = {
    default: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300',
    senior: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
    dynamic: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}

// Special badge for 65/20 questions
export function SeniorBadge({ className }: { className?: string }) {
  return (
    <Badge variant="senior" className={cn('gap-1', className)}>
      <span className="text-amber-500">★</span>
      65/20
    </Badge>
  );
}

// Badge for dynamic answer questions
export function DynamicBadge({ className }: { className?: string }) {
  return (
    <Badge variant="dynamic" className={cn('gap-1', className)}>
      <svg
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Dynamic
    </Badge>
  );
}
