'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WrongAnswer {
  questionNumber: number;
  wrongCount: number;
  lastWrong: string; // ISO date string
}

interface WrongAnswerStore {
  wrongAnswers: WrongAnswer[];
  addWrongAnswer: (questionNumber: number) => void;
  removeWrongAnswer: (questionNumber: number) => void;
  markCorrect: (questionNumber: number) => void;
  isWrongAnswer: (questionNumber: number) => boolean;
  getWrongCount: (questionNumber: number) => number;
  clearAllWrongAnswers: () => void;
}

export const useWrongAnswerStore = create<WrongAnswerStore>()(
  persist(
    (set, get) => ({
      wrongAnswers: [],

      addWrongAnswer: (questionNumber: number) => {
        set((state) => {
          const existing = state.wrongAnswers.find(
            (w) => w.questionNumber === questionNumber
          );

          if (existing) {
            return {
              wrongAnswers: state.wrongAnswers.map((w) =>
                w.questionNumber === questionNumber
                  ? {
                      ...w,
                      wrongCount: w.wrongCount + 1,
                      lastWrong: new Date().toISOString(),
                    }
                  : w
              ),
            };
          }

          return {
            wrongAnswers: [
              ...state.wrongAnswers,
              {
                questionNumber,
                wrongCount: 1,
                lastWrong: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeWrongAnswer: (questionNumber: number) => {
        set((state) => ({
          wrongAnswers: state.wrongAnswers.filter(
            (w) => w.questionNumber !== questionNumber
          ),
        }));
      },

      markCorrect: (questionNumber: number) => {
        // When user gets it right, we can remove it from wrong answers
        // or decrease the count - let's remove it to signify they've learned it
        set((state) => ({
          wrongAnswers: state.wrongAnswers.filter(
            (w) => w.questionNumber !== questionNumber
          ),
        }));
      },

      isWrongAnswer: (questionNumber: number) => {
        return get().wrongAnswers.some(
          (w) => w.questionNumber === questionNumber
        );
      },

      getWrongCount: (questionNumber: number) => {
        const wrong = get().wrongAnswers.find(
          (w) => w.questionNumber === questionNumber
        );
        return wrong?.wrongCount ?? 0;
      },

      clearAllWrongAnswers: () => {
        set({ wrongAnswers: [] });
      },
    }),
    {
      name: 'civics-wrong-answers',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
