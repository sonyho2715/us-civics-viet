'use client';

import { cn } from '@/lib/utils';
import type { Locale } from '@/types';

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'unrated';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  locale: Locale;
  size?: 'sm' | 'md';
  className?: string;
}

const labels: Record<DifficultyLevel, { en: string; vi: string }> = {
  easy: { en: 'Easy', vi: 'Dễ' },
  medium: { en: 'Medium', vi: 'Trung bình' },
  hard: { en: 'Hard', vi: 'Khó' },
  unrated: { en: 'Unrated', vi: 'Chưa đánh giá' },
};

const variants: Record<DifficultyLevel, string> = {
  easy: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
  hard: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  unrated: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function DifficultyBadge({
  difficulty,
  locale,
  size = 'sm',
  className,
}: DifficultyBadgeProps) {
  const label = locale === 'vi' ? labels[difficulty].vi : labels[difficulty].en;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        variants[difficulty],
        sizes[size],
        className
      )}
    >
      {label}
    </span>
  );
}
