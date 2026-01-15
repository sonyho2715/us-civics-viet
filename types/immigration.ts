// TypeScript interfaces for immigration-guide.json

// =============================================================================
// Base Types
// =============================================================================

/** Bilingual text with Vietnamese and English versions */
export interface BilingualText {
  vi: string;
  en: string;
}

/** Icon keys used in the immigration guide */
export type ImmigrationIconKey =
  | 'heart'
  | 'home'
  | 'wallet'
  | 'users'
  | 'user'
  | 'cake'
  | 'file-check'
  | 'plane'
  | 'shield';

/** Question importance level */
export type QuestionImportance = 'high' | 'medium' | 'low';

// =============================================================================
// Interview Questions
// =============================================================================

/** A single interview question */
export interface ImmigrationQuestion {
  id: string;
  questionEn: string;
  questionVi: string;
  tips?: BilingualText;
  importance: QuestionImportance;
}

/** A subcategory of interview questions */
export interface InterviewSubcategory {
  id: string;
  nameVi: string;
  nameEn: string;
  icon: ImmigrationIconKey;
  questions: ImmigrationQuestion[];
}

/** Interview category with subcategories */
export interface InterviewCategory {
  categoryNameVi: string;
  categoryNameEn: string;
  subcategories: InterviewSubcategory[];
}

/** Extended interview category with additional metadata (I-751, N-400) */
export interface ExtendedInterviewCategory extends InterviewCategory {
  icon?: ImmigrationIconKey;
  description?: BilingualText;
}

// =============================================================================
// Sponsorship & Green Card Types
// =============================================================================

/** Green card type (conditional or permanent) */
export interface GreenCardType {
  code: string;
  nameEn: string;
  nameVi: string;
  duration: number;
  requirements: BilingualText[];
  nextSteps: string[];
}

/** Sponsorship category */
export interface SponsorshipCategory {
  code: string;
  nameEn: string;
  nameVi: string;
  sponsor: BilingualText;
  beneficiary: BilingualText;
  waitTime: string;
  unlimited?: boolean;
}

// =============================================================================
// Stokes Interview
// =============================================================================

/** Stokes interview data (fraud investigation) */
export interface StokesInterview {
  nameVi: string;
  nameEn: string;
  description: BilingualText;
  whenTriggered: BilingualText[];
  howItWorks: BilingualText[];
  typicalQuestions: BilingualText[];
  tips: BilingualText[];
}

// =============================================================================
// Fees
// =============================================================================

/** USCIS form fee entry */
export interface FormFeeEntry {
  form: string;
  nameVi: string;
  nameEn: string;
  fee: string;
  notes: BilingualText;
}

/** Form fees section */
export interface FormFees {
  nameVi: string;
  nameEn: string;
  lastUpdated: string;
  forms: FormFeeEntry[];
  additionalCosts: BilingualText[];
}

// =============================================================================
// Common Concerns
// =============================================================================

/** A single concern with advice */
export interface ConcernEntry {
  concernVi: string;
  concernEn: string;
  adviceVi: string;
  adviceEn: string;
}

/** Common concerns section */
export interface CommonConcerns {
  nameVi: string;
  nameEn: string;
  concerns: ConcernEntry[];
}

// =============================================================================
// Documents
// =============================================================================

/** Required documents section */
export interface RequiredDocuments {
  nameVi: string;
  nameEn: string;
  required: BilingualText[];
  evidence?: BilingualText[];
  financial?: BilingualText[];
}

// =============================================================================
// Tips & Red Flags
// =============================================================================

/** Red flag with explanation */
export interface RedFlag {
  vi: string;
  en: string;
  explanation: BilingualText;
}

// =============================================================================
// FAQ
// =============================================================================

/** FAQ entry */
export interface FAQEntry {
  questionVi: string;
  questionEn: string;
  answerVi: string;
  answerEn: string;
}

// =============================================================================
// Processing Times
// =============================================================================

/** Processing time entry */
export interface ProcessingTime {
  type: string;
  nameVi: string;
  nameEn: string;
  time: string;
}

// =============================================================================
// Resources
// =============================================================================

/** External resource link */
export interface Resource {
  name: string;
  url: string;
}

// =============================================================================
// Complete Immigration Data
// =============================================================================

/** Complete immigration guide data structure */
export interface ImmigrationGuideData {
  metadata: {
    version: string;
    lastUpdated: string;
    totalQuestions: number;
    categories: number;
  };
  greenCardTypes: {
    conditional: GreenCardType;
    permanent: GreenCardType;
  };
  sponsorshipCategories: {
    immediate: SponsorshipCategory[];
    preference: SponsorshipCategory[];
  };
  interviewQuestions: {
    marriageGreenCard: InterviewCategory;
    i751RemovalOfConditions: ExtendedInterviewCategory;
    consularInterview: InterviewCategory;
  };
  n400CitizenshipInterview: ExtendedInterviewCategory;
  stokesInterview: StokesInterview;
  formFees: FormFees;
  commonConcerns: CommonConcerns;
  requiredDocuments: {
    marriageInterview: RequiredDocuments;
    consularInterview: RequiredDocuments;
  };
  tips: {
    do: BilingualText[];
    dont: BilingualText[];
  };
  redFlags: RedFlag[];
  faq: FAQEntry[];
  processingTimes: ProcessingTime[];
  resources: Resource[];
}
