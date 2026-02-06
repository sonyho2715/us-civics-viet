type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'unrated';

interface DifficultyStoreReader {
  getDifficultyScore: (questionNumber: number) => number;
  getDifficulty: (questionNumber: number) => DifficultyLevel;
  getAllByDifficulty: (level: DifficultyLevel, allQuestionNumbers: number[]) => number[];
}

export function calculateDifficulty(
  correct: number,
  incorrect: number
): DifficultyLevel {
  const total = correct + incorrect;
  if (total === 0) return 'unrated';
  const score = incorrect / total;
  if (score < 0.25) return 'easy';
  if (score <= 0.6) return 'medium';
  return 'hard';
}

export function sortByDifficulty(
  questionNumbers: number[],
  store: DifficultyStoreReader
): number[] {
  return [...questionNumbers].sort((a, b) => {
    return store.getDifficultyScore(b) - store.getDifficultyScore(a);
  });
}

export function getDifficultyStats(
  store: DifficultyStoreReader,
  allQuestionNumbers: number[]
): { easy: number; medium: number; hard: number; unrated: number } {
  return {
    easy: store.getAllByDifficulty('easy', allQuestionNumbers).length,
    medium: store.getAllByDifficulty('medium', allQuestionNumbers).length,
    hard: store.getAllByDifficulty('hard', allQuestionNumbers).length,
    unrated: store.getAllByDifficulty('unrated', allQuestionNumbers).length,
  };
}
