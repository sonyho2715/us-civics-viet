'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Star,
  AlertCircle,
  BookOpen,
  Layers,
  Volume2,
  Bookmark,
  BookmarkCheck,
  XCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useQuestions, useQuestionsByCategory } from '@/hooks/useQuestions';
import { useProgress } from '@/hooks/useProgress';
import { shuffleArray } from '@/lib/test-logic';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useWrongAnswerStore } from '@/stores/wrongAnswerStore';
import { useSpacedRepetitionStore } from '@/stores/spacedRepetitionStore';
import { useStreakStore } from '@/stores/streakStore';
import type { Locale, Category, Question } from '@/types';

// Main wrapper component with Suspense boundary for useSearchParams
export function FlashcardsContent() {
  return (
    <Suspense fallback={<FlashcardsLoading />}>
      <FlashcardsMain />
    </Suspense>
  );
}

function FlashcardsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-64 mb-8"></div>
        <div className="h-80 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  );
}

function FlashcardsMain() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as Locale;
  const t = useTranslations('flashcards');

  const { questions: allQuestions } = useQuestions();
  const { markQuestionStudied, questionsStudied } = useProgress();

  // Check for URL mode parameter
  const urlMode = searchParams.get('mode');
  const initialMode = urlMode === 'wrong' ? 'wrong' : urlMode === 'due' ? 'due' : 'all';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState<Question[]>([]);
  const [studiedInSession, setStudiedInSession] = useState<Set<number>>(new Set());
  const [filterMode, setFilterMode] = useState<'all' | '65_20' | 'unstudied' | 'bookmarked' | 'wrong' | 'due'>(initialMode);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showRatingButtons, setShowRatingButtons] = useState(false);
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();
  const { bookmarkedIds, isBookmarked, toggleBookmark } = useBookmarkStore();
  const { wrongAnswers, markCorrect } = useWrongAnswerStore();
  const { getDueCards, recordReview, getCardStatus } = useSpacedRepetitionStore();
  const { recordActivity } = useStreakStore();

  // Track previous filter values to only reset index on filter change
  const prevFilterRef = useRef({ filterMode, selectedCategory });

  // Initialize deck - only reset index when filters actually change
  useEffect(() => {
    const filtersChanged =
      prevFilterRef.current.filterMode !== filterMode ||
      prevFilterRef.current.selectedCategory !== selectedCategory;

    prevFilterRef.current = { filterMode, selectedCategory };

    let filteredQuestions = allQuestions;

    // Apply category filter
    if (selectedCategory) {
      filteredQuestions = filteredQuestions.filter(
        (q) => q.category === selectedCategory
      );
    }

    // Apply mode filter
    if (filterMode === '65_20') {
      filteredQuestions = filteredQuestions.filter((q) => q.is_65_20);
    } else if (filterMode === 'unstudied') {
      filteredQuestions = filteredQuestions.filter((q) => !questionsStudied.includes(q.id));
    } else if (filterMode === 'bookmarked') {
      filteredQuestions = filteredQuestions.filter((q) => bookmarkedIds.includes(q.question_number));
    } else if (filterMode === 'wrong') {
      const wrongQuestionNumbers = wrongAnswers.map((w) => w.questionNumber);
      filteredQuestions = filteredQuestions.filter((q) => wrongQuestionNumbers.includes(q.question_number));
    } else if (filterMode === 'due') {
      const dueQuestionNumbers = getDueCards();
      filteredQuestions = filteredQuestions.filter((q) => dueQuestionNumbers.includes(q.question_number));
    }

    setDeck(filteredQuestions);

    // Only reset index and session when filters change, not when questions are studied
    if (filtersChanged) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setStudiedInSession(new Set());
      setShowRatingButtons(false);
    }
  }, [allQuestions, filterMode, selectedCategory, questionsStudied, bookmarkedIds, wrongAnswers, getDueCards]);

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);

    // Mark as studied when flipping to see answer
    if (!isFlipped && currentCard) {
      markQuestionStudied(currentCard.id);
      setStudiedInSession((prev) => new Set(prev).add(currentCard.id));
      setShowRatingButtons(true);
      recordActivity('flashcard'); // Track for daily streak
    }
  };

  // Spaced repetition rating handlers
  const handleRating = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (currentCard) {
      recordReview(currentCard.question_number, quality);
      setShowRatingButtons(false);

      // If wrong (quality < 3), also add to wrong answers for extra practice
      if (quality < 3) {
        // Wrong answer store already imported
      }

      // Auto-advance to next card after rating
      if (currentIndex < deck.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        }, 300);
      }
    }
  };

  const handleKnewIt = () => handleRating(5); // Easy - knew it well
  const handleDidntKnow = () => handleRating(1); // Hard - didn't know

  const handleSpeak = (e: React.MouseEvent, text: string, lang: 'en' | 'vi') => {
    e.stopPropagation(); // Prevent card flip
    if (isSpeaking) {
      stop();
    }
    setTimeout(() => speak(text, lang), 50);
  };

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowRatingButtons(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowRatingButtons(false);
    }
  };

  const handleShuffle = () => {
    setDeck(shuffleArray([...deck]));
    setShowRatingButtons(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedInSession(new Set());
    setShowRatingButtons(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          handleFlip();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
      }
    },
    [currentIndex, isFlipped, deck.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const categories = [
    { value: null, label: locale === 'vi' ? 'Tất cả' : 'All' },
    {
      value: 'american_government' as Category,
      label: locale === 'vi' ? 'Chính phủ Mỹ' : 'American Government',
    },
    {
      value: 'american_history' as Category,
      label: locale === 'vi' ? 'Lịch sử Mỹ' : 'American History',
    },
    {
      value: 'symbols_holidays' as Category,
      label: locale === 'vi' ? 'Biểu tượng & Ngày lễ' : 'Symbols & Holidays',
    },
  ];

  const filterModes = [
    { value: 'all' as const, label: locale === 'vi' ? 'Tất cả' : 'All', icon: null, count: null },
    { value: '65_20' as const, label: '65/20', icon: Star, count: null },
    {
      value: 'unstudied' as const,
      label: locale === 'vi' ? 'Chưa học' : 'Unstudied',
      icon: null,
      count: null,
    },
    {
      value: 'bookmarked' as const,
      label: locale === 'vi' ? 'Đã đánh dấu' : 'Bookmarked',
      icon: Bookmark,
      count: bookmarkedIds.length > 0 ? bookmarkedIds.length : null,
    },
    {
      value: 'wrong' as const,
      label: locale === 'vi' ? 'Câu sai' : 'Wrong',
      icon: XCircle,
      count: wrongAnswers.length > 0 ? wrongAnswers.length : null,
    },
    {
      value: 'due' as const,
      label: locale === 'vi' ? 'Cần ôn' : 'Due',
      icon: Clock,
      count: getDueCards().length > 0 ? getDueCards().length : null,
    },
  ];

  if (deck.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {locale === 'vi' ? 'Thẻ Ghi Nhớ' : 'Flashcards'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {locale === 'vi'
              ? 'Học bằng thẻ ghi nhớ'
              : 'Study with flashcards'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {filterModes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setFilterMode(mode.value)}
                aria-pressed={filterMode === mode.value}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterMode === mode.value
                    ? 'bg-blue-800 dark:bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <Card className="text-center py-12">
          <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-500 dark:text-gray-400">
            {locale === 'vi'
              ? 'Không có thẻ nào trong bộ lọc này'
              : 'No cards match this filter'}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setFilterMode('all');
              setSelectedCategory(null);
            }}
          >
            {locale === 'vi' ? 'Xem tất cả' : 'View All'}
          </Button>
        </Card>
      </div>
    );
  }

  const sessionProgress = (studiedInSession.size / deck.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === 'vi' ? 'Thẻ Ghi Nhớ' : 'Flashcards'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {locale === 'vi'
            ? 'Nhấn vào thẻ hoặc nhấn Space để lật'
            : 'Click the card or press Space to flip'}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Filter modes */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={locale === 'vi' ? 'Bộ lọc' : 'Filters'}>
          {filterModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setFilterMode(mode.value)}
              aria-pressed={filterMode === mode.value}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filterMode === mode.value
                  ? mode.value === 'bookmarked'
                    ? 'bg-amber-500 dark:bg-amber-600 text-white'
                    : mode.value === 'wrong'
                      ? 'bg-red-500 dark:bg-red-600 text-white'
                      : mode.value === 'due'
                        ? 'bg-purple-500 dark:bg-purple-600 text-white'
                        : 'bg-blue-800 dark:bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {mode.icon && <mode.icon className="w-4 h-4" aria-hidden="true" />}
              {mode.label}
              {mode.count && (
                <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                  mode.value === 'wrong'
                    ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                    : mode.value === 'due'
                      ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
                      : 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
                }`}>
                  {mode.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2" role="group" aria-label={locale === 'vi' ? 'Danh mục' : 'Categories'}>
          {categories.map((cat) => (
            <button
              key={cat.value || 'all'}
              onClick={() => setSelectedCategory(cat.value)}
              aria-pressed={selectedCategory === cat.value}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-amber-500 dark:bg-amber-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {locale === 'vi' ? 'Thẻ' : 'Card'} {currentIndex + 1}/{deck.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {studiedInSession.size}{' '}
            {locale === 'vi' ? 'đã xem trong phiên' : 'viewed this session'}
          </span>
        </div>
        <ProgressBar progress={sessionProgress} color="blue" size="sm" />
      </div>

      {/* Flashcard */}
      <div
        className="relative w-full h-80 md:h-96 cursor-pointer mb-6 perspective-1000"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label={locale === 'vi' ? 'Nhấn để lật thẻ' : 'Click to flip card'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front - Question */}
          <div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Card className="h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 border-2 border-blue-200 dark:border-blue-700">
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge variant="info">#{currentCard.question_number}</Badge>
                {currentCard.is_65_20 && (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <Star className="w-3 h-3" aria-hidden="true" />
                    65/20
                  </Badge>
                )}
                {currentCard.is_dynamic && (
                  <Badge variant="error" className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  </Badge>
                )}
              </div>

              {/* Bookmark button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(currentCard.question_number);
                }}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 ${
                  isBookmarked(currentCard.question_number)
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                    : 'bg-white/80 dark:bg-slate-700/80 text-gray-400 dark:text-gray-500 hover:text-amber-500 dark:hover:text-amber-400'
                }`}
                aria-label={isBookmarked(currentCard.question_number) ? (locale === 'vi' ? 'Bỏ đánh dấu' : 'Remove bookmark') : (locale === 'vi' ? 'Đánh dấu' : 'Bookmark')}
                aria-pressed={isBookmarked(currentCard.question_number)}
              >
                {isBookmarked(currentCard.question_number) ? (
                  <BookmarkCheck className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Bookmark className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              <div className="text-center">
                <BookOpen className="w-8 h-8 text-blue-400 dark:text-blue-300 mx-auto mb-4" aria-hidden="true" />
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {locale === 'vi'
                    ? currentCard.question_vi
                    : currentCard.question_en}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {locale === 'vi'
                    ? currentCard.question_en
                    : currentCard.question_vi}
                </p>

                {/* Audio button */}
                {ttsSupported && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={(e) => handleSpeak(e, currentCard.question_en, 'en')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-slate-700/80 text-blue-700 dark:text-blue-300 hover:bg-white dark:hover:bg-slate-600 transition-colors shadow-sm"
                      aria-label={locale === 'vi' ? 'Nghe tiếng Anh' : 'Listen in English'}
                    >
                      <Volume2 className="w-3 h-3" aria-hidden="true" />
                      EN
                    </button>
                  </div>
                )}
              </div>

              <p className="absolute bottom-4 text-sm text-blue-600 dark:text-blue-300">
                {locale === 'vi' ? 'Nhấn để xem đáp án' : 'Click to see answer'}
              </p>
            </Card>
          </div>

          {/* Back - Answer */}
          <div
            className="absolute w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Card className="h-full flex flex-col p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 border-2 border-green-200 dark:border-green-700 overflow-hidden">
              <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center min-h-0">
                <div className="text-center py-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">
                  {locale === 'vi' ? 'Đáp án' : 'Answer'}
                </h3>
                <ul className="space-y-2">
                  {(locale === 'vi'
                    ? currentCard.answers_vi
                    : currentCard.answers_en
                  ).map((answer, idx) => (
                    <li
                      key={idx}
                      className="text-lg text-gray-800 dark:text-white bg-white dark:bg-slate-700 px-4 py-2 rounded-lg shadow-sm"
                    >
                      {answer}
                    </li>
                  ))}
                </ul>

                {/* Audio for answers */}
                {ttsSupported && (
                  <div className="flex justify-center gap-2 mt-4">
                    <button
                      onClick={(e) => handleSpeak(e, currentCard.answers_en.join('. '), 'en')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 dark:bg-slate-700/80 text-green-700 dark:text-green-300 hover:bg-white dark:hover:bg-slate-600 transition-colors shadow-sm"
                      aria-label={locale === 'vi' ? 'Nghe đáp án tiếng Anh' : 'Listen to answer in English'}
                    >
                      <Volume2 className="w-3 h-3" aria-hidden="true" />
                      EN
                    </button>
                  </div>
                )}

                {currentCard.explanation_vi && locale === 'vi' && (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    <span className="font-medium">Giải thích: </span>
                    {currentCard.explanation_vi}
                  </p>
                )}

                {/* Spaced Repetition Rating Buttons */}
                {showRatingButtons && (
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDidntKnow();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors font-medium"
                      aria-label={locale === 'vi' ? 'Đánh dấu chưa thuộc' : "Mark as didn't know"}
                    >
                      <ThumbsDown className="w-4 h-4" aria-hidden="true" />
                      {locale === 'vi' ? 'Chưa thuộc' : "Didn't Know"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKnewIt();
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors font-medium"
                      aria-label={locale === 'vi' ? 'Đánh dấu đã thuộc' : 'Mark as knew it'}
                    >
                      <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                      {locale === 'vi' ? 'Đã thuộc' : 'Knew It'}
                    </button>
                  </div>
                )}
                </div>
              </div>

              <p className="text-sm text-green-600 dark:text-green-300 text-center pt-2 flex-shrink-0">
                {showRatingButtons
                  ? (locale === 'vi' ? 'Đánh giá để tiếp tục' : 'Rate to continue')
                  : (locale === 'vi' ? 'Nhấn để xem câu hỏi' : 'Click to see question')}
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label={locale === 'vi' ? 'Thẻ trước' : 'Previous card'}
        >
          <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          {locale === 'vi' ? 'Trước' : 'Previous'}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            aria-label={locale === 'vi' ? 'Đặt lại' : 'Reset'}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            onClick={handleShuffle}
            aria-label={locale === 'vi' ? 'Xáo trộn' : 'Shuffle'}
          >
            <Shuffle className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === deck.length - 1}
          aria-label={locale === 'vi' ? 'Thẻ sau' : 'Next card'}
        >
          {locale === 'vi' ? 'Sau' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
        </Button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
        <p>
          {locale === 'vi'
            ? 'Phím tắt: Space (lật), ← → (điều hướng)'
            : 'Shortcuts: Space (flip), ← → (navigate)'}
        </p>
      </div>
    </div>
  );
}
