// Core TypeScript interfaces for the USCIS Civics Test application

export type Category = 'american_government' | 'american_history' | 'symbols_holidays';
export type Locale = 'vi' | 'en';
export type TestMode = 'standard' | '65_20';
export type DynamicType =
  | 'president'
  | 'vice_president'
  | 'speaker_of_house'
  | 'chief_justice'
  | 'president_party'
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
  explanation_en?: string;
  explanation_vi: string;
  is_65_20: boolean;
  is_dynamic: boolean;
  dynamic_type?: DynamicType;
}

// Achievement system types
export type AchievementId =
  | 'first_question'
  | 'first_test'
  | 'first_pass'
  | 'streak_7'
  | 'streak_30'
  | 'category_master_gov'
  | 'category_master_history'
  | 'category_master_symbols'
  | 'all_questions'
  | 'perfect_test'
  | 'senior_ready'
  | 'speed_demon'
  | 'bookworm'
  | 'flashcard_pro';

export interface Achievement {
  id: AchievementId;
  name_en: string;
  name_vi: string;
  description_en: string;
  description_vi: string;
  icon: string;
  xp: number;
  requirement: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_question',
    name_en: 'First Step',
    name_vi: 'Bước Đầu Tiên',
    description_en: 'Study your first question',
    description_vi: 'Học câu hỏi đầu tiên',
    icon: '🎯',
    xp: 10,
    requirement: 'study_1_question',
  },
  {
    id: 'first_test',
    name_en: 'Test Taker',
    name_vi: 'Người Thi',
    description_en: 'Complete your first practice test',
    description_vi: 'Hoàn thành bài thi thử đầu tiên',
    icon: '📝',
    xp: 25,
    requirement: 'complete_1_test',
  },
  {
    id: 'first_pass',
    name_en: 'Victory!',
    name_vi: 'Chiến Thắng!',
    description_en: 'Pass your first practice test',
    description_vi: 'Đậu bài thi thử đầu tiên',
    icon: '🏆',
    xp: 50,
    requirement: 'pass_1_test',
  },
  {
    id: 'streak_7',
    name_en: 'Week Warrior',
    name_vi: 'Chiến Binh Tuần',
    description_en: 'Maintain a 7-day study streak',
    description_vi: 'Duy trì chuỗi học 7 ngày',
    icon: '🔥',
    xp: 100,
    requirement: 'streak_7_days',
  },
  {
    id: 'streak_30',
    name_en: 'Monthly Master',
    name_vi: 'Bậc Thầy Tháng',
    description_en: 'Maintain a 30-day study streak',
    description_vi: 'Duy trì chuỗi học 30 ngày',
    icon: '⭐',
    xp: 500,
    requirement: 'streak_30_days',
  },
  {
    id: 'category_master_gov',
    name_en: 'Government Expert',
    name_vi: 'Chuyên Gia Chính Phủ',
    description_en: 'Master all American Government questions',
    description_vi: 'Thành thạo tất cả câu hỏi Chính Phủ',
    icon: '🏛️',
    xp: 200,
    requirement: 'master_category_government',
  },
  {
    id: 'category_master_history',
    name_en: 'History Buff',
    name_vi: 'Chuyên Gia Lịch Sử',
    description_en: 'Master all American History questions',
    description_vi: 'Thành thạo tất cả câu hỏi Lịch Sử',
    icon: '📜',
    xp: 200,
    requirement: 'master_category_history',
  },
  {
    id: 'category_master_symbols',
    name_en: 'Symbol Scholar',
    name_vi: 'Học Giả Biểu Tượng',
    description_en: 'Master all Symbols & Holidays questions',
    description_vi: 'Thành thạo tất cả câu hỏi Biểu Tượng',
    icon: '🗽',
    xp: 100,
    requirement: 'master_category_symbols',
  },
  {
    id: 'all_questions',
    name_en: 'Scholar',
    name_vi: 'Học Giả',
    description_en: 'Study all 128 questions',
    description_vi: 'Học hết 128 câu hỏi',
    icon: '🎓',
    xp: 300,
    requirement: 'study_all_questions',
  },
  {
    id: 'perfect_test',
    name_en: 'Perfect Score',
    name_vi: 'Điểm Hoàn Hảo',
    description_en: 'Get 100% on a practice test',
    description_vi: 'Đạt 100% trong bài thi thử',
    icon: '💯',
    xp: 150,
    requirement: 'perfect_test_score',
  },
  {
    id: 'senior_ready',
    name_en: '65/20 Ready',
    name_vi: 'Sẵn Sàng 65/20',
    description_en: 'Master all 20 senior questions',
    description_vi: 'Thành thạo 20 câu hỏi 65/20',
    icon: '👴',
    xp: 150,
    requirement: 'master_senior_questions',
  },
  {
    id: 'speed_demon',
    name_en: 'Speed Demon',
    name_vi: 'Tốc Độ',
    description_en: 'Complete a test in under 5 minutes',
    description_vi: 'Hoàn thành bài thi trong 5 phút',
    icon: '⚡',
    xp: 75,
    requirement: 'fast_test_completion',
  },
  {
    id: 'bookworm',
    name_en: 'Bookworm',
    name_vi: 'Mọt Sách',
    description_en: 'Bookmark 20 questions',
    description_vi: 'Đánh dấu 20 câu hỏi',
    icon: '🔖',
    xp: 50,
    requirement: 'bookmark_20_questions',
  },
  {
    id: 'flashcard_pro',
    name_en: 'Flashcard Pro',
    name_vi: 'Chuyên Gia Thẻ',
    description_en: 'Review 100 flashcards',
    description_vi: 'Ôn tập 100 thẻ ghi nhớ',
    icon: '🃏',
    xp: 100,
    requirement: 'review_100_flashcards',
  },
];

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
