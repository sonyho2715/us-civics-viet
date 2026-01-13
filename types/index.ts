// Core TypeScript interfaces for the USCIS Civics Test application

export type Category = 'american_government' | 'american_history' | 'symbols_holidays';
export type Locale = 'vi' | 'en';
export type TestMode = 'standard' | '65_20';
export type DynamicType =
  | 'president'
  | 'vice_president'
  | 'speaker_of_house'
  | 'chief_justice'
  | 'state_senator'
  | 'representative'
  | 'governor'
  | 'state_capital';

export interface Question {
  id: number;
  question_number: number;
  category: Category;
  subcategory: string;
  question_en: string;
  question_vi: string;
  answers_en: string[];
  answers_vi: string[];
  explanation_vi: string;
  is_65_20: boolean;
  is_dynamic: boolean;
  dynamic_type?: DynamicType;
}

export interface TestSession {
  id: string;
  mode: TestMode;
  questions: Question[];
  currentIndex: number;
  answers: Record<number, string>;
  startTime: Date;
  isComplete: boolean;
}

export interface TestResult {
  correct: number;
  total: number;
  passed: boolean;
  timeSpent: number;
  incorrectQuestions: Question[];
  correctQuestions: Question[];
}

export interface UserProgress {
  questionsStudied: number[];
  questionsCorrect: number[];
  questionsIncorrect: number[];
  testsCompleted: number;
  testsPassed: number;
  streak: number;
  lastStudyDate: string;
}

export interface UserSettings {
  locale: Locale;
  state: string;
  showImmediateFeedback: boolean;
  timerEnabled: boolean;
  darkMode: boolean;
}

// Category metadata for display
export interface CategoryInfo {
  id: Category;
  name_en: string;
  name_vi: string;
  questionRange: [number, number];
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'american_government',
    name_en: 'American Government',
    name_vi: 'Chính Phủ Hoa Kỳ',
    questionRange: [1, 72],
    icon: '🏛️',
  },
  {
    id: 'american_history',
    name_en: 'American History',
    name_vi: 'Lịch Sử Hoa Kỳ',
    questionRange: [73, 118],
    icon: '📜',
  },
  {
    id: 'symbols_holidays',
    name_en: 'Symbols & Holidays',
    name_vi: 'Biểu Tượng & Ngày Lễ',
    questionRange: [119, 128],
    icon: '🗽',
  },
];

// 65/20 Question IDs (20 questions for seniors 65+ who lived in US 20+ years)
export const SENIOR_65_20_QUESTIONS = [
  2, 7, 12, 20, 30, 36, 38, 39, 44, 52,
  61, 66, 74, 78, 86, 94, 113, 115, 121, 126
];

// Dynamic answer questions (answers may change based on elections)
export const DYNAMIC_QUESTIONS = [23, 29, 30, 38, 39, 57, 61, 62];

// US States for personalization
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'Washington D.C.' },
] as const;

export type StateCode = typeof US_STATES[number]['code'];
