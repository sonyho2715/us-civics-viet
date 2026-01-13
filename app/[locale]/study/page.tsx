'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Filter, X, Bookmark, BookmarkCheck, Printer } from 'lucide-react';
import { QuestionCard } from '@/components/study/QuestionCard';
import { CategoryNav } from '@/components/study/CategoryNav';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PrintStudySheet } from '@/components/ui/PrintStudySheet';
import { useQuestions, useQuestionsByCategory, useSearchQuestions } from '@/hooks/useQuestions';
import { useProgress } from '@/hooks/useProgress';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import type { Category, Locale } from '@/types';

export default function StudyPage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const t = useTranslations('study');
  const tCommon = useTranslations('common');

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const { questions: allQuestions } = useQuestions();
  const { questions: categoryQuestions } = useQuestionsByCategory(selectedCategory);
  const { results: searchResults, search, clearSearch, isSearching } = useSearchQuestions(locale);
  const { studiedCount, studyPercentage, questionsStudied } = useProgress();
  const { bookmarkedIds } = useBookmarkStore();

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    return {
      all: allQuestions.length,
      american_government: allQuestions.filter((q) => q.category === 'american_government').length,
      american_history: allQuestions.filter((q) => q.category === 'american_history').length,
      symbols_holidays: allQuestions.filter((q) => q.category === 'symbols_holidays').length,
    };
  }, [allQuestions]);

  // Determine which questions to display
  const displayQuestions = useMemo(() => {
    let questions = categoryQuestions;

    if (isSearching && searchQuery.trim()) {
      questions = searchResults;
    }

    // Filter by bookmarks if enabled
    if (showBookmarkedOnly) {
      questions = questions.filter((q) => bookmarkedIds.includes(q.question_number));
    }

    return questions;
  }, [isSearching, searchQuery, searchResults, categoryQuestions, showBookmarkedOnly, bookmarkedIds]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      search(query);
    } else {
      clearSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-slate-400">{t('subtitle')}</p>
      </div>

      {/* Progress Card */}
      <Card className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('progress')}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {t('studied')}: {studiedCount} / 128 {t('questions')}
            </p>
          </div>
          <div className="w-full sm:w-48">
            <ProgressBar
              progress={studyPercentage}
              color="blue"
              size="md"
              showLabel
              label={t('progress')}
            />
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={t('search')}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Category Navigation and Bookmark Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              counts={categoryCounts}
            />
          </div>

          {/* Bookmark Filter Toggle */}
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              showBookmarkedOnly
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 ring-2 ring-amber-300 dark:ring-amber-600'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400'
            }`}
          >
            {showBookmarkedOnly ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {showBookmarkedOnly ? tCommon('showAll') : tCommon('showBookmarked')}
            </span>
            {bookmarkedIds.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
                {bookmarkedIds.length}
              </span>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={() => setShowPrintDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">
              {locale === 'vi' ? 'In' : 'Print'}
            </span>
          </button>
        </div>
      </div>

      {/* Print Dialog */}
      {showPrintDialog && (
        <PrintStudySheet locale={locale} onClose={() => setShowPrintDialog(false)} />
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {displayQuestions.length === 0 ? (
          <Card className="text-center py-12">
            {showBookmarkedOnly && bookmarkedIds.length === 0 ? (
              <div className="flex flex-col items-center gap-2">
                <Bookmark className="w-12 h-12 text-gray-300 dark:text-slate-600" />
                <p className="text-gray-500 dark:text-slate-400">{tCommon('noBookmarks')}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-slate-400">{t('noResults')}</p>
            )}
          </Card>
        ) : (
          displayQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              locale={locale}
            />
          ))
        )}
      </div>

      {/* Results count */}
      {displayQuestions.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
          {displayQuestions.length} {t('questions')}
        </div>
      )}
    </div>
  );
}
