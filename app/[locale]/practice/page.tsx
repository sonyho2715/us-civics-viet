'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FileQuestion, Star, Clock, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
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

  const handleStartTest = (mode: TestMode, questionSet: '128' | '100' = '128') => {
    initializeTest(mode, questionSet);
    router.push(`/${locale}/practice/test`);
  };

  const isVi = locale === 'vi';

  const testOptions = [
    {
      mode: 'standard' as TestMode,
      questionSet: '128' as const,
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
      questionSet: '128' as const,
      icon: Star,
      title: t('seniorTest.title'),
      description: t('seniorTest.description'),
      requirement: t('seniorTest.passRequirement'),
      questions: 10,
      pass: 6,
      color: 'amber',
    },
    {
      mode: 'standard' as TestMode,
      questionSet: '100' as const,
      icon: BookOpen,
      title: isVi ? '100 Câu Hỏi Cổ Điển' : 'Classic 100 Questions',
      description: isVi
        ? 'Bộ 100 câu hỏi công dân USCIS phiên bản gốc (2019). Phù hợp luyện tập toàn diện.'
        : 'The original USCIS 100 civics questions (rev. 01/19). Great for comprehensive practice.',
      requirement: isVi ? 'Đúng 12/20 để đậu' : '12 of 20 correct to pass',
      questions: 20,
      pass: 12,
      color: 'green',
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
                {t('testsTaken')}
              </div>
            </div>
            <div className="w-px h-12 bg-blue-200 dark:bg-blue-700" />
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{testsPassed}</div>
              <div className="text-sm text-green-600 dark:text-green-400">
                {t('passed')}
              </div>
            </div>
            <div className="w-px h-12 bg-blue-200 dark:bg-blue-700" />
            <div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{passRate}%</div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                {t('passRate')}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {testOptions.map((option) => (
          <Card
            key={`${option.mode}-${option.questionSet}`}
            className={`relative overflow-hidden border-2 ${
              option.color === 'blue'
                ? 'border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500'
                : option.color === 'amber'
                ? 'border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500'
                : 'border-green-200 dark:border-green-700 hover:border-green-400 dark:hover:border-green-500'
            } transition-colors`}
          >
            <div className="flex flex-col h-full">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl ${
                    option.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300'
                      : option.color === 'amber'
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                      : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
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
                    <span>{option.questions} {t('questions')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>{option.requirement}</span>
                  </div>
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Button
                  onClick={() => handleStartTest(option.mode, option.questionSet)}
                  variant={option.color === 'blue' ? 'primary' : option.color === 'green' ? 'primary' : 'secondary'}
                  className={option.color === 'green' ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600' : ''}
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
          {t('testSettings')}
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-700 dark:text-slate-300">
              {t('showAnswerAfterEach')}
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
              {t('enableTimer')}
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
