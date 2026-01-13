import type { Question, TestMode, TestResult } from '@/types';

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate standard test: 20 random questions from all 128
export function generateStandardTest(questions: Question[]): Question[] {
  return shuffleArray(questions).slice(0, 20);
}

// Generate 65/20 test: 10 random questions from senior questions
export function generate65_20Test(questions: Question[]): Question[] {
  const seniorQuestions = questions.filter((q) => q.is_65_20);
  return shuffleArray(seniorQuestions).slice(0, 10);
}

// Generate test based on mode
export function generateTest(questions: Question[], mode: TestMode): Question[] {
  switch (mode) {
    case 'standard':
      return generateStandardTest(questions);
    case '65_20':
      return generate65_20Test(questions);
    default:
      return generateStandardTest(questions);
  }
}

// Get pass threshold for test mode
export function getPassThreshold(mode: TestMode): number {
  return mode === 'standard' ? 12 : 6;
}

// Get total questions for test mode
export function getTotalQuestions(mode: TestMode): number {
  return mode === 'standard' ? 20 : 10;
}

// Check if an answer is correct
export function isAnswerCorrect(
  question: Question,
  userAnswer: string,
  locale: 'vi' | 'en' = 'vi'
): boolean {
  const answers = locale === 'vi' ? question.answers_vi : question.answers_en;
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();

  return answers.some(
    (correctAnswer) => correctAnswer.toLowerCase().trim() === normalizedUserAnswer
  );
}

// Calculate test results
export function calculateResults(
  questions: Question[],
  answers: Record<number, string>,
  mode: TestMode,
  locale: 'vi' | 'en' = 'vi'
): Omit<TestResult, 'timeSpent'> {
  let correctCount = 0;
  const correctQuestions: Question[] = [];
  const incorrectQuestions: Question[] = [];

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    if (userAnswer && isAnswerCorrect(question, userAnswer, locale)) {
      correctCount++;
      correctQuestions.push(question);
    } else {
      incorrectQuestions.push(question);
    }
  });

  const passThreshold = getPassThreshold(mode);

  return {
    correct: correctCount,
    total: questions.length,
    passed: correctCount >= passThreshold,
    correctQuestions,
    incorrectQuestions,
  };
}

// Get encouragement message based on score
export function getEncouragementKey(
  correct: number,
  total: number
): 'excellent' | 'good' | 'needsWork' {
  const percentage = (correct / total) * 100;

  if (percentage >= 90) {
    return 'excellent';
  } else if (percentage >= 60) {
    return 'good';
  } else {
    return 'needsWork';
  }
}

// Format time from seconds to mm:ss
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate practice questions from incorrect answers
export function generatePracticeFromMistakes(
  incorrectQuestions: Question[],
  allQuestions: Question[],
  additionalCount: number = 5
): Question[] {
  // Start with the incorrect questions
  const practiceSet = [...incorrectQuestions];

  // Add some additional random questions
  const remainingQuestions = allQuestions.filter(
    (q) => !incorrectQuestions.some((iq) => iq.id === q.id)
  );

  const additionalQuestions = shuffleArray(remainingQuestions).slice(0, additionalCount);

  return shuffleArray([...practiceSet, ...additionalQuestions]);
}
