'use client';

import { useMemo } from 'react';
import officialsData from '@/data/current-officials.json';
import type { Question, DynamicType, Locale, StateCode } from '@/types';

interface DynamicOfficialsData {
  metadata: {
    lastUpdated: string;
    source: string;
    note: string;
  };
  officials: {
    president: { name_en: string; name_vi: string; party_en: string; party_vi: string; since: string };
    vice_president: { name_en: string; name_vi: string; party_en: string; party_vi: string; since: string };
    speaker_of_house: { name_en: string; name_vi: string; party_en: string; party_vi: string; since: string };
    chief_justice: { name_en: string; name_vi: string; since: string };
  };
  dynamic_questions: Record<string, {
    question_number: number;
    type: DynamicType;
    current_answer_en?: string;
    current_answer_vi?: string;
    note_en?: string;
    note_vi?: string;
  }>;
  state_data: Record<StateCode, { capital: string; governor: string }>;
}

const data = officialsData as DynamicOfficialsData;

export function useDynamicOfficials(userState?: StateCode) {
  const officials = useMemo(() => data.officials, []);
  const metadata = useMemo(() => data.metadata, []);

  /**
   * Get the current answer for a dynamic question based on question type and user's state
   */
  const getDynamicAnswer = useMemo(() => {
    return (questionNumber: number, locale: Locale): string[] | null => {
      const questionData = data.dynamic_questions[questionNumber.toString()];
      if (!questionData) return null;

      switch (questionData.type) {
        case 'president':
          return [locale === 'vi' ? officials.president.name_vi : officials.president.name_en];

        case 'vice_president':
          return [locale === 'vi' ? officials.vice_president.name_vi : officials.vice_president.name_en];

        case 'speaker_of_house':
          return [locale === 'vi' ? officials.speaker_of_house.name_vi : officials.speaker_of_house.name_en];

        case 'chief_justice':
          return [locale === 'vi' ? officials.chief_justice.name_vi : officials.chief_justice.name_en];

        case 'president_party':
          return [locale === 'vi' ? `Đảng ${officials.president.party_vi}` : `${officials.president.party_en} Party`];

        case 'governor':
          if (userState && data.state_data[userState]) {
            const governor = data.state_data[userState].governor;
            return [governor !== 'N/A' ? governor : null].filter(Boolean) as string[];
          }
          return null;

        case 'state_capital':
          if (userState && data.state_data[userState]) {
            const capital = data.state_data[userState].capital;
            return [capital !== 'N/A' ? capital : null].filter(Boolean) as string[];
          }
          return null;

        case 'state_senator':
        case 'representative':
          // These require API lookup or manual entry
          return null;

        default:
          return null;
      }
    };
  }, [officials, userState]);

  /**
   * Get the note for a dynamic question (e.g., "Answer depends on your state")
   */
  const getDynamicNote = useMemo(() => {
    return (questionNumber: number, locale: Locale): string | null => {
      const questionData = data.dynamic_questions[questionNumber.toString()];
      if (!questionData) return null;
      return locale === 'vi' ? questionData.note_vi || null : questionData.note_en || null;
    };
  }, []);

  /**
   * Enrich a question with dynamic data (current officials, state-specific data)
   */
  const enrichQuestion = useMemo(() => {
    return (question: Question, locale: Locale): Question => {
      if (!question.is_dynamic) return question;

      const dynamicAnswers = getDynamicAnswer(question.question_number, locale);
      const note = getDynamicNote(question.question_number, locale);

      if (!dynamicAnswers) {
        // Add a note if no specific answer available
        if (note) {
          const enrichedExplanation = locale === 'vi'
            ? `${question.explanation_vi}\n\n⚠️ ${note}`
            : `${question.explanation_en || ''}\n\n⚠️ ${note}`;

          return {
            ...question,
            explanation_vi: locale === 'vi' ? enrichedExplanation : question.explanation_vi,
            explanation_en: locale === 'en' ? enrichedExplanation : question.explanation_en,
          };
        }
        return question;
      }

      // Replace answers with current dynamic data
      return {
        ...question,
        answers_en: locale === 'en' ? dynamicAnswers : question.answers_en,
        answers_vi: locale === 'vi' ? dynamicAnswers : question.answers_vi,
      };
    };
  }, [getDynamicAnswer, getDynamicNote]);

  /**
   * Check if a dynamic question has location-specific answer
   */
  const isLocationDependent = (questionNumber: number): boolean => {
    const questionData = data.dynamic_questions[questionNumber.toString()];
    if (!questionData) return false;
    return ['governor', 'state_capital', 'state_senator', 'representative'].includes(questionData.type);
  };

  /**
   * Get state-specific data
   */
  const getStateData = (stateCode: StateCode) => {
    return data.state_data[stateCode] || null;
  };

  /**
   * Get all state governors (useful for a lookup/selection UI)
   */
  const getAllGovernors = () => {
    return Object.entries(data.state_data).map(([code, info]) => ({
      stateCode: code as StateCode,
      governor: info.governor,
      capital: info.capital,
    }));
  };

  return {
    officials,
    metadata,
    getDynamicAnswer,
    getDynamicNote,
    enrichQuestion,
    isLocationDependent,
    getStateData,
    getAllGovernors,
  };
}

// Static exports for server-side usage
export const currentOfficials = data.officials;
export const officialsMetadata = data.metadata;
export const stateData = data.state_data;
