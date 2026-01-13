'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Spaced Repetition Store
 *
 * Implements a simplified SM-2 algorithm for scheduling flashcard reviews.
 * - Questions start with interval of 1 day
 * - Correct answers increase the interval (1 → 3 → 7 → 14 → 30 → 60 days)
 * - Wrong answers reset to 1 day interval
 * - Each question tracks its own ease factor
 */

interface ReviewCard {
  questionNumber: number;
  easeFactor: number; // 1.3 to 2.5, starts at 2.5
  interval: number; // Days until next review
  repetitions: number; // Number of consecutive correct answers
  nextReviewDate: string; // ISO date string
  lastReviewDate: string; // ISO date string
}

interface SpacedRepetitionStore {
  cards: ReviewCard[];

  // Core actions
  recordReview: (questionNumber: number, quality: 0 | 1 | 2 | 3 | 4 | 5) => void;
  getCardStatus: (questionNumber: number) => ReviewCard | undefined;

  // Query helpers
  getDueCards: () => number[];
  getCardsDueToday: () => number[];
  getCardsForReview: (count: number) => number[];
  getTotalCardsReviewed: () => number;
  getAverageEaseFactor: () => number;

  // Reset
  resetProgress: () => void;
}

// Interval progression (in days)
const INTERVALS = [1, 3, 7, 14, 30, 60, 120, 240];

function calculateNextInterval(repetitions: number, easeFactor: number): number {
  if (repetitions === 0) return 1;
  if (repetitions === 1) return 3;

  const baseInterval = INTERVALS[Math.min(repetitions, INTERVALS.length - 1)];
  return Math.round(baseInterval * easeFactor);
}

function calculateNextEaseFactor(currentEF: number, quality: number): number {
  // SM-2 formula for ease factor
  const newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  // Keep ease factor between 1.3 and 2.5
  return Math.max(1.3, Math.min(2.5, newEF));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isPastOrToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
}

export const useSpacedRepetitionStore = create<SpacedRepetitionStore>()(
  persist(
    (set, get) => ({
      cards: [],

      recordReview: (questionNumber: number, quality: 0 | 1 | 2 | 3 | 4 | 5) => {
        set((state) => {
          const existingCard = state.cards.find(
            (c) => c.questionNumber === questionNumber
          );

          const now = new Date();
          const isCorrect = quality >= 3; // 3, 4, 5 are passing grades

          if (existingCard) {
            // Update existing card
            let newRepetitions = isCorrect ? existingCard.repetitions + 1 : 0;
            let newEaseFactor = calculateNextEaseFactor(existingCard.easeFactor, quality);
            let newInterval = isCorrect
              ? calculateNextInterval(newRepetitions, newEaseFactor)
              : 1; // Reset to 1 day on wrong answer

            const nextReview = addDays(now, newInterval);

            return {
              cards: state.cards.map((c) =>
                c.questionNumber === questionNumber
                  ? {
                      ...c,
                      easeFactor: newEaseFactor,
                      interval: newInterval,
                      repetitions: newRepetitions,
                      nextReviewDate: nextReview.toISOString(),
                      lastReviewDate: now.toISOString(),
                    }
                  : c
              ),
            };
          } else {
            // Create new card
            const interval = isCorrect ? 1 : 1;
            const nextReview = addDays(now, interval);

            return {
              cards: [
                ...state.cards,
                {
                  questionNumber,
                  easeFactor: 2.5,
                  interval,
                  repetitions: isCorrect ? 1 : 0,
                  nextReviewDate: nextReview.toISOString(),
                  lastReviewDate: now.toISOString(),
                },
              ],
            };
          }
        });
      },

      getCardStatus: (questionNumber: number) => {
        return get().cards.find((c) => c.questionNumber === questionNumber);
      },

      getDueCards: () => {
        return get()
          .cards.filter((c) => isPastOrToday(c.nextReviewDate))
          .map((c) => c.questionNumber);
      },

      getCardsDueToday: () => {
        return get()
          .cards.filter((c) => isToday(c.nextReviewDate))
          .map((c) => c.questionNumber);
      },

      getCardsForReview: (count: number) => {
        const dueCards = get()
          .cards.filter((c) => isPastOrToday(c.nextReviewDate))
          .sort((a, b) => {
            // Prioritize cards with lower ease factor (harder cards)
            return a.easeFactor - b.easeFactor;
          })
          .slice(0, count)
          .map((c) => c.questionNumber);

        return dueCards;
      },

      getTotalCardsReviewed: () => {
        return get().cards.length;
      },

      getAverageEaseFactor: () => {
        const cards = get().cards;
        if (cards.length === 0) return 2.5;
        const sum = cards.reduce((acc, c) => acc + c.easeFactor, 0);
        return sum / cards.length;
      },

      resetProgress: () => {
        set({ cards: [] });
      },
    }),
    {
      name: 'civics-spaced-repetition',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
