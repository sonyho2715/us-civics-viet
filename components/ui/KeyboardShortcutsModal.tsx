'use client';

import { Modal } from './Modal';
import type { Locale } from '@/types';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

interface ShortcutEntry {
  key: string;
  description_en: string;
  description_vi: string;
}

interface ShortcutSection {
  title_en: string;
  title_vi: string;
  shortcuts: ShortcutEntry[];
}

const sections: ShortcutSection[] = [
  {
    title_en: 'General',
    title_vi: 'Chung',
    shortcuts: [
      { key: '?', description_en: 'Toggle keyboard shortcuts', description_vi: 'Bật/tắt phím tắt' },
      { key: 'D', description_en: 'Go to Dashboard', description_vi: 'Đi đến Bảng điều khiển' },
      { key: 'S', description_en: 'Go to Study', description_vi: 'Đi đến Học' },
      { key: 'P', description_en: 'Go to Practice Test', description_vi: 'Đi đến Thi thử' },
      { key: 'F', description_en: 'Go to Flashcards', description_vi: 'Đi đến Thẻ ghi nhớ' },
    ],
  },
  {
    title_en: 'Practice Test',
    title_vi: 'Thi Thử',
    shortcuts: [
      { key: '1-4', description_en: 'Select answer', description_vi: 'Chọn đáp án' },
      { key: 'Enter', description_en: 'Submit answer', description_vi: 'Nộp đáp án' },
      { key: '\u2190', description_en: 'Previous question', description_vi: 'Câu trước' },
      { key: '\u2192', description_en: 'Next question', description_vi: 'Câu sau' },
    ],
  },
  {
    title_en: 'Study Mode',
    title_vi: 'Chế Độ Học',
    shortcuts: [
      { key: 'J', description_en: 'Next question', description_vi: 'Câu sau' },
      { key: 'K', description_en: 'Previous question', description_vi: 'Câu trước' },
      { key: 'B', description_en: 'Bookmark question', description_vi: 'Đánh dấu câu hỏi' },
      { key: 'Space', description_en: 'Show answer', description_vi: 'Hiện đáp án' },
    ],
  },
  {
    title_en: 'Flashcards',
    title_vi: 'Thẻ Ghi Nhớ',
    shortcuts: [
      { key: 'Space', description_en: 'Flip card', description_vi: 'Lật thẻ' },
      { key: '\u2190', description_en: 'Previous card', description_vi: 'Thẻ trước' },
      { key: '\u2192', description_en: 'Next card', description_vi: 'Thẻ sau' },
      { key: '1', description_en: "Didn't know", description_vi: 'Chưa biết' },
      { key: '2', description_en: 'Knew it', description_vi: 'Đã biết' },
    ],
  },
];

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
  locale,
}: KeyboardShortcutsModalProps) {
  const isVi = locale === 'vi';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isVi ? 'Phím Tắt' : 'Keyboard Shortcuts'}
      size="lg"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              {isVi ? section.title_vi : section.title_en}
            </h3>
            <div className="space-y-2">
              {section.shortcuts.map((shortcut, sIdx) => (
                <div
                  key={sIdx}
                  className="flex items-center justify-between py-1.5"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {isVi ? shortcut.description_vi : shortcut.description_en}
                  </span>
                  <kbd className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-xs font-mono font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded shadow-sm">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-slate-700">
          {isVi
            ? 'Phím tắt không hoạt động khi bạn đang nhập liệu.'
            : 'Shortcuts are disabled while typing in input fields.'}
        </p>
      </div>
    </Modal>
  );
}
