'use client';

import { useEffect, useState } from 'react';
import { Trophy, Lock, CheckCircle2, Star, Zap, TrendingUp } from 'lucide-react';
import { useAchievementStore } from '@/stores/achievementStore';
import { ACHIEVEMENTS, type AchievementId } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface AchievementsContentProps {
  locale: string;
}

export function AchievementsContent({ locale }: AchievementsContentProps) {
  const isVietnamese = locale === 'vi';
  const achievementStore = useAchievementStore();
  const [mounted, setMounted] = useState(false);
  const [showNewBanner, setShowNewBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (achievementStore.newAchievements.length > 0) {
      setShowNewBanner(true);
    }
  }, [achievementStore.newAchievements.length]);

  const handleDismissNewBanner = () => {
    setShowNewBanner(false);
    achievementStore.clearNewAchievements();
  };

  if (!mounted) {
    return null;
  }

  const levelProgress = achievementStore.getLevelProgress();
  const xpForNextLevel = achievementStore.getXPForNextLevel();
  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = achievementStore.unlockedAchievements.length;

  // Group achievements by category for better organization
  const earlyAchievements = ACHIEVEMENTS.filter((a) =>
    ['first_question', 'first_test', 'first_pass'].includes(a.id)
  );
  const streakAchievements = ACHIEVEMENTS.filter((a) => ['streak_7', 'streak_30'].includes(a.id));
  const categoryAchievements = ACHIEVEMENTS.filter((a) =>
    ['category_master_gov', 'category_master_history', 'category_master_symbols'].includes(a.id)
  );
  const masteryAchievements = ACHIEVEMENTS.filter((a) =>
    ['all_questions', 'perfect_test', 'senior_ready'].includes(a.id)
  );
  const specialAchievements = ACHIEVEMENTS.filter((a) =>
    ['speed_demon', 'bookworm', 'flashcard_pro'].includes(a.id)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-amber-500" />
          {isVietnamese ? 'Thành Tựu' : 'Achievements'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isVietnamese
            ? 'Mở khóa thành tựu khi bạn học tập và tiến bộ'
            : 'Unlock achievements as you learn and progress'}
        </p>
      </div>

      {/* New Achievements Banner */}
      {showNewBanner && achievementStore.newAchievements.length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                  {isVietnamese ? '🎉 Thành tựu mới!' : '🎉 New Achievement!'}
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                {isVietnamese
                  ? `Bạn vừa mở khóa ${achievementStore.newAchievements.length} thành tựu mới!`
                  : `You just unlocked ${achievementStore.newAchievements.length} new achievement${achievementStore.newAchievements.length > 1 ? 's' : ''}!`}
              </p>
              <div className="flex flex-wrap gap-2">
                {achievementStore.newAchievements.map((id) => {
                  const achievement = ACHIEVEMENTS.find((a) => a.id === id);
                  if (!achievement) return null;
                  return (
                    <div
                      key={id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {isVietnamese ? achievement.name_vi : achievement.name_en}
                      </span>
                      <Badge variant="success" size="sm">
                        +{achievement.xp} XP
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismissNewBanner}>
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Level & XP Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {isVietnamese ? 'Cấp Độ & Kinh Nghiệm' : 'Level & Experience'}
                </CardTitle>
                <CardDescription>
                  {isVietnamese
                    ? 'Kiếm XP bằng cách mở khóa thành tựu'
                    : 'Earn XP by unlocking achievements'}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {isVietnamese ? 'Cấp' : 'Level'} {achievementStore.level}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {achievementStore.totalXP} {isVietnamese ? 'tổng XP' : 'total XP'}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {isVietnamese ? 'Tiến độ đến cấp tiếp theo' : 'Progress to next level'}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {xpForNextLevel > 0 ? (
                    <>
                      {xpForNextLevel} XP {isVietnamese ? 'còn lại' : 'remaining'}
                    </>
                  ) : (
                    isVietnamese ? 'Cấp tối đa!' : 'Max level!'
                  )}
                </span>
              </div>
              <ProgressBar progress={levelProgress} size="lg" color="blue" />
              <div className="flex items-center gap-2 pt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isVietnamese
                    ? 'Tiếp tục mở khóa thành tựu để lên cấp!'
                    : 'Keep unlocking achievements to level up!'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              {isVietnamese ? 'Thống Kê' : 'Statistics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {unlockedCount}/{totalAchievements}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {isVietnamese ? 'Thành tựu đã mở' : 'Achievements Unlocked'}
                </div>
              </div>
              <ProgressBar
                progress={Math.round((unlockedCount / totalAchievements) * 100)}
                size="md"
                color="amber"
              />
              <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {isVietnamese ? 'Tổng XP đã kiếm' : 'Total XP Earned'}
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {achievementStore.totalXP} XP
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Sections */}
      <div className="space-y-8">
        {/* Early Achievements */}
        <AchievementSection
          title={isVietnamese ? '🎯 Bước Đầu Tiên' : '🎯 Getting Started'}
          achievements={earlyAchievements}
          isVietnamese={isVietnamese}
          isUnlocked={achievementStore.isUnlocked}
        />

        {/* Streak Achievements */}
        <AchievementSection
          title={isVietnamese ? '🔥 Chuỗi Ngày Học' : '🔥 Study Streaks'}
          achievements={streakAchievements}
          isVietnamese={isVietnamese}
          isUnlocked={achievementStore.isUnlocked}
        />

        {/* Category Achievements */}
        <AchievementSection
          title={isVietnamese ? '📚 Thành Thạo Danh Mục' : '📚 Category Mastery'}
          achievements={categoryAchievements}
          isVietnamese={isVietnamese}
          isUnlocked={achievementStore.isUnlocked}
        />

        {/* Mastery Achievements */}
        <AchievementSection
          title={isVietnamese ? '🎓 Bậc Thầy' : '🎓 Expert Level'}
          achievements={masteryAchievements}
          isVietnamese={isVietnamese}
          isUnlocked={achievementStore.isUnlocked}
        />

        {/* Special Achievements */}
        <AchievementSection
          title={isVietnamese ? '⭐ Đặc Biệt' : '⭐ Special'}
          achievements={specialAchievements}
          isVietnamese={isVietnamese}
          isUnlocked={achievementStore.isUnlocked}
        />
      </div>
    </div>
  );
}

interface AchievementSectionProps {
  title: string;
  achievements: typeof ACHIEVEMENTS;
  isVietnamese: boolean;
  isUnlocked: (id: AchievementId) => boolean;
}

function AchievementSection({
  title,
  achievements,
  isVietnamese,
  isUnlocked,
}: AchievementSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const unlocked = isUnlocked(achievement.id);
          return (
            <Card
              key={achievement.id}
              className={cn(
                'transition-all duration-200',
                unlocked
                  ? 'border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/10'
                  : 'opacity-60 grayscale'
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-3xl',
                      unlocked
                        ? 'bg-amber-100 dark:bg-amber-900/30'
                        : 'bg-gray-100 dark:bg-slate-700'
                    )}
                  >
                    {unlocked ? achievement.icon : <Lock className="h-6 w-6 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {isVietnamese ? achievement.name_vi : achievement.name_en}
                      </h3>
                      {unlocked && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {isVietnamese ? achievement.description_vi : achievement.description_en}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={unlocked ? 'warning' : 'default'}
                        size="sm"
                        className="font-semibold"
                      >
                        {achievement.xp} XP
                      </Badge>
                      {unlocked ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {isVietnamese ? '✓ Đã mở khóa' : '✓ Unlocked'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isVietnamese ? '🔒 Đã khóa' : '🔒 Locked'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
