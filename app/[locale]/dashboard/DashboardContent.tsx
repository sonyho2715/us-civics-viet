'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  Flame,
  BarChart3,
  Zap,
  AlertCircle,
  BookOpen,
  Trophy,
  ArrowRight,
  Layers,
  Smartphone,
} from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { useStreakStore } from '@/stores/streakStore';
import { useWrongAnswerStore } from '@/stores/wrongAnswerStore';
import { useSpacedRepetitionStore } from '@/stores/spacedRepetitionStore';
import { useQuestions } from '@/hooks/useQuestions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, type Category, type Locale } from '@/types';
import Link from 'next/link';

interface DashboardContentProps {
  locale: string;
}

interface CategoryProgress {
  id: Category;
  name: string;
  icon: string;
  studied: number;
  total: number;
  percentage: number;
  masteryLevel: 'beginner' | 'learning' | 'proficient' | 'master';
}

interface StudyRecommendation {
  type: 'weak_areas' | 'spaced_repetition' | 'category_balance' | 'new_content';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  questionNumbers?: number[];
}

function getMasteryLevel(percentage: number): 'beginner' | 'learning' | 'proficient' | 'master' {
  if (percentage >= 90) return 'master';
  if (percentage >= 70) return 'proficient';
  if (percentage >= 30) return 'learning';
  return 'beginner';
}

function getMasteryColor(level: 'beginner' | 'learning' | 'proficient' | 'master'): string {
  switch (level) {
    case 'master':
      return 'text-amber-600 dark:text-amber-400';
    case 'proficient':
      return 'text-green-600 dark:text-green-400';
    case 'learning':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
}

export function DashboardContent({ locale }: DashboardContentProps) {
  const isVietnamese = locale === 'vi';
  const { questions } = useQuestions();
  const progressStore = useProgressStore();
  const streakStore = useStreakStore();
  const wrongAnswerStore = useWrongAnswerStore();
  const spacedRepStore = useSpacedRepetitionStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Overall Progress Calculation
  const overallProgress = useMemo(() => {
    const totalQuestions = 128;
    const studied = progressStore.questionsStudied.length;
    const correct = progressStore.questionsCorrect.length;
    const incorrect = progressStore.questionsIncorrect.length;
    const accuracy = studied > 0 ? Math.round((correct / studied) * 100) : 0;
    const passRate =
      progressStore.testsCompleted > 0
        ? Math.round((progressStore.testsPassed / progressStore.testsCompleted) * 100)
        : 0;

    return {
      studied,
      totalQuestions,
      percentage: Math.round((studied / totalQuestions) * 100),
      correct,
      incorrect,
      accuracy,
      testsCompleted: progressStore.testsCompleted,
      testsPassed: progressStore.testsPassed,
      passRate,
    };
  }, [progressStore]);

  // Category Progress Calculation
  const categoryProgress = useMemo<CategoryProgress[]>(() => {
    return CATEGORIES.map((cat) => {
      const categoryQuestions = questions.filter((q) => q.category === cat.id);
      const total = categoryQuestions.length;
      const studied = categoryQuestions.filter((q) =>
        progressStore.questionsStudied.includes(q.id)
      ).length;
      const percentage = total > 0 ? Math.round((studied / total) * 100) : 0;

      return {
        id: cat.id,
        name: isVietnamese ? cat.name_vi : cat.name_en,
        icon: cat.icon,
        studied,
        total,
        percentage,
        masteryLevel: getMasteryLevel(percentage),
      };
    });
  }, [questions, progressStore.questionsStudied, isVietnamese]);

  // Streak Calendar Data (last 30 days)
  const calendarData = useMemo(() => {
    const today = new Date();
    const days: Array<{
      date: string;
      dayOfWeek: number;
      activity: number;
      isToday: boolean;
    }> = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const dayHistory = streakStore.history.find((h) => h.date === dateString);
      const activity = dayHistory
        ? dayHistory.questionsStudied + dayHistory.testsCompleted * 5 + dayHistory.flashcardsReviewed
        : 0;

      days.push({
        date: dateString,
        dayOfWeek: date.getDay(),
        activity,
        isToday: dateString === today.toISOString().split('T')[0],
      });
    }

    return days;
  }, [streakStore.history]);

  // Study Recommendations
  const recommendations = useMemo<StudyRecommendation[]>(() => {
    const recs: StudyRecommendation[] = [];

    // 1. Wrong answers (high priority)
    const wrongQuestions = wrongAnswerStore.wrongAnswers
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 10);

    if (wrongQuestions.length > 0) {
      recs.push({
        type: 'weak_areas',
        priority: 'high',
        title: isVietnamese ? 'Ôn lại câu sai' : 'Review Weak Areas',
        description: isVietnamese
          ? `Bạn có ${wrongQuestions.length} câu cần ôn lại. Tập trung vào những câu này để cải thiện.`
          : `You have ${wrongQuestions.length} questions to review. Focus on these to improve.`,
        actionLabel: isVietnamese ? 'Xem câu sai' : 'Review Now',
        actionUrl: `/${locale}/study?filter=wrong`,
        questionNumbers: wrongQuestions.map((w) => w.questionNumber),
      });
    }

    // 2. Spaced Repetition due cards (high priority)
    const dueCards = spacedRepStore.getDueCards();
    if (dueCards.length > 0) {
      recs.push({
        type: 'spaced_repetition',
        priority: 'high',
        title: isVietnamese ? 'Flashcards cần ôn' : 'Due Flashcards',
        description: isVietnamese
          ? `${dueCards.length} flashcards đã đến hạn ôn tập. Ôn ngay để nhớ lâu hơn!`
          : `${dueCards.length} flashcards are due for review. Review them to retain better!`,
        actionLabel: isVietnamese ? 'Ôn Flashcards' : 'Review Flashcards',
        actionUrl: `/${locale}/flashcards`,
        questionNumbers: dueCards,
      });
    }

    // 3. Category balance (medium priority)
    const unbalancedCategories = categoryProgress.filter((cat) => cat.percentage < 50);
    if (unbalancedCategories.length > 0) {
      const lowestCat = unbalancedCategories.sort((a, b) => a.percentage - b.percentage)[0];
      recs.push({
        type: 'category_balance',
        priority: 'medium',
        title: isVietnamese ? 'Cân bằng danh mục' : 'Balance Your Learning',
        description: isVietnamese
          ? `Danh mục "${lowestCat.name}" cần học thêm (${lowestCat.percentage}%).`
          : `Category "${lowestCat.name}" needs attention (${lowestCat.percentage}%).`,
        actionLabel: isVietnamese ? 'Học ngay' : 'Study Now',
        actionUrl: `/${locale}/study?category=${lowestCat.id}`,
      });
    }

    // 4. New content (low priority if already studied a lot)
    const unstudied = 128 - progressStore.questionsStudied.length;
    if (unstudied > 0 && unstudied > 20) {
      recs.push({
        type: 'new_content',
        priority: 'low',
        title: isVietnamese ? 'Học câu mới' : 'Explore New Content',
        description: isVietnamese
          ? `Còn ${unstudied} câu chưa học. Khám phá nội dung mới!`
          : `${unstudied} questions left to study. Explore new content!`,
        actionLabel: isVietnamese ? 'Khám phá' : 'Explore',
        actionUrl: `/${locale}/study`,
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [wrongAnswerStore.wrongAnswers, spacedRepStore, categoryProgress, progressStore, isVietnamese, locale]);

  // Predicted Readiness Score (0-100)
  const readinessScore = useMemo(() => {
    // Factors:
    // 1. Study coverage (0-40 points)
    const coverageScore = Math.min(40, (overallProgress.percentage / 100) * 40);

    // 2. Accuracy (0-30 points)
    const accuracyScore = (overallProgress.accuracy / 100) * 30;

    // 3. Streak (0-15 points)
    const streakScore = Math.min(15, (streakStore.currentStreak / 14) * 15); // Max at 14 days

    // 4. Category balance (0-15 points) - lower standard deviation is better
    const categoryPercentages = categoryProgress.map((c) => c.percentage);
    const avgPercentage = categoryPercentages.reduce((a, b) => a + b, 0) / categoryPercentages.length;
    const variance =
      categoryPercentages.reduce((sum, p) => sum + Math.pow(p - avgPercentage, 2), 0) /
      categoryPercentages.length;
    const stdDev = Math.sqrt(variance);
    const balanceScore = Math.max(0, 15 - (stdDev / 100) * 15);

    const total = Math.round(coverageScore + accuracyScore + streakScore + balanceScore);
    return Math.min(100, total);
  }, [overallProgress, streakStore.currentStreak, categoryProgress]);

  // Get activity level for calendar
  const getActivityColor = (activity: number): string => {
    if (activity === 0) return 'bg-gray-100 dark:bg-slate-800';
    if (activity < 5) return 'bg-blue-200 dark:bg-blue-900/40';
    if (activity < 10) return 'bg-blue-400 dark:bg-blue-700/60';
    if (activity < 20) return 'bg-blue-600 dark:bg-blue-600/80';
    return 'bg-blue-700 dark:bg-blue-500';
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isVietnamese ? 'Bảng Điều Khiển' : 'Progress Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isVietnamese
            ? 'Theo dõi tiến độ học tập và nhận đề xuất cá nhân hóa'
            : 'Track your learning progress and get personalized recommendations'}
        </p>

        {/* Local Storage Notice */}
        <div className="mt-4 flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <Smartphone className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            {isVietnamese
              ? 'Tiến độ của bạn được lưu trên thiết bị này. Nếu bạn dùng thiết bị khác, tiến độ sẽ không được đồng bộ.'
              : 'Your progress is saved on this device only. If you use a different device, your progress will not sync.'}
          </p>
        </div>
      </div>

      {/* Overall Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isVietnamese ? 'Câu đã học' : 'Questions Studied'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {overallProgress.studied}/{overallProgress.totalQuestions}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  {overallProgress.percentage}% {isVietnamese ? 'hoàn thành' : 'complete'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isVietnamese ? 'Độ chính xác' : 'Accuracy'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {overallProgress.accuracy}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  {overallProgress.correct} {isVietnamese ? 'đúng' : 'correct'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isVietnamese ? 'Chuỗi ngày' : 'Streak'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {streakStore.currentStreak} {isVietnamese ? 'ngày' : 'days'}
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  {isVietnamese ? 'Dài nhất' : 'Longest'}: {streakStore.longestStreak}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isVietnamese ? 'Tỷ lệ đậu' : 'Pass Rate'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {overallProgress.passRate}%
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  {overallProgress.testsPassed}/{overallProgress.testsCompleted}{' '}
                  {isVietnamese ? 'bài thi' : 'tests'}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Readiness Score */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    {isVietnamese ? 'Mức Độ Sẵn Sàng' : 'Readiness Score'}
                  </CardTitle>
                  <CardDescription>
                    {isVietnamese
                      ? 'Dự đoán khả năng vượt qua bài thi dựa trên tiến độ của bạn'
                      : 'Predicted test readiness based on your progress'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                <ProgressRing progress={readinessScore} size="xl" strokeWidth={12}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {readinessScore}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {isVietnamese ? 'điểm' : 'score'}
                    </div>
                  </div>
                </ProgressRing>
                <div className="flex-1">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {isVietnamese ? 'Phạm vi học' : 'Coverage'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {overallProgress.percentage}%
                        </span>
                      </div>
                      <ProgressBar progress={overallProgress.percentage} size="sm" color="blue" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {isVietnamese ? 'Độ chính xác' : 'Accuracy'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {overallProgress.accuracy}%
                        </span>
                      </div>
                      <ProgressBar progress={overallProgress.accuracy} size="sm" color="green" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">
                          {isVietnamese ? 'Chuỗi ngày' : 'Consistency'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.min(100, Math.round((streakStore.currentStreak / 14) * 100))}%
                        </span>
                      </div>
                      <ProgressBar
                        progress={Math.min(100, Math.round((streakStore.currentStreak / 14) * 100))}
                        size="sm"
                        color="amber"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {readinessScore >= 80
                        ? isVietnamese
                          ? '🎉 Bạn đã sẵn sàng! Hãy thử làm bài thi thật.'
                          : '🎉 You\'re ready! Try taking a full practice test.'
                        : readinessScore >= 60
                          ? isVietnamese
                            ? '📚 Gần rồi! Tập trung vào các điểm yếu.'
                            : '📚 Almost there! Focus on your weak areas.'
                          : isVietnamese
                            ? '💪 Tiếp tục cố gắng! Học đều đặn mỗi ngày.'
                            : '💪 Keep going! Study consistently every day.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {isVietnamese ? 'Lịch Hoạt Động (30 ngày qua)' : 'Activity Calendar (Last 30 Days)'}
              </CardTitle>
              <CardDescription>
                {isVietnamese
                  ? 'Màu đậm hơn = hoạt động nhiều hơn'
                  : 'Darker colors = more activity'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Day labels */}
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400 py-1">
                    {/* Empty space for alignment */}
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-xs text-gray-500 dark:text-gray-400">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <div></div>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Add empty cells for alignment */}
                    {Array.from({ length: calendarData[0]?.dayOfWeek || 0 }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {calendarData.map((day, index) => (
                      <div
                        key={index}
                        className={`aspect-square rounded-sm ${getActivityColor(day.activity)} ${
                          day.isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''
                        } transition-colors cursor-pointer hover:ring-2 hover:ring-gray-400`}
                        title={`${day.date}: ${day.activity} ${isVietnamese ? 'hoạt động' : 'activities'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{isVietnamese ? 'Ít' : 'Less'}</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-slate-800" />
                    <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900/40" />
                    <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700/60" />
                    <div className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-blue-600/80" />
                    <div className="w-3 h-3 rounded-sm bg-blue-700 dark:bg-blue-500" />
                  </div>
                  <span>{isVietnamese ? 'Nhiều' : 'More'}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {streakStore.currentStreak}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isVietnamese ? 'Chuỗi hiện tại' : 'Current Streak'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {streakStore.longestStreak}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isVietnamese ? 'Chuỗi dài nhất' : 'Longest Streak'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {streakStore.totalDaysStudied}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {isVietnamese ? 'Tổng ngày học' : 'Total Days'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Mastery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                {isVietnamese ? 'Tiến Độ Theo Danh Mục' : 'Category Mastery'}
              </CardTitle>
              <CardDescription>
                {isVietnamese ? 'Mức độ thành thạo theo từng danh mục' : 'Mastery level by category'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryProgress.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {cat.studied}/{cat.total}
                        </span>
                        <Badge
                          variant={
                            cat.masteryLevel === 'master'
                              ? 'warning'
                              : cat.masteryLevel === 'proficient'
                                ? 'success'
                                : cat.masteryLevel === 'learning'
                                  ? 'info'
                                  : 'default'
                          }
                        >
                          {isVietnamese
                            ? cat.masteryLevel === 'master'
                              ? 'Thành thạo'
                              : cat.masteryLevel === 'proficient'
                                ? 'Khá'
                                : cat.masteryLevel === 'learning'
                                  ? 'Đang học'
                                  : 'Mới'
                            : cat.masteryLevel.charAt(0).toUpperCase() + cat.masteryLevel.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar
                      progress={cat.percentage}
                      size="md"
                      color={
                        cat.masteryLevel === 'master'
                          ? 'amber'
                          : cat.masteryLevel === 'proficient'
                            ? 'green'
                            : 'blue'
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recommendations and Activity */}
        <div className="space-y-6">
          {/* Study Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                {isVietnamese ? 'Đề Xuất Học Tập' : 'Study Recommendations'}
              </CardTitle>
              <CardDescription>
                {isVietnamese ? 'AI gợi ý dựa trên tiến độ của bạn' : 'AI-driven suggestions for you'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="font-medium">
                      {isVietnamese ? 'Tuyệt vời!' : 'Great job!'}
                    </p>
                    <p className="text-sm">
                      {isVietnamese
                        ? 'Không có đề xuất nào. Bạn đang học rất tốt!'
                        : 'No recommendations. You\'re doing great!'}
                    </p>
                  </div>
                ) : (
                  recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.priority === 'high'
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                          : rec.priority === 'medium'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {rec.title}
                        </h4>
                        {rec.priority === 'high' && (
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {rec.description}
                      </p>
                      <Link href={rec.actionUrl}>
                        <Button size="sm" variant="outline" className="w-full group">
                          {rec.actionLabel}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {isVietnamese ? 'Hoạt Động Gần Đây' : 'Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {streakStore.todayProgress && (
                  <>
                    {streakStore.todayProgress.questionsStudied > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {isVietnamese ? 'Học câu hỏi' : 'Studied Questions'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {streakStore.todayProgress.questionsStudied}{' '}
                            {isVietnamese ? 'câu hôm nay' : 'questions today'}
                          </p>
                        </div>
                      </div>
                    )}
                    {streakStore.todayProgress.testsCompleted > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {isVietnamese ? 'Làm bài thi' : 'Tests Completed'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {streakStore.todayProgress.testsCompleted}{' '}
                            {isVietnamese ? 'bài thi hôm nay' : 'tests today'}
                          </p>
                        </div>
                      </div>
                    )}
                    {streakStore.todayProgress.flashcardsReviewed > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                        <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {isVietnamese ? 'Ôn flashcards' : 'Flashcards Reviewed'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {streakStore.todayProgress.flashcardsReviewed}{' '}
                            {isVietnamese ? 'thẻ hôm nay' : 'cards today'}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {(!streakStore.todayProgress ||
                  (streakStore.todayProgress.questionsStudied === 0 &&
                    streakStore.todayProgress.testsCompleted === 0 &&
                    streakStore.todayProgress.flashcardsReviewed === 0)) && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {isVietnamese ? 'Chưa có hoạt động hôm nay' : 'No activity today yet'}
                    </p>
                    <Link href={`/${locale}/study`} className="mt-2 inline-block">
                      <Button size="sm" variant="outline">
                        {isVietnamese ? 'Bắt đầu học' : 'Start Learning'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                {isVietnamese ? 'Thống Kê' : 'Quick Stats'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isVietnamese ? 'Câu sai' : 'Wrong Answers'}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {wrongAnswerStore.wrongAnswers.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isVietnamese ? 'Flashcards đến hạn' : 'Due Flashcards'}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {spacedRepStore.getDueCards().length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isVietnamese ? 'Tổng flashcards' : 'Total Flashcards'}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {spacedRepStore.getTotalCardsReviewed()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {isVietnamese ? 'Độ khó TB' : 'Avg. Ease Factor'}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {spacedRepStore.getAverageEaseFactor().toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
