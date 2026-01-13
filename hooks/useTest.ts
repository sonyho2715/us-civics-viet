'use client';

import { useCallback } from 'react';
import { useTestStore } from '@/stores/testStore';
import { useProgressStore } from '@/stores/progressStore';
import { getAllQuestions } from '@/lib/questions';
import { generateTest } from '@/lib/test-logic';
import type { TestMode } from '@/types';

export function useTest() {
  const {
    session,
    result,
    startTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    submitTest,
    resetTest,
    getCurrentQuestion,
    getProgress,
    isQuestionAnswered,
  } = useTestStore();

  const { incrementTestsCompleted, incrementTestsPassed, markQuestionCorrect, markQuestionIncorrect } =
    useProgressStore();

  const initializeTest = useCallback(
    (mode: TestMode) => {
      const questions = getAllQuestions();
      const testQuestions = generateTest(questions, mode);
      startTest(testQuestions, mode);
    },
    [startTest]
  );

  const finishTest = useCallback(() => {
    const result = submitTest();

    // Update progress
    incrementTestsCompleted();
    if (result.passed) {
      incrementTestsPassed();
    }

    // Mark questions as correct/incorrect in progress
    result.correctQuestions.forEach((q) => markQuestionCorrect(q.id));
    result.incorrectQuestions.forEach((q) => markQuestionIncorrect(q.id));

    return result;
  }, [submitTest, incrementTestsCompleted, incrementTestsPassed, markQuestionCorrect, markQuestionIncorrect]);

  return {
    // State
    session,
    result,
    isActive: session !== null && !session.isComplete,
    isComplete: session?.isComplete ?? false,

    // Actions
    initializeTest,
    answerQuestion,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    finishTest,
    resetTest,

    // Getters
    currentQuestion: getCurrentQuestion(),
    progress: getProgress(),
    isQuestionAnswered,
  };
}
