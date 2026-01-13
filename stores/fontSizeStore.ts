'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface FontSizeStore {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

export const FONT_SIZE_VALUES: Record<FontSize, { label: { vi: string; en: string }; scale: number }> = {
  small: { label: { vi: 'Nhỏ', en: 'Small' }, scale: 0.9 },
  medium: { label: { vi: 'Vừa', en: 'Medium' }, scale: 1 },
  large: { label: { vi: 'Lớn', en: 'Large' }, scale: 1.15 },
  xlarge: { label: { vi: 'Rất lớn', en: 'X-Large' }, scale: 1.3 },
};

export const useFontSizeStore = create<FontSizeStore>()(
  persist(
    (set) => ({
      fontSize: 'medium',
      setFontSize: (size: FontSize) => set({ fontSize: size }),
    }),
    {
      name: 'civics-font-size',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
