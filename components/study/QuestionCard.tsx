'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, AlertCircle, Star, RefreshCw, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, SeniorBadge, DynamicBadge } from '@/components/ui/Badge';
import { BilingualAudio } from '@/components/ui/AudioButton';
import { cn } from '@/lib/utils';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useStreakStore } from '@/stores/streakStore';
import type { Question, Locale } from '@/types';

interface QuestionCardProps {
  question: Question;
  locale: Locale;
  showAnswer?: boolean;
  onToggleAnswer?: () => void;
  compact?: boolean;
  showExplanation?: boolean;
}

export function QuestionCard({
  question,
  locale,
  showAnswer: controlledShowAnswer,
  onToggleAnswer,
  compact = false,
  showExplanation = true,
}: QuestionCardProps) {
  const t = useTranslations('study');
  const tCommon = useTranslations('common');
  const [internalShowAnswer, setInternalShowAnswer] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const { recordActivity } = useStreakStore();
  const hasRecordedActivityRef = useRef(false);

  const bookmarked = isBookmarked(question.question_number);

  // Use controlled state if provided, otherwise use internal state
  const showAnswer = controlledShowAnswer ?? internalShowAnswer;
  const toggleAnswer = onToggleAnswer ?? (() => {
    if (!internalShowAnswer && !hasRecordedActivityRef.current) {
      recordActivity('study'); // Track for daily streak when first viewing answer
      hasRecordedActivityRef.current = true;
    }
    setInternalShowAnswer(!internalShowAnswer);
  });

  const questionText = locale === 'vi' ? question.question_vi : question.question_en;
  const answers = locale === 'vi' ? question.answers_vi : question.answers_en;

  return (
    <Card
      variant="outlined"
      padding={compact ? 'sm' : 'md'}
      className={cn(
        'transition-all duration-200',
        showAnswer && 'ring-2 ring-blue-100 dark:ring-blue-800'
      )}
    >
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <span className="flex-shrink-0 w-8 h-8 bg-blue-800 dark:bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
            {question.question_number}
          </span>
          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-gray-900 dark:text-white font-medium',
              compact ? 'text-sm' : 'text-base md:text-lg'
            )}>
              {questionText}
            </p>

            {/* Badges and Audio */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {question.is_65_20 && <SeniorBadge />}
              {question.is_dynamic && <DynamicBadge />}
              <BilingualAudio
                textEn={question.question_en}
                textVi={question.question_vi}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleBookmark(question.question_number)}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg transition-all duration-200',
            bookmarked
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'
              : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-amber-500 dark:hover:text-amber-400'
          )}
          title={bookmarked ? (tCommon('removeBookmark') || 'Remove bookmark') : (tCommon('addBookmark') || 'Add bookmark')}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {bookmarked ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Dynamic Answer Warning */}
      {question.is_dynamic && (
        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-start gap-2">
          <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-purple-800 dark:text-purple-300">
            {tCommon('dynamicAnswer')}
            <br />
            <a
              href="https://www.uscis.gov/citizenship/testupdates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              {tCommon('verifyAnswer')}
            </a>
          </p>
        </div>
      )}

      {/* Toggle Answer Button */}
      <button
        onClick={toggleAnswer}
        className={cn(
          'w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors',
          showAnswer
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
        )}
      >
        {showAnswer ? (
          <>
            <ChevronUp className="w-4 h-4" />
            {t('hideAnswer')}
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            {t('showAnswer')}
          </>
        )}
      </button>

      {/* Answers Section */}
      {showAnswer && (
        <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('correctAnswers')}
            </h4>
            <ul className="space-y-1">
              {answers.map((answer, index) => (
                <li key={index} className="text-green-900 dark:text-green-200 flex items-start gap-2">
                  <span className="text-green-500 dark:text-green-400 mt-1">•</span>
                  <span>{answer}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Explanation */}
          {showExplanation && question.explanation_vi && (
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {t('explanation')}
              </h4>
              <p className="text-sm text-blue-900 dark:text-blue-200">{question.explanation_vi}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
