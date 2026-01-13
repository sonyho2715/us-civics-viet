'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FileQuestion, Star, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTest } from '@/hooks/useTest';
import { useProgress } from '@/hooks/useProgress';
import { useSettingsStore } from '@/stores/settingsStore';
import type { TestMode } from '@/types';

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const t = useTranslations('practice');
  const { initializeTest } = useTest();
  const { testsCompleted, testsPassed, passRate } = useProgress();
  const { showImmediateFeedback, setShowImmediateFeedback, timerEnabled, setTimerEnabled } =
    useSettingsStore();

  const handleStartTest = (mode: TestMode) => {
    initializeTest(mode);
    router.push(`/${locale}/practice/test`);
  };

  const testOptions = [
    {
      mode: 'standard' as TestMode,
      icon: FileQuestion,
      title: t('standardTest.title'),
      description: t('standardTest.description'),
      requirement: t('standardTest.passRequirement'),
      questions: 20,
      pass: 12,
      color: 'blue',
    },
    {
      mode: '65_20' as TestMode,
      icon: Star,
      title: t('seniorTest.title'),
      description: t('seniorTest.description'),
      requirement: t('seniorTest.passRequirement'),
      questions: 10,
      pass: 6,
      color: 'amber',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-slate-400">{t('subtitle')}</p>
      </div>

      {/* Stats */}
      {testsCompleted > 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">{testsCompleted}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                {locale === 'vi' ? 'Bài đã thi' : 'Tests taken'}
              </div>
            </div>
            <div className="w-px h-12 bg-blue-200 dark:bg-blue-700" />
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{testsPassed}</div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {locale === 'vi' ? 'Đã đậu' : 'Passed'}
              </div>
            </div>
            <div className="w-px h-12 bg-blue-200 dark:bg-blue-700" />
            <div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{passRate}%</div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                {locale === 'vi' ? 'Tỷ lệ đậu' : 'Pass rate'}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {testOptions.map((option) => (
          <Card
            key={option.mode}
            className={`relative overflow-hidden border-2 ${
              option.color === 'blue'
                ? 'border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500'
                : 'border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500'
            } transition-colors`}
          >
            <div className="flex flex-col h-full">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl ${
                    option.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                      : 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                  } flex items-center justify-center mb-3`}
                >
                  <option.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <FileQuestion className="w-4 h-4" />
                    <span>{option.questions} {locale === 'vi' ? 'câu hỏi' : 'questions'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{option.requirement}</span>
                  </div>
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Button
                  onClick={() => handleStartTest(option.mode)}
                  variant={option.color === 'blue' ? 'primary' : 'secondary'}
                  fullWidth
                  className="group"
                >
                  {t('startTest')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          {locale === 'vi' ? 'Cài đặt bài thi' : 'Test Settings'}
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700 dark:text-slate-300">
              {locale === 'vi' ? 'Hiện đáp án ngay sau mỗi câu' : 'Show answer after each question'}
            </span>
            <input
              type="checkbox"
              checked={showImmediateFeedback}
              onChange={(e) => setShowImmediateFeedback(e.target.checked)}
              className="w-5 h-5 rounded text-blue-800 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700 dark:text-slate-300">
              {locale === 'vi' ? 'Bật đồng hồ đếm thời gian' : 'Enable timer'}
            </span>
            <input
              type="checkbox"
              checked={timerEnabled}
              onChange={(e) => setTimerEnabled(e.target.checked)}
              className="w-5 h-5 rounded text-blue-800 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600"
            />
          </label>
        </div>
      </Card>
    </div>
  );
}
