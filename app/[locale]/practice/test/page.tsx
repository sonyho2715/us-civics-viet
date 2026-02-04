'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Send,
  Volume2,
  ToggleLeft,
  ToggleRight,
  Type,
  ListChecks,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { MultipleChoiceAnswer } from '@/components/ui/MultipleChoiceAnswer';
import { useTest } from '@/hooks/useTest';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import type { Locale } from '@/types';

export default function TestSessionPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as Locale;
  const t = useTranslations('test');

  const {
    session,
    isActive,
    currentQuestion,
    progress,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    finishTest,
    isQuestionAnswered,
  } = useTest();

  const { showImmediateFeedback, timerEnabled, answerMode, setAnswerMode } = useSettingsStore();
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!timerEnabled || !session || session.isComplete) return;

    const timer = setInterval(() => {
      setElapsedTime(
        Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEnabled, session]);

  // Reset state when question changes
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = session?.answers[currentQuestion.id];
      setUserAnswer(existingAnswer || '');
      setShowFeedback(existingAnswer ? showImmediateFeedback : false);

      // Check if existing answer is correct
      if (existingAnswer && showImmediateFeedback) {
        const correct = checkAnswer(existingAnswer);
        setIsCorrect(correct);
      }
    }
  }, [currentQuestion?.id, session?.answers, showImmediateFeedback]);

  // Redirect if no active session
  useEffect(() => {
    if (!isActive && !session?.isComplete) {
      router.push(`/${locale}/practice`);
    }
  }, [isActive, session, locale, router]);

  const checkAnswer = useCallback(
    (answer: string): boolean => {
      if (!currentQuestion) return false;
      const normalizedAnswer = answer.toLowerCase().trim();
      return (
        currentQuestion.answers_en.some(
          (a) => a.toLowerCase().trim() === normalizedAnswer
        ) ||
        currentQuestion.answers_vi.some(
          (a) => a.toLowerCase().trim() === normalizedAnswer
        )
      );
    },
    [currentQuestion]
  );

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    answerQuestion(currentQuestion.id, userAnswer.trim());

    if (showImmediateFeedback) {
      const correct = checkAnswer(userAnswer);
      setIsCorrect(correct);
      setShowFeedback(true);
    } else {
      // Auto-advance to next question if no feedback
      if (session && session.currentIndex < session.questions.length - 1) {
        nextQuestion();
      }
    }
  };

  const handleMultipleChoiceAnswer = (answer: string) => {
    if (!currentQuestion) return;

    setUserAnswer(answer);
    answerQuestion(currentQuestion.id, answer);

    if (showImmediateFeedback) {
      const correct = checkAnswer(answer);
      setIsCorrect(correct);
      setShowFeedback(true);
    }
  };

  const toggleAnswerMode = () => {
    setAnswerMode(answerMode === 'text' ? 'multiple_choice' : 'text');
  };

  const handleNext = () => {
    setShowFeedback(false);
    nextQuestion();
  };

  const handlePrevious = () => {
    setShowFeedback(false);
    previousQuestion();
  };

  const handleFinishTest = () => {
    finishTest();
    router.push(`/${locale}/practice/results`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSpeak = (text: string, lang: 'en' | 'vi') => {
    if (isSpeaking) stop();
    setTimeout(() => speak(text, lang), 50);
  };

  if (!session || !currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('loading')}
          </p>
        </Card>
      </div>
    );
  }

  const questionIndex = session.currentIndex;
  const totalQuestions = session.questions.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const isFirstQuestion = questionIndex === 0;
  const answeredCount = Object.keys(session.answers).length;
  const progressPercentage = (answeredCount / totalQuestions) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header with progress and timer */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('question')} {questionIndex + 1}/
              {totalQuestions}
            </span>
            {session.mode === '65_20' && (
              <Badge variant="warning" className="ml-2">
                65/20
              </Badge>
            )}
          </div>
          {timerEnabled && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
          )}
        </div>

        <ProgressBar
          progress={progressPercentage}
          color="blue"
          size="sm"
          showLabel
          label={`${answeredCount}/${totalQuestions} ${t('answered')}`}
        />
      </div>

      {/* Question Navigation Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {session.questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => {
              setShowFeedback(false);
              goToQuestion(idx);
            }}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              idx === questionIndex
                ? 'bg-blue-800 dark:bg-blue-600 text-white'
                : isQuestionAnswered(q.id)
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        {/* Question badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="info">#{currentQuestion.question_number}</Badge>
          {currentQuestion.is_65_20 && (
            <Badge variant="warning" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              65/20
            </Badge>
          )}
          {currentQuestion.is_dynamic && (
            <Badge variant="error" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {t('mayChange')}
            </Badge>
          )}
        </div>

        {/* Question text */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {locale === 'vi'
            ? currentQuestion.question_vi
            : currentQuestion.question_en}
        </h2>

        {/* Secondary language */}
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
          {locale === 'vi'
            ? currentQuestion.question_en
            : currentQuestion.question_vi}
        </p>

        {/* Audio buttons */}
        {ttsSupported && (
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => handleSpeak(currentQuestion.question_en, 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              title="Play in English"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>EN</span>
            </button>
          </div>
        )}

        {/* Answer Mode Toggle */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('answerMode')}
          </span>
          <button
            onClick={toggleAnswerMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            {answerMode === 'text' ? (
              <>
                <Type className="w-4 h-4" />
                <span>{t('textInput')}</span>
              </>
            ) : (
              <>
                <ListChecks className="w-4 h-4" />
                <span>{t('multipleChoice')}</span>
              </>
            )}
          </button>
        </div>

        {/* Answer input */}
        <div className="space-y-4">
          {answerMode === 'text' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                {t('yourAnswer')}
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
                  placeholder={t('typeAnswer')}
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
              allQuestions={session.questions}
              locale={locale}
              onAnswer={handleMultipleChoiceAnswer}
              showFeedback={showFeedback}
              disabled={showFeedback}
              existingAnswer={session.answers[currentQuestion.id]}
            />
          )}

          {/* Feedback section */}
          {showFeedback && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-800 dark:text-green-300">
                      {t('correct')}
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-semibold text-red-800 dark:text-red-300">
                      {t('incorrect')}
                    </span>
                  </>
                )}
              </div>

              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  {t('correctAnswers')}
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {(locale === 'vi'
                    ? currentQuestion.answers_vi
                    : currentQuestion.answers_en
                  ).map((answer, idx) => (
                    <li key={idx}>{answer}</li>
                  ))}
                </ul>
              </div>

              {currentQuestion.explanation_vi && locale === 'vi' && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                  <p className="text-sm text-gray-700 dark:text-slate-300">
                    <span className="font-medium">{t('explanation')} </span>
                    {currentQuestion.explanation_vi}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('previous')}
        </Button>

        <div className="flex gap-2">
          {answeredCount === totalQuestions && (
            <Button variant="primary" onClick={handleFinishTest}>
              {t('submitTest')}
            </Button>
          )}

          {!isLastQuestion && (
            <Button onClick={handleNext}>
              {t('next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {isLastQuestion && answeredCount < totalQuestions && (
            <Button variant="secondary" onClick={handleFinishTest}>
              {t('submitTest')}
            </Button>
          )}
        </div>
      </div>

      {/* Unanswered warning */}
      {answeredCount < totalQuestions && (
        <p className="text-center text-sm text-amber-600 dark:text-amber-400 mt-4">
          {t('questionsUnanswered', { count: totalQuestions - answeredCount })}
        </p>
      )}
    </div>
  );
}
