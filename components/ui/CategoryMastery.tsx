'use client';

import { useEffect, useState, useMemo } from 'react';
import { Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { useQuestions } from '@/hooks/useQuestions';
import { useProgress } from '@/hooks/useProgress';
import { ProgressBar } from './ProgressBar';
import { CATEGORIES, type Category, type Locale } from '@/types';

interface CategoryMasteryProps {
  locale: Locale;
  compact?: boolean;
}

interface CategoryStats {
  id: Category;
  name: string;
  icon: string;
  total: number;
  studied: number;
  percentage: number;
  level: 'beginner' | 'learning' | 'proficient' | 'master';
}

function getMasteryLevel(percentage: number): 'beginner' | 'learning' | 'proficient' | 'master' {
  if (percentage >= 90) return 'master';
  if (percentage >= 70) return 'proficient';
  if (percentage >= 30) return 'learning';
  return 'beginner';
}

function getMasteryColor(level: CategoryStats['level']): string {
  switch (level) {
    case 'master':
      return 'bg-amber-500';
    case 'proficient':
      return 'bg-green-500';
    case 'learning':
      return 'bg-blue-500';
    default:
      return 'bg-gray-400';
  }
}

function getMasteryLabel(level: CategoryStats['level'], locale: Locale): string {
  const labels = {
    master: { vi: 'Thành thạo', en: 'Master' },
    proficient: { vi: 'Khá', en: 'Proficient' },
    learning: { vi: 'Đang học', en: 'Learning' },
    beginner: { vi: 'Mới bắt đầu', en: 'Beginner' },
  };
  return labels[level][locale];
}

export function CategoryMastery({ locale, compact = false }: CategoryMasteryProps) {
  const { questions } = useQuestions();
  const { questionsStudied } = useProgress();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categoryStats = useMemo<CategoryStats[]>(() => {
    return CATEGORIES.map((cat) => {
      // Get questions in this category
      const categoryQuestions = questions.filter((q) => q.category === cat.id);
      const total = categoryQuestions.length;

      // Count studied questions (by question id)
      const studiedInCategory = categoryQuestions.filter((q) =>
        questionsStudied.includes(q.id)
      ).length;

      const percentage = total > 0 ? Math.round((studiedInCategory / total) * 100) : 0;
      const level = getMasteryLevel(percentage);

      return {
        id: cat.id,
        name: locale === 'vi' ? cat.name_vi : cat.name_en,
        icon: cat.icon,
        total,
        studied: studiedInCategory,
        percentage,
        level,
      };
    });
  }, [questions, questionsStudied, locale]);

  // Calculate overall mastery
  const overallStats = useMemo(() => {
    const totalQuestions = categoryStats.reduce((sum, cat) => sum + cat.total, 0);
    const totalStudied = categoryStats.reduce((sum, cat) => sum + cat.studied, 0);
    const percentage = totalQuestions > 0 ? Math.round((totalStudied / totalQuestions) * 100) : 0;
    return { total: totalQuestions, studied: totalStudied, percentage, level: getMasteryLevel(percentage) };
  }, [categoryStats]);

  if (!mounted) {
    return null;
  }

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {categoryStats.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700"
          >
            <span className="text-xl mb-1">{cat.icon}</span>
            <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${getMasteryColor(cat.level)} transition-all duration-300`}
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {locale === 'vi' ? 'Tiến Độ Theo Danh Mục' : 'Category Progress'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            overallStats.level === 'master'
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              : overallStats.level === 'proficient'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : overallStats.level === 'learning'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
          }`}>
            {overallStats.percentage}% {locale === 'vi' ? 'Tổng' : 'Overall'}
          </span>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {categoryStats.map((cat) => (
          <div key={cat.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-slate-400">
                  {cat.studied}/{cat.total}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  cat.level === 'master'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    : cat.level === 'proficient'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : cat.level === 'learning'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
                }`}>
                  {getMasteryLabel(cat.level, locale)}
                </span>
              </div>
            </div>
            <ProgressBar
              progress={cat.percentage}
              color={cat.level === 'master' ? 'amber' : cat.level === 'proficient' ? 'green' : 'blue'}
              size="sm"
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            {locale === 'vi' ? '0-29%' : '0-29%'}
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {locale === 'vi' ? '30-69%' : '30-69%'}
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            {locale === 'vi' ? '70-89%' : '70-89%'}
          </span>
          <span className="flex items-center gap-1 text-gray-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            {locale === 'vi' ? '90-100%' : '90-100%'}
          </span>
        </div>
      </div>
    </div>
  );
}
