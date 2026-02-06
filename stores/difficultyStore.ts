'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface QuestionDifficulty {
  questionNumber: number;
  timesCorrect: number;
  timesIncorrect: number;
  totalResponseTime: number; // cumulative milliseconds
  attempts: number;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'unrated';

interface DifficultyStore {
  difficulties: QuestionDifficulty[];
  recordAttempt: (questionNumber: number, correct: boolean, responseTimeMs: number) => void;
  getDifficulty: (questionNumber: number) => DifficultyLevel;
  getDifficultyScore: (questionNumber: number) => number;
  getAverageResponseTime: (questionNumber: number) => number;
  getAllByDifficulty: (level: DifficultyLevel, allQuestionNumbers: number[]) => number[];
  resetDifficulties: () => void;
}

function calculateLevel(timesCorrect: number, timesIncorrect: number): DifficultyLevel {
  const total = timesCorrect + timesIncorrect;
  if (total === 0) return 'unrated';
  const score = timesIncorrect / total;
  if (score < 0.25) return 'easy';
  if (score <= 0.6) return 'medium';
  return 'hard';
}

export const useDifficultyStore = create<DifficultyStore>()(
  persist(
    (set, get) => ({
      difficulties: [],

      recordAttempt: (questionNumber: number, correct: boolean, responseTimeMs: number) => {
        set((state) => {
          const existing = state.difficulties.find(
            (d) => d.questionNumber === questionNumber
          );

          if (existing) {
            return {
              difficulties: state.difficulties.map((d) =>
                d.questionNumber === questionNumber
                  ? {
                      ...d,
                      timesCorrect: d.timesCorrect + (correct ? 1 : 0),
                      timesIncorrect: d.timesIncorrect + (correct ? 0 : 1),
                      totalResponseTime: d.totalResponseTime + responseTimeMs,
                      attempts: d.attempts + 1,
                    }
                  : d
              ),
            };
          }

          return {
            difficulties: [
              ...state.difficulties,
              {
                questionNumber,
                timesCorrect: correct ? 1 : 0,
                timesIncorrect: correct ? 0 : 1,
                totalResponseTime: responseTimeMs,
                attempts: 1,
              },
            ],
          };
        });
      },

      getDifficulty: (questionNumber: number) => {
        const entry = get().difficulties.find(
          (d) => d.questionNumber === questionNumber
        );
        if (!entry || entry.attempts === 0) return 'unrated';
        return calculateLevel(entry.timesCorrect, entry.timesIncorrect);
      },

      getDifficultyScore: (questionNumber: number) => {
        const entry = get().difficulties.find(
          (d) => d.questionNumber === questionNumber
        );
        if (!entry || entry.attempts === 0) return 0;
        const total = entry.timesCorrect + entry.timesIncorrect;
        if (total === 0) return 0;
        return entry.timesIncorrect / total;
      },

      getAverageResponseTime: (questionNumber: number) => {
        const entry = get().difficulties.find(
          (d) => d.questionNumber === questionNumber
        );
        if (!entry || entry.attempts === 0) return 0;
        return entry.totalResponseTime / entry.attempts;
      },

      getAllByDifficulty: (level: DifficultyLevel, allQuestionNumbers: number[]) => {
        const store = get();

        return allQuestionNumbers.filter((qn) => {
          const entry = store.difficulties.find(
            (d) => d.questionNumber === qn
          );

          if (level === 'unrated') {
            return !entry || entry.attempts === 0;
          }

          if (!entry || entry.attempts === 0) return false;
          return calculateLevel(entry.timesCorrect, entry.timesIncorrect) === level;
        });
      },

      resetDifficulties: () => {
        set({ difficulties: [] });
      },
    }),
    {
      name: 'civics-difficulty',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
