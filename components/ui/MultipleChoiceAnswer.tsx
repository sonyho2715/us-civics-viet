'use client';

import { useState, useMemo, useEffect } from 'react';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';
import type { Question, Locale } from '@/types';

interface MultipleChoiceAnswerProps {
  question: Question;
  allQuestions: Question[];
  locale: Locale;
  onAnswer: (answer: string) => void;
  showFeedback: boolean;
  disabled: boolean;
  existingAnswer?: string;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate stable choices for a question (using question ID as seed basis)
function generateChoices(
  question: Question,
  allQuestions: Question[],
  locale: Locale
): string[] {
  // Get the correct answer (first answer in the list)
  const answers = locale === 'vi' ? question.answers_vi : question.answers_en;
  const correctAnswer = answers[0];

  // Get distractor candidates from other questions in the same category
  const sameCategoryQuestions = allQuestions.filter(
    (q) => q.id !== question.id && q.category === question.category
  );

  // Collect all possible distractor answers
  const distractorPool: string[] = [];
  sameCategoryQuestions.forEach((q) => {
    const qAnswers = locale === 'vi' ? q.answers_vi : q.answers_en;
    qAnswers.forEach((a) => {
      // Only add if not a correct answer for the current question
      const isCorrectForCurrent = answers.some(
        (correct) => correct.toLowerCase() === a.toLowerCase()
      );
      if (!isCorrectForCurrent && !distractorPool.includes(a)) {
        distractorPool.push(a);
      }
    });
  });

  // Shuffle and pick 3 distractors
  const shuffledDistractors = shuffleArray(distractorPool);
  const selectedDistractors = shuffledDistractors.slice(0, 3);

  // If we don't have enough distractors, add from other categories
  if (selectedDistractors.length < 3) {
    const otherQuestions = allQuestions.filter(
      (q) => q.id !== question.id && q.category !== question.category
    );
    otherQuestions.forEach((q) => {
      if (selectedDistractors.length >= 3) return;
      const qAnswers = locale === 'vi' ? q.answers_vi : q.answers_en;
      qAnswers.forEach((a) => {
        if (selectedDistractors.length >= 3) return;
        const isCorrectForCurrent = answers.some(
          (correct) => correct.toLowerCase() === a.toLowerCase()
        );
        if (!isCorrectForCurrent && !selectedDistractors.includes(a)) {
          selectedDistractors.push(a);
        }
      });
    });
  }

  // Combine correct answer with distractors and shuffle
  const allChoices = [correctAnswer, ...selectedDistractors.slice(0, 3)];
  return shuffleArray(allChoices);
}

export function MultipleChoiceAnswer({
  question,
  allQuestions,
  locale,
  onAnswer,
  showFeedback,
  disabled,
  existingAnswer,
}: MultipleChoiceAnswerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    existingAnswer || null
  );

  // Generate choices - memoized to prevent regeneration on each render
  const choices = useMemo(
    () => generateChoices(question, allQuestions, locale),
    [question.id, allQuestions, locale]
  );

  // Get all correct answers for checking
  const correctAnswers = locale === 'vi' ? question.answers_vi : question.answers_en;

  // Check if an answer is correct
  const isAnswerCorrect = (answer: string): boolean => {
    return correctAnswers.some(
      (correct) => correct.toLowerCase().trim() === answer.toLowerCase().trim()
    );
  };

  // Update selection when existingAnswer changes
  useEffect(() => {
    if (existingAnswer) {
      setSelectedAnswer(existingAnswer);
    }
  }, [existingAnswer]);

  const handleSelect = (answer: string) => {
    if (disabled) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getChoiceStyle = (choice: string) => {
    const isSelected = selectedAnswer === choice;
    const isCorrect = isAnswerCorrect(choice);

    if (showFeedback && isSelected) {
      if (isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-900/30 ring-2 ring-green-500';
      } else {
        return 'border-red-500 bg-red-50 dark:bg-red-900/30 ring-2 ring-red-500';
      }
    }

    if (showFeedback && isCorrect && !isSelected) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/30';
    }

    if (isSelected) {
      return 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500';
    }

    return 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20';
  };

  const getIcon = (choice: string) => {
    const isSelected = selectedAnswer === choice;
    const isCorrect = isAnswerCorrect(choice);

    if (showFeedback) {
      if (isCorrect) {
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      }
      if (isSelected && !isCorrect) {
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      }
    }

    if (isSelected) {
      return (
        <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      );
    }

    return <Circle className="w-5 h-5 text-gray-400 dark:text-slate-500" />;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
        {locale === 'vi' ? 'Chọn câu trả lời:' : 'Select your answer:'}
      </label>

      {choices.map((choice, index) => (
        <button
          key={`${question.id}-${index}`}
          onClick={() => handleSelect(choice)}
          disabled={disabled}
          className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${getChoiceStyle(
            choice
          )} ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
        >
          <span className="flex-shrink-0">{getIcon(choice)}</span>
          <span className="flex-1 text-left text-gray-900 dark:text-white">
            <span className="font-medium text-gray-500 dark:text-gray-400 mr-2">
              {String.fromCharCode(65 + index)}.
            </span>
            {choice}
          </span>
        </button>
      ))}
    </div>
  );
}
