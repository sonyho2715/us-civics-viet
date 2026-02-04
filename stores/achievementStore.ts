'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AchievementId, ACHIEVEMENTS } from '@/types';

interface AchievementState {
  unlockedAchievements: AchievementId[];
  totalXP: number;
  level: number;
  newAchievements: AchievementId[]; // Achievements unlocked but not yet viewed

  // Actions
  unlockAchievement: (id: AchievementId) => boolean; // Returns true if newly unlocked
  isUnlocked: (id: AchievementId) => boolean;
  markAchievementViewed: (id: AchievementId) => void;
  clearNewAchievements: () => void;
  getXPForNextLevel: () => number;
  getLevelProgress: () => number;

  // Check conditions (called from other parts of the app)
  checkAndUnlock: (condition: {
    questionsStudied?: number;
    testsCompleted?: number;
    testsPassed?: number;
    currentStreak?: number;
    categoryMastery?: { category: string; percentage: number };
    perfectTest?: boolean;
    fastTest?: boolean;
    bookmarksCount?: number;
    flashcardsReviewed?: number;
    seniorQuestionsCorrect?: number;
  }) => AchievementId[];
}

// XP required for each level (cumulative)
const LEVEL_THRESHOLDS = [
  0,      // Level 1: 0 XP
  50,     // Level 2: 50 XP
  150,    // Level 3: 150 XP
  300,    // Level 4: 300 XP
  500,    // Level 5: 500 XP
  750,    // Level 6: 750 XP
  1050,   // Level 7: 1050 XP
  1400,   // Level 8: 1400 XP
  1800,   // Level 9: 1800 XP
  2250,   // Level 10: 2250 XP
];

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlockedAchievements: [],
      totalXP: 0,
      level: 1,
      newAchievements: [],

      unlockAchievement: (id: AchievementId) => {
        const state = get();
        if (state.unlockedAchievements.includes(id)) {
          return false; // Already unlocked
        }

        const achievement = ACHIEVEMENTS.find((a) => a.id === id);
        if (!achievement) return false;

        const newXP = state.totalXP + achievement.xp;
        const newLevel = calculateLevel(newXP);

        set({
          unlockedAchievements: [...state.unlockedAchievements, id],
          totalXP: newXP,
          level: newLevel,
          newAchievements: [...state.newAchievements, id],
        });

        return true;
      },

      isUnlocked: (id: AchievementId) => {
        return get().unlockedAchievements.includes(id);
      },

      markAchievementViewed: (id: AchievementId) => {
        set((state) => ({
          newAchievements: state.newAchievements.filter((a) => a !== id),
        }));
      },

      clearNewAchievements: () => {
        set({ newAchievements: [] });
      },

      getXPForNextLevel: () => {
        const { level, totalXP } = get();
        if (level >= LEVEL_THRESHOLDS.length) {
          return 0; // Max level
        }
        return LEVEL_THRESHOLDS[level] - totalXP;
      },

      getLevelProgress: () => {
        const { level, totalXP } = get();
        if (level >= LEVEL_THRESHOLDS.length) {
          return 100; // Max level
        }
        const currentLevelXP = LEVEL_THRESHOLDS[level - 1];
        const nextLevelXP = LEVEL_THRESHOLDS[level];
        const progressXP = totalXP - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        return Math.round((progressXP / requiredXP) * 100);
      },

      checkAndUnlock: (condition) => {
        const unlocked: AchievementId[] = [];
        const { unlockAchievement } = get();

        // First question
        if (condition.questionsStudied && condition.questionsStudied >= 1) {
          if (unlockAchievement('first_question')) unlocked.push('first_question');
        }

        // All questions studied
        if (condition.questionsStudied && condition.questionsStudied >= 128) {
          if (unlockAchievement('all_questions')) unlocked.push('all_questions');
        }

        // First test
        if (condition.testsCompleted && condition.testsCompleted >= 1) {
          if (unlockAchievement('first_test')) unlocked.push('first_test');
        }

        // First pass
        if (condition.testsPassed && condition.testsPassed >= 1) {
          if (unlockAchievement('first_pass')) unlocked.push('first_pass');
        }

        // Streak achievements
        if (condition.currentStreak) {
          if (condition.currentStreak >= 7) {
            if (unlockAchievement('streak_7')) unlocked.push('streak_7');
          }
          if (condition.currentStreak >= 30) {
            if (unlockAchievement('streak_30')) unlocked.push('streak_30');
          }
        }

        // Category mastery
        if (condition.categoryMastery) {
          const { category, percentage } = condition.categoryMastery;
          if (percentage >= 90) {
            if (category === 'american_government') {
              if (unlockAchievement('category_master_gov')) unlocked.push('category_master_gov');
            } else if (category === 'american_history') {
              if (unlockAchievement('category_master_history')) unlocked.push('category_master_history');
            } else if (category === 'symbols_holidays') {
              if (unlockAchievement('category_master_symbols')) unlocked.push('category_master_symbols');
            }
          }
        }

        // Perfect test
        if (condition.perfectTest) {
          if (unlockAchievement('perfect_test')) unlocked.push('perfect_test');
        }

        // Fast test
        if (condition.fastTest) {
          if (unlockAchievement('speed_demon')) unlocked.push('speed_demon');
        }

        // Bookmarks
        if (condition.bookmarksCount && condition.bookmarksCount >= 20) {
          if (unlockAchievement('bookworm')) unlocked.push('bookworm');
        }

        // Flashcards
        if (condition.flashcardsReviewed && condition.flashcardsReviewed >= 100) {
          if (unlockAchievement('flashcard_pro')) unlocked.push('flashcard_pro');
        }

        // Senior questions
        if (condition.seniorQuestionsCorrect && condition.seniorQuestionsCorrect >= 20) {
          if (unlockAchievement('senior_ready')) unlocked.push('senior_ready');
        }

        return unlocked;
      },
    }),
    {
      name: 'civics-achievements',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
