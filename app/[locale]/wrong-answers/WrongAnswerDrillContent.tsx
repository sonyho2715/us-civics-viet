'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  BarChart3,
  Target,
  ChevronDown,
  Send,
  ListChecks,
  Type,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MultipleChoiceAnswer } from '@/components/ui/MultipleChoiceAnswer';
import { useQuestions } from '@/hooks/useQuestions';
import { useWrongAnswerStore } from '@/stores/wrongAnswerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { shuffleArray } from '@/lib/test-logic';
import type { Locale, Category, Question } from '@/types';
import { CATEGORIES } from '@/types';

type DrillMode = 'all' | 'top10' | 'category';
type DrillState = 'overview' | 'drilling' | 'complete';

export function WrongAnswerDrillContent() {
  const params = useParams();
  const locale = params.locale as Locale;
  const isVietnamese = locale === 'vi';

  const { questions } = useQuestions();
  const {
    wrongAnswers,
    getWrongAnswersByCategory,
    getWorstAnswers,
    markCorrect,
    getWrongCount,
  } = useWrongAnswerStore();
  const { answerMode, setAnswerMode } = useSettingsStore();

  const [drillState, setDrillState] = useState<DrillState>('overview');
  const [drillMode, setDrillMode] = useState<DrillMode>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category>('american_government');
  const [drillQuestions, setDrillQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [improvedCount, setImprovedCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const categoryBreakdown = useMemo(
    () => getWrongAnswersByCategory(questions),
    [wrongAnswers, questions, getWrongAnswersByCategory]
  );

  const worstAnswers = useMemo(
    () => getWorstAnswers(10),
    [wrongAnswers, getWorstAnswers]
  );

  // Build weighted question list (questions with higher wrongCount appear more)
  const buildWeightedQuestions = useCallback(
    (questionNumbers: number[]): Question[] => {
      const weighted: Question[] = [];

      questionNumbers.forEach((qn) => {
        const question = questions.find((q) => q.question_number === qn);
        if (!question) return;

        const count = getWrongCount(qn);
        // Add the question based on its wrong count (min 1, max 3 repeats)
        const repeats = Math.min(Math.max(count, 1), 3);
        for (let i = 0; i < repeats; i++) {
          weighted.push(question);
        }
      });

      // Deduplicate after shuffle so each question only appears once in the drill
      const shuffled = shuffleArray(weighted);
      const seen = new Set<number>();
      return shuffled.filter((q) => {
        if (seen.has(q.question_number)) return false;
        seen.add(q.question_number);
        return true;
      });
    },
    [questions, getWrongCount]
  );

  const startDrill = useCallback(
    (mode: DrillMode) => {
      let questionNumbers: number[] = [];

      switch (mode) {
        case 'all':
          questionNumbers = wrongAnswers.map((wa) => wa.questionNumber);
          break;
        case 'top10':
          questionNumbers = worstAnswers.map((wa) => wa.questionNumber);
          break;
        case 'category': {
          const categoryWrong = categoryBreakdown[selectedCategory];
          questionNumbers = categoryWrong.map((wa) => wa.questionNumber);
          break;
        }
      }

      const drillQs = buildWeightedQuestions(questionNumbers);
      if (drillQs.length === 0) return;

      setDrillQuestions(drillQs);
      setCurrentIndex(0);
      setDrillMode(mode);
      setDrillState('drilling');
      setImprovedCount(0);
      setAnsweredCount(0);
      setUserAnswer('');
      setShowFeedback(false);
    },
    [wrongAnswers, worstAnswers, categoryBreakdown, selectedCategory, buildWeightedQuestions]
  );

  const checkAnswer = useCallback(
    (answer: string): boolean => {
      const question = drillQuestions[currentIndex];
      if (!question) return false;
      const normalizedAnswer = answer.toLowerCase().trim();
      return (
        question.answers_en.some(
          (a) => a.toLowerCase().trim() === normalizedAnswer
        ) ||
        question.answers_vi.some(
          (a) => a.toLowerCase().trim() === normalizedAnswer
        )
      );
    },
    [drillQuestions, currentIndex]
  );

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    const correct = checkAnswer(userAnswer);
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnsweredCount((prev) => prev + 1);

    if (correct) {
      const question = drillQuestions[currentIndex];
      markCorrect(question.question_number);
      setImprovedCount((prev) => prev + 1);
    }
  };

  const handleMultipleChoiceAnswer = (answer: string) => {
    setUserAnswer(answer);
    const correct = checkAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    setAnsweredCount((prev) => prev + 1);

    if (correct) {
      const question = drillQuestions[currentIndex];
      markCorrect(question.question_number);
      setImprovedCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < drillQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      setDrillState('complete');
    }
  };

  const handleRestart = () => {
    setDrillState('overview');
    setDrillQuestions([]);
    setCurrentIndex(0);
    setImprovedCount(0);
    setAnsweredCount(0);
  };

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setShowCategoryDropdown(false);
    if (showCategoryDropdown) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [showCategoryDropdown]);

  // Empty state
  if (wrongAnswers.length === 0 && drillState === 'overview') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isVietnamese
              ? 'Tuyệt vời! Không có câu trả lời sai!'
              : 'Great job! No wrong answers!'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {isVietnamese
              ? 'Bạn chưa có câu nào sai. Hãy làm bài thi thử để bắt đầu theo dõi.'
              : 'You have no wrong answers yet. Take a practice test to start tracking.'}
          </p>
          <Link href={`/${locale}/practice`}>
            <Button>
              {isVietnamese ? 'Làm Bài Thi Thử' : 'Take Practice Test'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Completion state
  if (drillState === 'complete') {
    const percentage = answeredCount > 0
      ? Math.round((improvedCount / answeredCount) * 100)
      : 0;

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="text-center py-12">
          <div className="flex justify-center mb-4">
            {percentage >= 60 ? (
              <Trophy className="w-16 h-16 text-amber-500" />
            ) : (
              <Target className="w-16 h-16 text-blue-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isVietnamese ? 'Hoàn Thành Luyện Tập!' : 'Drill Complete!'}
          </h2>
          <p className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-2">
            {improvedCount}/{answeredCount}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {isVietnamese
              ? `Bạn đã cải thiện ${improvedCount} câu hỏi trong phiên này!`
              : `You improved on ${improvedCount} questions this session!`}
          </p>
          <ProgressBar
            progress={percentage}
            color={percentage >= 60 ? 'green' : 'amber'}
            size="lg"
            showLabel
            label={isVietnamese ? 'Tỉ lệ đúng' : 'Accuracy'}
            className="max-w-sm mx-auto mb-6"
          />
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              {isVietnamese ? 'Luyện Thêm' : 'Drill Again'}
            </Button>
            <Link href={`/${locale}/practice`}>
              <Button>
                {isVietnamese ? 'Thi Thử' : 'Practice Test'}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Drilling state
  if (drillState === 'drilling' && drillQuestions.length > 0) {
    const currentQuestion = drillQuestions[currentIndex];
    const progressPercentage = ((currentIndex + (showFeedback ? 1 : 0)) / drillQuestions.length) * 100;
    const wrongCount = getWrongCount(currentQuestion.question_number);

    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Drill header */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleRestart}>
                {isVietnamese ? 'Quay lại' : 'Back'}
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentIndex + 1}/{drillQuestions.length}
              </span>
            </div>
            {improvedCount > 0 && (
              <Badge variant="success">
                {isVietnamese
                  ? `${improvedCount} cải thiện`
                  : `${improvedCount} improved`}
              </Badge>
            )}
          </div>
          <ProgressBar
            progress={progressPercentage}
            color="purple"
            size="sm"
            showLabel
            label={isVietnamese ? 'Tiến độ' : 'Progress'}
          />
        </div>

        {/* Question card */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="info">#{currentQuestion.question_number}</Badge>
            <Badge variant="error">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {isVietnamese
                ? `Sai ${wrongCount} lần`
                : `Wrong ${wrongCount}x`}
            </Badge>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {isVietnamese
              ? currentQuestion.question_vi
              : currentQuestion.question_en}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {isVietnamese
              ? currentQuestion.question_en
              : currentQuestion.question_vi}
          </p>

          {/* Answer Mode Toggle */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isVietnamese ? 'Chế độ trả lời' : 'Answer mode'}
            </span>
            <button
              onClick={() => setAnswerMode(answerMode === 'text' ? 'multiple_choice' : 'text')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              {answerMode === 'text' ? (
                <>
                  <Type className="w-4 h-4" />
                  <span>{isVietnamese ? 'Nhập văn bản' : 'Text input'}</span>
                </>
              ) : (
                <>
                  <ListChecks className="w-4 h-4" />
                  <span>{isVietnamese ? 'Trắc nghiệm' : 'Multiple choice'}</span>
                </>
              )}
            </button>
          </div>

          {/* Answer input */}
          <div className="space-y-4">
            {answerMode === 'text' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {isVietnamese ? 'Câu trả lời của bạn:' : 'Your answer:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userAnswer.trim()) {
                        handleSubmitAnswer();
                      }
                    }}
                    placeholder={isVietnamese ? 'Nhập câu trả lời...' : 'Type your answer...'}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={showFeedback}
                  />
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!userAnswer.trim() || showFeedback}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <MultipleChoiceAnswer
                question={currentQuestion}
                allQuestions={questions}
                locale={locale}
                onAnswer={handleMultipleChoiceAnswer}
                showFeedback={showFeedback}
                disabled={showFeedback}
                existingAnswer={showFeedback ? userAnswer : undefined}
              />
            )}

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`p-4 rounded-lg ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="font-semibold text-green-800 dark:text-green-300">
                        {isVietnamese ? 'Chính xác! Đã xóa khỏi danh sách sai.' : 'Correct! Removed from wrong answers.'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="font-semibold text-red-800 dark:text-red-300">
                        {isVietnamese ? 'Chưa đúng. Hãy xem đáp án đúng bên dưới.' : 'Incorrect. See the correct answers below.'}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {isVietnamese ? 'Đáp án đúng:' : 'Correct answers:'}
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {(isVietnamese
                      ? currentQuestion.answers_vi
                      : currentQuestion.answers_en
                    ).map((answer, idx) => (
                      <li key={idx}>{answer}</li>
                    ))}
                  </ul>
                </div>
                {currentQuestion.explanation_vi && isVietnamese && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      <span className="font-medium">
                        {isVietnamese ? 'Giải thích: ' : 'Explanation: '}
                      </span>
                      {currentQuestion.explanation_vi}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Next button */}
        {showFeedback && (
          <div className="flex justify-end">
            <Button onClick={handleNext}>
              {currentIndex < drillQuestions.length - 1
                ? (isVietnamese ? 'Câu Tiếp' : 'Next')
                : (isVietnamese ? 'Xem Kết Quả' : 'View Results')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Overview state (default)
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {isVietnamese ? 'Luyện Câu Sai' : 'Wrong Answer Drills'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isVietnamese
            ? 'Tập trung ôn tập những câu bạn đã trả lời sai để cải thiện kết quả.'
            : 'Focus on questions you got wrong to improve your results.'}
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {wrongAnswers.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isVietnamese ? 'Tổng câu sai' : 'Total Wrong'}
          </p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {worstAnswers.length > 0 ? worstAnswers[0].wrongCount : 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isVietnamese ? 'Sai nhiều nhất' : 'Most Mistakes'}
          </p>
        </Card>
        <Card padding="sm" className="text-center col-span-2 md:col-span-1">
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {Object.values(categoryBreakdown).filter((arr) => arr.length > 0).length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isVietnamese ? 'Nhóm cần ôn' : 'Categories to Review'}
          </p>
        </Card>
      </div>

      {/* Category breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isVietnamese ? 'Phân Tích Theo Nhóm' : 'Category Breakdown'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {CATEGORIES.map((cat) => {
              const catWrong = categoryBreakdown[cat.id];
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                      {cat.icon} {isVietnamese ? cat.name_vi : cat.name_en}
                    </span>
                    <Badge variant={catWrong.length > 0 ? 'error' : 'success'} size="sm">
                      {catWrong.length} {isVietnamese ? 'câu sai' : 'wrong'}
                    </Badge>
                  </div>
                  <ProgressBar
                    progress={
                      catWrong.length > 0
                        ? (catWrong.length /
                            (cat.questionRange[1] - cat.questionRange[0] + 1)) *
                          100
                        : 0
                    }
                    color={catWrong.length > 3 ? 'red' : catWrong.length > 0 ? 'amber' : 'green'}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Worst performers */}
      {worstAnswers.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              {isVietnamese ? 'Câu Sai Nhiều Nhất' : 'Worst Performers'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {worstAnswers.slice(0, 5).map((wa) => {
                const question = questions.find(
                  (q) => q.question_number === wa.questionNumber
                );
                if (!question) return null;
                return (
                  <div
                    key={wa.questionNumber}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        #{question.question_number}.{' '}
                        {isVietnamese
                          ? question.question_vi
                          : question.question_en}
                      </p>
                    </div>
                    <Badge variant="error" size="sm" className="ml-2 flex-shrink-0">
                      {wa.wrongCount}x
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drill mode selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            {isVietnamese ? 'Chọn Chế Độ Luyện' : 'Choose Drill Mode'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* All Wrong */}
            <button
              onClick={() => startDrill('all')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {isVietnamese ? 'Tất Cả Câu Sai' : 'All Wrong Answers'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isVietnamese
                    ? `Ôn tập tất cả ${wrongAnswers.length} câu sai`
                    : `Review all ${wrongAnswers.length} wrong answers`}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* Focus Top 10 */}
            <button
              onClick={() => startDrill('top10')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {isVietnamese ? 'Top 10 Khó Nhất' : 'Focus Top 10'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isVietnamese
                    ? 'Tập trung vào 10 câu sai nhiều nhất'
                    : 'Focus on your 10 most-missed questions'}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* By Category */}
            <div className="p-4 rounded-lg border border-gray-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {isVietnamese ? 'Theo Nhóm' : 'By Category'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isVietnamese
                      ? 'Chọn nhóm câu hỏi để luyện tập'
                      : 'Select a category to drill'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCategoryDropdown(!showCategoryDropdown);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white"
                  >
                    <span>
                      {CATEGORIES.find((c) => c.id === selectedCategory)?.icon}{' '}
                      {isVietnamese
                        ? CATEGORIES.find((c) => c.id === selectedCategory)?.name_vi
                        : CATEGORIES.find((c) => c.id === selectedCategory)?.name_en}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(cat.id);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-900 dark:text-white first:rounded-t-lg last:rounded-b-lg"
                        >
                          {cat.icon} {isVietnamese ? cat.name_vi : cat.name_en}
                          {categoryBreakdown[cat.id].length > 0 && (
                            <span className="ml-2 text-red-500">
                              ({categoryBreakdown[cat.id].length})
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => startDrill('category')}
                  disabled={categoryBreakdown[selectedCategory].length === 0}
                  size="sm"
                >
                  {isVietnamese ? 'Bắt đầu' : 'Start'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              {categoryBreakdown[selectedCategory].length === 0 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  {isVietnamese
                    ? 'Không có câu sai trong nhóm này.'
                    : 'No wrong answers in this category.'}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
