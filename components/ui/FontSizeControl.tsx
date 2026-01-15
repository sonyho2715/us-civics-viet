'use client';

import { useEffect, useState } from 'react';
import { Type, Minus, Plus } from 'lucide-react';
import { useFontSizeStore, FONT_SIZE_VALUES, type FontSize } from '@/stores/fontSizeStore';
import type { Locale } from '@/types';

interface FontSizeControlProps {
  locale: Locale;
  compact?: boolean;
}

const FONT_SIZES: FontSize[] = ['small', 'medium', 'large', 'xlarge'];

export function FontSizeControl({ locale, compact = false }: FontSizeControlProps) {
  const { fontSize, setFontSize } = useFontSizeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply font size to document root
  useEffect(() => {
    if (mounted) {
      const scale = FONT_SIZE_VALUES[fontSize].scale;
      document.documentElement.style.setProperty('--font-scale', scale.toString());
      // Also apply a class for easier CSS targeting
      document.documentElement.setAttribute('data-font-size', fontSize);
    }
  }, [fontSize, mounted]);

  if (!mounted) {
    return null;
  }

  const currentIndex = FONT_SIZES.indexOf(fontSize);

  const handleDecrease = () => {
    if (currentIndex > 0) {
      setFontSize(FONT_SIZES[currentIndex - 1]);
    }
  };

  const handleIncrease = () => {
    if (currentIndex < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[currentIndex + 1]);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
        <button
          onClick={handleDecrease}
          disabled={currentIndex === 0}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title={locale === 'vi' ? 'Giảm cỡ chữ' : 'Decrease font size'}
        >
          <Minus className="w-4 h-4 text-gray-600 dark:text-slate-300" />
        </button>
        <span className="px-2 text-sm font-medium text-gray-700 dark:text-slate-300 min-w-[60px] text-center">
          {FONT_SIZE_VALUES[fontSize].label[locale]}
        </span>
        <button
          onClick={handleIncrease}
          disabled={currentIndex === FONT_SIZES.length - 1}
          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title={locale === 'vi' ? 'Tăng cỡ chữ' : 'Increase font size'}
        >
          <Plus className="w-4 h-4 text-gray-600 dark:text-slate-300" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {locale === 'vi' ? 'Cỡ Chữ' : 'Font Size'}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {FONT_SIZE_VALUES[fontSize].label[locale]}
        </span>
      </div>

      {/* Font size buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title={locale === 'vi' ? 'Giảm cỡ chữ' : 'Decrease font size'}
        >
          <Minus className="w-5 h-5 text-gray-600 dark:text-slate-300" />
        </button>

        <div className="flex-1 flex gap-1">
          {FONT_SIZES.map((size, index) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                fontSize === size
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              <span
                style={{ fontSize: `${12 + index * 2}px` }}
                className="block"
              >
                A
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleIncrease}
          disabled={currentIndex === FONT_SIZES.length - 1}
          className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title={locale === 'vi' ? 'Tăng cỡ chữ' : 'Increase font size'}
        >
          <Plus className="w-5 h-5 text-gray-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Preview text */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
        <p
          className="text-gray-700 dark:text-slate-300 transition-all"
          style={{ fontSize: `calc(1rem * ${FONT_SIZE_VALUES[fontSize].scale})` }}
        >
          {locale === 'vi'
            ? 'Ví dụ: Bạn có thể điều chỉnh cỡ chữ để dễ đọc hơn.'
            : 'Example: You can adjust the font size for easier reading.'}
        </p>
      </div>
    </div>
  );
}
