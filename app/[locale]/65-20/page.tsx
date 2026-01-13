'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Star,
  Info,
  BookOpen,
  FileQuestion,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/study/QuestionCard';
import { useQuestions } from '@/hooks/useQuestions';
import { useTest } from '@/hooks/useTest';
import { useProgress } from '@/hooks/useProgress';
import { SENIOR_65_20_QUESTIONS } from '@/types';
import type { Locale } from '@/types';

export default function Senior65_20Page() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as Locale;

  const { questions: allQuestions } = useQuestions();
  const { initializeTest } = useTest();
  const { questionsStudied, isQuestionStudied } = useProgress();

  const [showQuestions, setShowQuestions] = useState(false);

  // Get only the 20 designated 65/20 questions
  const seniorQuestions = useMemo(() => {
    return allQuestions.filter((q) => q.is_65_20);
  }, [allQuestions]);

  // Calculate progress for senior questions only
  const seniorStudiedCount = useMemo(() => {
    return seniorQuestions.filter((q) => isQuestionStudied(q.id)).length;
  }, [seniorQuestions, isQuestionStudied]);

  const progressPercentage = (seniorStudiedCount / 20) * 100;

  const handleStartTest = () => {
    initializeTest('65_20');
    router.push(`/${locale}/practice/test`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === 'vi' ? 'Chương Trình 65/20' : '65/20 Program'}
        </h1>
        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
          {locale === 'vi'
            ? 'Dành cho ứng viên từ 65 tuổi trở lên và đã là thường trú nhân ít nhất 20 năm'
            : 'For applicants 65 years or older who have been permanent residents for at least 20 years'}
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-700">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              {locale === 'vi' ? 'Ưu đãi 65/20' : '65/20 Exemption'}
            </h3>
            <ul className="space-y-2 text-amber-800 dark:text-amber-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {locale === 'vi'
                    ? 'Chỉ cần học 20 câu hỏi (thay vì 128 câu)'
                    : 'Only need to study 20 questions (instead of 128)'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {locale === 'vi'
                    ? 'Thi 10 câu, đúng 6 câu là đậu'
                    : 'Test on 10 questions, need 6 correct to pass'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {locale === 'vi'
                    ? 'Được thi bằng tiếng mẹ đẻ'
                    : 'Can take the test in your native language'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Progress and Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              {locale === 'vi' ? 'Tiến độ học' : 'Study Progress'}
            </CardTitle>
            <CardDescription>
              {locale === 'vi'
                ? 'Theo dõi tiến trình học 20 câu hỏi 65/20'
                : 'Track your progress on the 20 designated questions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ProgressBar
                progress={progressPercentage}
                color="amber"
                size="lg"
                showLabel
                label={`${seniorStudiedCount}/20 ${locale === 'vi' ? 'câu đã học' : 'studied'}`}
              />
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {progressPercentage === 100
                  ? locale === 'vi'
                    ? 'Tuyệt vời! Bạn đã học hết 20 câu hỏi. Hãy thi thử!'
                    : 'Great! You have studied all 20 questions. Try a practice test!'
                  : locale === 'vi'
                    ? `Còn ${20 - seniorStudiedCount} câu nữa cần học`
                    : `${20 - seniorStudiedCount} questions remaining to study`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Card */}
        <Card className="border-2 border-amber-200 dark:border-amber-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              {locale === 'vi' ? 'Thi Thử 65/20' : '65/20 Practice Test'}
            </CardTitle>
            <CardDescription>
              {locale === 'vi'
                ? '10 câu hỏi ngẫu nhiên từ 20 câu 65/20'
                : '10 random questions from the 20 designated questions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4" />
                  <span>10 {locale === 'vi' ? 'câu hỏi' : 'questions'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>
                    {locale === 'vi' ? 'Cần 6 đúng để đậu' : 'Need 6 correct to pass'}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleStartTest}
                variant="secondary"
                fullWidth
                className="group"
              >
                {locale === 'vi' ? 'Bắt đầu thi thử' : 'Start Practice Test'}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Questions Section */}
      <div className="mb-8">
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border-2 border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {locale === 'vi'
                ? '20 Câu Hỏi Được Chỉ Định'
                : '20 Designated Questions'}
            </span>
            <Badge variant="warning">65/20</Badge>
          </div>
          <span className="text-amber-600 dark:text-amber-400">
            {showQuestions
              ? locale === 'vi'
                ? 'Ẩn'
                : 'Hide'
              : locale === 'vi'
                ? 'Xem'
                : 'View'}
          </span>
        </button>

        {showQuestions && (
          <div className="mt-4 space-y-4">
            {seniorQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>

      {/* Official Questions List Reference */}
      <Card className="bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          {locale === 'vi'
            ? 'Danh sách câu hỏi 65/20 chính thức'
            : 'Official 65/20 Question Numbers'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
          {locale === 'vi'
            ? 'Các câu hỏi số:'
            : 'Questions numbered:'}{' '}
          <span className="font-mono text-amber-700 dark:text-amber-400">
            {SENIOR_65_20_QUESTIONS.join(', ')}
          </span>
        </p>
        <p className="text-xs text-gray-500 dark:text-slate-500">
          {locale === 'vi'
            ? 'Nguồn: USCIS - Những câu hỏi này được chọn từ danh sách 128 câu hỏi tiêu chuẩn.'
            : 'Source: USCIS - These questions are selected from the standard 128 question list.'}
        </p>
      </Card>
    </div>
  );
}
