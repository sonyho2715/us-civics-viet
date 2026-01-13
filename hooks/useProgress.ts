'use client';

import { useCallback } from 'react';
import { useProgressStore } from '@/stores/progressStore';

export function useProgress() {
  const {
    questionsStudied,
    questionsCorrect,
    questionsIncorrect,
    testsCompleted,
    testsPassed,
    streak,
    lastStudyDate,
    markQuestionStudied,
    markQuestionCorrect,
    markQuestionIncorrect,
    updateStreak,
    resetProgress,
    getStudyPercentage,
  } = useProgressStore();

  const isQuestionStudied = useCallback(
    (questionId: number) => questionsStudied.includes(questionId),
    [questionsStudied]
  );

  const isQuestionCorrect = useCallback(
    (questionId: number) => questionsCorrect.includes(questionId),
    [questionsCorrect]
  );

  const isQuestionIncorrect = useCallback(
    (questionId: number) => questionsIncorrect.includes(questionId),
    [questionsIncorrect]
  );

  return {
    // Stats
    questionsStudied,
    questionsCorrect,
    questionsIncorrect,
    testsCompleted,
    testsPassed,
    streak,
    lastStudyDate,

    // Computed
    studiedCount: questionsStudied.length,
    correctCount: questionsCorrect.length,
    incorrectCount: questionsIncorrect.length,
    passRate: testsCompleted > 0 ? Math.round((testsPassed / testsCompleted) * 100) : 0,
    studyPercentage: getStudyPercentage(),

    // Checkers
    isQuestionStudied,
    isQuestionCorrect,
    isQuestionIncorrect,

    // Actions
    markQuestionStudied,
    markQuestionCorrect,
    markQuestionIncorrect,
    updateStreak,
    resetProgress,
  };
}
