'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  getAllQuestions,
  getQuestionsByCategory,
  getSeniorQuestions,
  searchQuestions,
  getCategoryStats,
} from '@/lib/questions';
import { useDynamicOfficials } from './useDynamicOfficials';
import type { Question, Category, Locale, StateCode } from '@/types';

export function useQuestions() {
  const questions = useMemo(() => getAllQuestions(), []);

  return {
    questions,
    total: questions.length,
  };
}

/**
 * Get questions with dynamic data enriched (current officials, state-specific data)
 */
export function useQuestionsWithDynamicData(locale: Locale, userState?: StateCode) {
  const { enrichQuestion } = useDynamicOfficials(userState);
  const baseQuestions = useMemo(() => getAllQuestions(), []);

  const questions = useMemo(() => {
    return baseQuestions.map((q) => enrichQuestion(q, locale));
  }, [baseQuestions, enrichQuestion, locale]);

  return {
    questions,
    total: questions.length,
  };
}

export function useQuestionsByCategory(category: Category | null) {
  const questions = useMemo(() => {
    if (!category) {
      return getAllQuestions();
    }
    return getQuestionsByCategory(category);
  }, [category]);

  return {
    questions,
    total: questions.length,
  };
}

export function useSeniorQuestions() {
  const questions = useMemo(() => getSeniorQuestions(), []);

  return {
    questions,
    total: questions.length,
  };
}

export function useSearchQuestions(locale: Locale = 'vi') {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Question[]>([]);

  const search = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
      if (searchQuery.trim() === '') {
        setResults([]);
      } else {
        setResults(searchQuestions(searchQuery, locale));
      }
    },
    [locale]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    results,
    search,
    clearSearch,
    hasResults: results.length > 0,
    isSearching: query.trim() !== '',
  };
}

export function useCategoryStats() {
  const stats = useMemo(() => getCategoryStats(), []);

  return stats;
}
