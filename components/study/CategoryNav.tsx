'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';
import { CATEGORIES } from '@/types';

interface CategoryNavProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
  counts?: Record<Category | 'all', number>;
}

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
  counts,
}: CategoryNavProps) {
  const t = useTranslations('study');

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          selectedCategory === null
            ? 'bg-blue-800 dark:bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
        )}
      >
        {t('allQuestions')}
        {counts && (
          <span className="ml-2 text-xs opacity-75">({counts.all})</span>
        )}
      </button>

      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            selectedCategory === category.id
              ? 'bg-blue-800 dark:bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
          )}
        >
          <span>{category.icon}</span>
          <span className="hidden sm:inline">
            {t(`categories.${category.id}`)}
          </span>
          {counts && (
            <span className="text-xs opacity-75">
              ({counts[category.id]})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
