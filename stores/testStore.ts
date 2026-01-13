import { create } from 'zustand';
import type { Question, TestSession, TestResult, TestMode } from '@/types';

interface TestState {
  session: TestSession | null;
  result: TestResult | null;

  // Actions
  startTest: (questions: Question[], mode: TestMode) => void;
  answerQuestion: (questionId: number, answer: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitTest: () => TestResult;
  resetTest: () => void;

  // Getters
  getCurrentQuestion: () => Question | null;
  getProgress: () => { answered: number; total: number };
  isQuestionAnswered: (questionId: number) => boolean;
}

const generateSessionId = () => {
  return `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useTestStore = create<TestState>((set, get) => ({
  session: null,
  result: null,

  startTest: (questions, mode) => {
    set({
      session: {
        id: generateSessionId(),
        mode,
        questions,
        currentIndex: 0,
        answers: {},
        startTime: new Date(),
        isComplete: false,
      },
      result: null,
    });
  },

  answerQuestion: (questionId, answer) => {
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          answers: {
            ...state.session.answers,
            [questionId]: answer,
          },
        },
      };
    });
  },

  goToQuestion: (index) => {
    set((state) => {
      if (!state.session) return state;
      const maxIndex = state.session.questions.length - 1;
      return {
        session: {
          ...state.session,
          currentIndex: Math.max(0, Math.min(index, maxIndex)),
        },
      };
    });
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.session) return state;
      const nextIndex = Math.min(
        state.session.currentIndex + 1,
        state.session.questions.length - 1
      );
      return {
        session: {
          ...state.session,
          currentIndex: nextIndex,
        },
      };
    });
  },

  previousQuestion: () => {
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          currentIndex: Math.max(0, state.session.currentIndex - 1),
        },
      };
    });
  },

  submitTest: () => {
    const { session } = get();
    if (!session) {
      throw new Error('No active test session');
    }

    const timeSpent = Math.floor(
      (new Date().getTime() - session.startTime.getTime()) / 1000
    );

    let correctCount = 0;
    const correctQuestions: Question[] = [];
    const incorrectQuestions: Question[] = [];

    session.questions.forEach((question) => {
      const userAnswer = session.answers[question.id];
      // Check if user's answer matches any of the correct answers
      const isCorrect = userAnswer && (
        question.answers_en.some(
          (answer) => answer.toLowerCase() === userAnswer.toLowerCase()
        ) ||
        question.answers_vi.some(
          (answer) => answer.toLowerCase() === userAnswer.toLowerCase()
        )
      );

      if (isCorrect) {
        correctCount++;
        correctQuestions.push(question);
      } else {
        incorrectQuestions.push(question);
      }
    });

    const passThreshold = session.mode === 'standard' ? 12 : 6;
    const passed = correctCount >= passThreshold;

    const result: TestResult = {
      correct: correctCount,
      total: session.questions.length,
      passed,
      timeSpent,
      correctQuestions,
      incorrectQuestions,
    };

    set({
      session: {
        ...session,
        isComplete: true,
      },
      result,
    });

    return result;
  },

  resetTest: () => {
    set({
      session: null,
      result: null,
    });
  },

  getCurrentQuestion: () => {
    const { session } = get();
    if (!session) return null;
    return session.questions[session.currentIndex];
  },

  getProgress: () => {
    const { session } = get();
    if (!session) return { answered: 0, total: 0 };
    return {
      answered: Object.keys(session.answers).length,
      total: session.questions.length,
    };
  },

  isQuestionAnswered: (questionId) => {
    const { session } = get();
    if (!session) return false;
    return questionId in session.answers;
  },
}));
