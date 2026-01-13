import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress } from '@/types';

interface ProgressState extends UserProgress {
  // Actions
  markQuestionStudied: (questionId: number) => void;
  markQuestionCorrect: (questionId: number) => void;
  markQuestionIncorrect: (questionId: number) => void;
  incrementTestsCompleted: () => void;
  incrementTestsPassed: () => void;
  updateStreak: () => void;
  resetProgress: () => void;
  getStudyPercentage: () => number;
}

const defaultProgress: UserProgress = {
  questionsStudied: [],
  questionsCorrect: [],
  questionsIncorrect: [],
  testsCompleted: 0,
  testsPassed: 0,
  streak: 0,
  lastStudyDate: '',
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...defaultProgress,

      markQuestionStudied: (questionId) => {
        set((state) => ({
          questionsStudied: state.questionsStudied.includes(questionId)
            ? state.questionsStudied
            : [...state.questionsStudied, questionId],
        }));
      },

      markQuestionCorrect: (questionId) => {
        set((state) => ({
          questionsCorrect: state.questionsCorrect.includes(questionId)
            ? state.questionsCorrect
            : [...state.questionsCorrect, questionId],
          questionsIncorrect: state.questionsIncorrect.filter((id) => id !== questionId),
        }));
      },

      markQuestionIncorrect: (questionId) => {
        set((state) => ({
          questionsIncorrect: state.questionsIncorrect.includes(questionId)
            ? state.questionsIncorrect
            : [...state.questionsIncorrect, questionId],
        }));
      },

      incrementTestsCompleted: () => {
        set((state) => ({
          testsCompleted: state.testsCompleted + 1,
        }));
      },

      incrementTestsPassed: () => {
        set((state) => ({
          testsPassed: state.testsPassed + 1,
        }));
      },

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().lastStudyDate;

        if (!lastDate) {
          set({ streak: 1, lastStudyDate: today });
          return;
        }

        const lastStudy = new Date(lastDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor(
          (todayDate.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
          // Same day, no change
          return;
        } else if (diffDays === 1) {
          // Consecutive day
          set((state) => ({
            streak: state.streak + 1,
            lastStudyDate: today,
          }));
        } else {
          // Streak broken
          set({ streak: 1, lastStudyDate: today });
        }
      },

      resetProgress: () => set(defaultProgress),

      getStudyPercentage: () => {
        const studied = get().questionsStudied.length;
        return Math.round((studied / 128) * 100);
      },
    }),
    {
      name: 'civics-progress',
    }
  )
);
