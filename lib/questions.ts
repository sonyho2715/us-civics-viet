import questionsData from '@/data/civics-questions-2025.json';
import type { Question, Category } from '@/types';
import { SENIOR_65_20_QUESTIONS } from '@/types';

// Get all questions
export function getAllQuestions(): Question[] {
  return questionsData.questions as Question[];
}

// Get questions by category
export function getQuestionsByCategory(category: Category): Question[] {
  return getAllQuestions().filter((q) => q.category === category);
}

// Get 65/20 questions for seniors
export function getSeniorQuestions(): Question[] {
  return getAllQuestions().filter((q) => q.is_65_20);
}

// Get question by ID
export function getQuestionById(id: number): Question | undefined {
  return getAllQuestions().find((q) => q.id === id);
}

// Get questions by IDs
export function getQuestionsByIds(ids: number[]): Question[] {
  return getAllQuestions().filter((q) => ids.includes(q.id));
}

// Search questions
export function searchQuestions(query: string, locale: 'vi' | 'en' = 'vi'): Question[] {
  const lowerQuery = query.toLowerCase();
  return getAllQuestions().filter((q) => {
    const questionText = locale === 'vi' ? q.question_vi : q.question_en;
    const answers = locale === 'vi' ? q.answers_vi : q.answers_en;

    return (
      questionText.toLowerCase().includes(lowerQuery) ||
      answers.some((a) => a.toLowerCase().includes(lowerQuery)) ||
      q.explanation_vi.toLowerCase().includes(lowerQuery)
    );
  });
}

// Get category statistics
export function getCategoryStats(): {
  category: Category;
  total: number;
  seniorCount: number;
}[] {
  const questions = getAllQuestions();
  const categories: Category[] = ['american_government', 'american_history', 'symbols_holidays'];

  return categories.map((category) => {
    const categoryQuestions = questions.filter((q) => q.category === category);
    return {
      category,
      total: categoryQuestions.length,
      seniorCount: categoryQuestions.filter((q) => q.is_65_20).length,
    };
  });
}

// Get metadata
export function getQuestionsMetadata() {
  return questionsData.metadata;
}

// Verify 65/20 questions match expected list
export function verify65_20Questions(): boolean {
  const seniorQuestions = getSeniorQuestions();
  const seniorIds = seniorQuestions.map((q) => q.question_number);

  return (
    seniorIds.length === SENIOR_65_20_QUESTIONS.length &&
    seniorIds.every((id) => SENIOR_65_20_QUESTIONS.includes(id))
  );
}
