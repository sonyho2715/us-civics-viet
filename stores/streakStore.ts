'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface DailyProgress {
  date: string; // YYYY-MM-DD format
  questionsStudied: number;
  testsCompleted: number;
  flashcardsReviewed: number;
}

interface StreakStore {
  // Streak data
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  totalDaysStudied: number;

  // Daily goal settings
  dailyGoal: number; // Questions to study per day
  todayProgress: DailyProgress | null;

  // History (last 30 days)
  history: DailyProgress[];

  // Actions
  recordActivity: (type: 'study' | 'test' | 'flashcard', count?: number) => void;
  setDailyGoal: (goal: number) => void;
  getStreakStatus: () => {
    isActive: boolean;
    daysRemaining: number;
    percentComplete: number;
  };
  resetStreak: () => void;
}

function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function isToday(dateString: string | null): boolean {
  if (!dateString) return false;
  return dateString === getTodayDateString();
}

function isYesterday(dateString: string | null): boolean {
  if (!dateString) return false;
  return dateString === getYesterdayDateString();
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      totalDaysStudied: 0,
      dailyGoal: 10,
      todayProgress: null,
      history: [],

      recordActivity: (type: 'study' | 'test' | 'flashcard', count = 1) => {
        const today = getTodayDateString();
        const state = get();

        // Check if we need to update streak
        let newStreak = state.currentStreak;
        let newTotalDays = state.totalDaysStudied;

        // If last activity was not today
        if (!isToday(state.lastActiveDate)) {
          // If last activity was yesterday, increment streak
          if (isYesterday(state.lastActiveDate)) {
            newStreak = state.currentStreak + 1;
          } else if (state.lastActiveDate === null) {
            // First ever activity
            newStreak = 1;
          } else {
            // Streak broken - reset to 1
            newStreak = 1;
          }
          newTotalDays = state.totalDaysStudied + 1;
        }

        // Update today's progress
        const todayProgress: DailyProgress = state.todayProgress && isToday(state.lastActiveDate)
          ? { ...state.todayProgress }
          : {
              date: today,
              questionsStudied: 0,
              testsCompleted: 0,
              flashcardsReviewed: 0,
            };

        switch (type) {
          case 'study':
            todayProgress.questionsStudied += count;
            break;
          case 'test':
            todayProgress.testsCompleted += count;
            break;
          case 'flashcard':
            todayProgress.flashcardsReviewed += count;
            break;
        }

        // Update history (keep last 30 days)
        let newHistory = [...state.history];
        const existingIndex = newHistory.findIndex((h) => h.date === today);
        if (existingIndex >= 0) {
          newHistory[existingIndex] = todayProgress;
        } else {
          newHistory.push(todayProgress);
        }
        // Keep only last 30 days
        newHistory = newHistory
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 30);

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastActiveDate: today,
          totalDaysStudied: newTotalDays,
          todayProgress,
          history: newHistory,
        });
      },

      setDailyGoal: (goal: number) => {
        set({ dailyGoal: Math.max(1, Math.min(50, goal)) });
      },

      getStreakStatus: () => {
        const state = get();
        const todayTotal = state.todayProgress
          ? state.todayProgress.questionsStudied +
            state.todayProgress.testsCompleted * 10 +
            state.todayProgress.flashcardsReviewed
          : 0;

        const percentComplete = Math.min(100, (todayTotal / state.dailyGoal) * 100);
        const isActive = isToday(state.lastActiveDate) || isYesterday(state.lastActiveDate);

        // Calculate hours remaining in the day
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const hoursRemaining = Math.max(0, (endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60));

        return {
          isActive,
          daysRemaining: Math.ceil(hoursRemaining / 24),
          percentComplete,
        };
      },

      resetStreak: () => {
        set({
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
          totalDaysStudied: 0,
          todayProgress: null,
          history: [],
        });
      },
    }),
    {
      name: 'civics-streak',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
