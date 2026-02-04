'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Flame, Trophy, Target } from 'lucide-react';
import { useStreakStore } from '@/stores/streakStore';
import { ProgressBar } from './ProgressBar';

interface StreakDisplayProps {
  compact?: boolean;
}

export function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const t = useTranslations('streak');
  const {
    currentStreak,
    longestStreak,
    dailyGoal,
    todayProgress,
    getStreakStatus,
  } = useStreakStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const status = getStreakStatus();
  const todayTotal = todayProgress
    ? todayProgress.questionsStudied +
      todayProgress.testsCompleted * 10 +
      todayProgress.flashcardsReviewed
    : 0;

  const streakColor =
    currentStreak >= 30
      ? 'text-amber-500'
      : currentStreak >= 7
        ? 'text-orange-500'
        : 'text-red-500';

  const streakBgColor =
    currentStreak >= 30
      ? 'bg-amber-100 dark:bg-amber-900/30'
      : currentStreak >= 7
        ? 'bg-orange-100 dark:bg-orange-900/30'
        : 'bg-red-100 dark:bg-red-900/30';

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${streakBgColor}`}>
        <Flame className={`w-4 h-4 ${streakColor}`} />
        <span className={`text-sm font-bold ${streakColor}`}>{currentStreak}</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
      {/* Streak Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${streakBgColor}`}>
            <Flame className={`w-6 h-6 ${streakColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('dayStreak')}
            </p>
            <p className={`text-2xl font-bold ${streakColor}`}>
              {currentStreak} {t('days')}
            </p>
          </div>
        </div>

        {/* Best streak */}
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-500">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">{longestStreak}</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500">
            {t('best')}
          </p>
        </div>
      </div>

      {/* Daily Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Target className="w-4 h-4" />
            {t('todaysGoal')}
          </span>
          <span className="font-medium text-gray-900 dark:text-white">
            {todayTotal}/{dailyGoal}
          </span>
        </div>
        <ProgressBar
          progress={status.percentComplete}
          color={status.percentComplete >= 100 ? 'green' : 'blue'}
          size="sm"
        />
      </div>

      {/* Activity Summary */}
      {todayProgress && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
            <p className="font-bold text-blue-700 dark:text-blue-300">
              {todayProgress.questionsStudied}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {t('studied')}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
            <p className="font-bold text-green-700 dark:text-green-300">
              {todayProgress.testsCompleted}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {t('tests')}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
            <p className="font-bold text-purple-700 dark:text-purple-300">
              {todayProgress.flashcardsReviewed}
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {t('cards')}
            </p>
          </div>
        </div>
      )}

      {/* Streak Status */}
      {!status.isActive && currentStreak === 0 && (
        <p className="text-center text-sm text-gray-400 dark:text-slate-500 mt-3">
          {t('startStudying')}
        </p>
      )}

      {/* Milestone Badges */}
      {currentStreak >= 7 && (
        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
          {currentStreak >= 7 && (
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
              {t('oneWeek')}
            </span>
          )}
          {currentStreak >= 30 && (
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
              {t('oneMonth')}
            </span>
          )}
          {currentStreak >= 100 && (
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
              {t('hundredDays')}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
