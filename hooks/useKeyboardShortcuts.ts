'use client';

import { useCallback, useEffect } from 'react';

type ShortcutContext = 'global' | 'test' | 'study' | 'flashcard';

type ShortcutHandlers = Record<string, () => void>;

function isInputFocused(): boolean {
  const activeElement = document.activeElement;
  if (!activeElement) return false;
  const tagName = activeElement.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    (activeElement as HTMLElement).isContentEditable
  );
}

// Shortcut definitions per context
const SHORTCUT_KEYS: Record<ShortcutContext, Record<string, string>> = {
  global: {
    '?': 'toggleHelp',
    d: 'goToDashboard',
    s: 'goToStudy',
    p: 'goToPractice',
    f: 'goToFlashcards',
  },
  test: {
    '1': 'selectAnswer1',
    '2': 'selectAnswer2',
    '3': 'selectAnswer3',
    '4': 'selectAnswer4',
    Enter: 'submit',
    ArrowLeft: 'previousQuestion',
    ArrowRight: 'nextQuestion',
  },
  study: {
    j: 'nextQuestion',
    k: 'previousQuestion',
    b: 'bookmark',
    ' ': 'showAnswer',
  },
  flashcard: {
    ' ': 'flip',
    ArrowLeft: 'previous',
    ArrowRight: 'next',
    '1': 'didntKnow',
    '2': 'knewIt',
  },
};

export function useKeyboardShortcuts(
  context: ShortcutContext,
  handlers: ShortcutHandlers
): void {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isInputFocused()) return;

      const keyMap = SHORTCUT_KEYS[context];
      const action = keyMap[e.key];

      if (action && handlers[action]) {
        e.preventDefault();
        handlers[action]();
      }
    },
    [context, handlers]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Export shortcut definitions for the help modal
export { SHORTCUT_KEYS };
export type { ShortcutContext };
