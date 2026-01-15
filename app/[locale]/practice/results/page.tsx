'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Trophy,
  XCircle,
  Clock,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  Home,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ShareResults } from '@/components/ui/ShareResults';
import { useTest } from '@/hooks/useTest';
import { useWrongAnswerStore } from '@/stores/wrongAnswerStore';
import { useStreakStore } from '@/stores/streakStore';
import { useState, useRef } from 'react';
import type { Locale, Question } from '@/types';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as Locale;

  const { session, result, resetTest } = useTest();
  const { addWrongAnswer, wrongAnswers } = useWrongAnswerStore();
  const { recordActivity } = useStreakStore();
  const [showIncorrect, setShowIncorrect] = useState(true);
  const [showCorrect, setShowCorrect] = useState(false);
  const savedWrongAnswersRef = useRef(false);
  const recordedTestRef = useRef(false);

  // Save wrong answers and track test completion when results are available (only once)
  useEffect(() => {
    if (result && !savedWrongAnswersRef.current) {
      // Track test completion for daily streak
      if (!recordedTestRef.current) {
        recordActivity('test');
        recordedTestRef.current = true;
      }

      // Save wrong answers
      if (result.incorrectQuestions.length > 0) {
        result.incorrectQuestions.forEach((question) => {
          addWrongAnswer(question.question_number);
        });
      }
      savedWrongAnswersRef.current = true;
    }
  }, [result, addWrongAnswer, recordActivity]);

  // Redirect if no results
  useEffect(() => {
    if (!result) {
      router.push(`/${locale}/practice`);
    }
  }, [result, locale, router]);

  if (!result || !session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {locale === 'vi' ? 'Đang tải kết quả...' : 'Loading results...'}
          </p>
        </Card>
      </div>
    );
  }

  const scorePercentage = Math.round((result.correct / result.total) * 100);
  const passThreshold = session.mode === 'standard' ? 12 : 6;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) {
      return `${secs} ${locale === 'vi' ? 'giây' : 'seconds'}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetake = () => {
    resetTest();
    router.push(`/${locale}/practice`);
  };

  const handleStudy = () => {
    resetTest();
    router.push(`/${locale}/study`);
  };

  const handleHome = () => {
    resetTest();
    router.push(`/${locale}`);
  };

  const handleReviewWrongAnswers = () => {
    resetTest();
    router.push(`/${locale}/flashcards?mode=wrong`);
  };

  const QuestionReview = ({ question, isCorrect }: { question: Question; isCorrect: boolean }) => (
    <div
      className={`p-4 rounded-lg border ${
        isCorrect
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="info">#{question.question_number}</Badge>
          {question.is_65_20 && (
            <Badge variant="warning" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              65/20
            </Badge>
          )}
          {question.is_dynamic && (
            <Badge variant="error" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {locale === 'vi' ? 'Có thể thay đổi' : 'May change'}
            </Badge>
          )}
        </div>
        {isCorrect ? (
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
        )}
      </div>

      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
        {locale === 'vi' ? question.question_vi : question.question_en}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {locale === 'vi' ? question.question_en : question.question_vi}
      </p>

      {!isCorrect && (
        <>
          <div className="mb-2">
            <span className="text-sm font-medium text-red-700 dark:text-red-400">
              {locale === 'vi' ? 'Câu trả lời của bạn: ' : 'Your answer: '}
            </span>
            <span className="text-sm text-red-600 dark:text-red-300">
              {session.answers[question.id] || (locale === 'vi' ? '(Không trả lời)' : '(No answer)')}
            </span>
          </div>
        </>
      )}

      <div>
        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
          {locale === 'vi' ? 'Đáp án đúng: ' : 'Correct answers: '}
        </span>
        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1">
          {(locale === 'vi' ? question.answers_vi : question.answers_en).map(
            (answer, idx) => (
              <li key={idx}>{answer}</li>
            )
          )}
        </ul>
      </div>

      {question.explanation_vi && locale === 'vi' && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-slate-700">
          <span className="font-medium">Giải thích: </span>
          {question.explanation_vi}
        </p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Result Header */}
      <Card
        className={`mb-8 text-center ${
          result.passed
            ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
            : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
        }`}
      >
        <div className="flex justify-center mb-4">
          {result.passed ? (
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        <h1
          className={`text-3xl font-bold mb-2 ${
            result.passed ? 'text-green-800' : 'text-red-800'
          }`}
        >
          {result.passed
            ? locale === 'vi'
              ? 'Chúc mừng! Bạn đã đậu!'
              : 'Congratulations! You Passed!'
            : locale === 'vi'
              ? 'Chưa đậu'
              : 'Not Passed'}
        </h1>

        <p className={`${result.passed ? 'text-green-600' : 'text-red-600'}`}>
          {result.passed
            ? locale === 'vi'
              ? 'Bạn đã sẵn sàng cho bài thi thật!'
              : 'You are ready for the actual test!'
            : locale === 'vi'
              ? 'Hãy ôn lại các câu sai và thử lại nhé!'
              : 'Review the incorrect questions and try again!'}
        </p>
      </Card>

      {/* Score Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <ProgressRing
            progress={scorePercentage}
            color={result.passed ? 'green' : 'red'}
            size="lg"
            showPercentage
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {locale === 'vi' ? 'Điểm số' : 'Score'}
          </p>
        </Card>

        <Card className="text-center flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white">
            {result.correct}/{result.total}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {locale === 'vi' ? 'Câu đúng' : 'Correct'}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            {locale === 'vi'
              ? `Cần ${passThreshold} để đậu`
              : `Need ${passThreshold} to pass`}
          </p>
        </Card>

        <Card className="text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-4xl font-bold text-gray-900 dark:text-white">
            <Clock className="w-8 h-8 text-gray-400 dark:text-slate-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatTime(result.timeSpent)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {locale === 'vi' ? 'Thời gian' : 'Time'}
          </p>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button variant="primary" onClick={handleRetake}>
          <RefreshCw className="w-4 h-4 mr-2" />
          {locale === 'vi' ? 'Thi lại' : 'Retake Test'}
        </Button>
        {wrongAnswers.length > 0 && (
          <Button variant="secondary" onClick={handleReviewWrongAnswers} className="bg-amber-500 hover:bg-amber-600 text-white border-amber-500">
            <XCircle className="w-4 h-4 mr-2" />
            {locale === 'vi' ? `Ôn ${wrongAnswers.length} câu sai` : `Review ${wrongAnswers.length} Wrong`}
          </Button>
        )}
        <Button variant="secondary" onClick={handleStudy}>
          <BookOpen className="w-4 h-4 mr-2" />
          {locale === 'vi' ? 'Học tiếp' : 'Study More'}
        </Button>
        <ShareResults
          locale={locale}
          score={result.correct}
          total={result.total}
          passed={result.passed}
        />
        <Button variant="outline" onClick={handleHome}>
          <Home className="w-4 h-4 mr-2" />
          {locale === 'vi' ? 'Trang chủ' : 'Home'}
        </Button>
      </div>

      {/* Incorrect Questions Review */}
      {result.incorrectQuestions.length > 0 && (
        <div className="mb-8">
          <button
            onClick={() => setShowIncorrect(!showIncorrect)}
            className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-800 dark:text-red-300">
                {locale === 'vi' ? 'Câu trả lời sai' : 'Incorrect Answers'} (
                {result.incorrectQuestions.length})
              </span>
            </div>
            {showIncorrect ? (
              <ChevronUp className="w-5 h-5 text-red-600 dark:text-red-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
          </button>

          {showIncorrect && (
            <div className="mt-4 space-y-4">
              {result.incorrectQuestions.map((question) => (
                <QuestionReview
                  key={question.id}
                  question={question}
                  isCorrect={false}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Correct Questions Review */}
      {result.correctQuestions.length > 0 && (
        <div>
          <button
            onClick={() => setShowCorrect(!showCorrect)}
            className="w-full flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-800 dark:text-green-300">
                {locale === 'vi' ? 'Câu trả lời đúng' : 'Correct Answers'} (
                {result.correctQuestions.length})
              </span>
            </div>
            {showCorrect ? (
              <ChevronUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-green-600 dark:text-green-400" />
            )}
          </button>

          {showCorrect && (
            <div className="mt-4 space-y-4">
              {result.correctQuestions.map((question) => (
                <QuestionReview
                  key={question.id}
                  question={question}
                  isCorrect={true}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
