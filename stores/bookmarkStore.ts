'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookmarkStore {
  bookmarkedIds: number[];
  addBookmark: (questionId: number) => void;
  removeBookmark: (questionId: number) => void;
  toggleBookmark: (questionId: number) => void;
  isBookmarked: (questionId: number) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],

      addBookmark: (questionId: number) => {
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.includes(questionId)
            ? state.bookmarkedIds
            : [...state.bookmarkedIds, questionId],
        }));
      },

      removeBookmark: (questionId: number) => {
        set((state) => ({
          bookmarkedIds: state.bookmarkedIds.filter((id) => id !== questionId),
        }));
      },

      toggleBookmark: (questionId: number) => {
        const { bookmarkedIds } = get();
        if (bookmarkedIds.includes(questionId)) {
          set({ bookmarkedIds: bookmarkedIds.filter((id) => id !== questionId) });
        } else {
          set({ bookmarkedIds: [...bookmarkedIds, questionId] });
        }
      },

      isBookmarked: (questionId: number) => {
        return get().bookmarkedIds.includes(questionId);
      },

      clearBookmarks: () => {
        set({ bookmarkedIds: [] });
      },
    }),
    {
      name: 'civics-bookmarks',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
