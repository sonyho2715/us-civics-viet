import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale, StateCode } from '@/types';

export type AnswerMode = 'text' | 'multiple_choice';

interface SettingsState {
  locale: Locale;
  state: StateCode;
  showImmediateFeedback: boolean;
  timerEnabled: boolean;
  darkMode: boolean;
  answerMode: AnswerMode;

  // Actions
  setLocale: (locale: Locale) => void;
  setState: (state: StateCode) => void;
  setShowImmediateFeedback: (show: boolean) => void;
  setTimerEnabled: (enabled: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setAnswerMode: (mode: AnswerMode) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  locale: 'vi' as Locale,
  state: 'HI' as StateCode, // Default to Hawaii for this user
  showImmediateFeedback: true,
  timerEnabled: false,
  darkMode: false,
  answerMode: 'text' as AnswerMode,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setLocale: (locale) => set({ locale }),
      setState: (state) => set({ state }),
      setShowImmediateFeedback: (show) => set({ showImmediateFeedback: show }),
      setTimerEnabled: (enabled) => set({ timerEnabled: enabled }),
      setDarkMode: (darkMode) => set({ darkMode }),
      setAnswerMode: (mode) => set({ answerMode: mode }),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'civics-settings',
    }
  )
);
