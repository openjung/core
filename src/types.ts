/**
 * OEJTS Core Types
 * Open Extended Jungian Type Scales
 */

// Test answer type (question ID -> score 1-5)
export interface TestAnswers {
  [questionId: number]: number;
}

// MBTI Dimension type
export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';

// Dimension scores (each dimension has 8 questions, range 8-40)
export interface DimensionScores {
  EI: number; // Extroversion-Introversion
  SN: number; // Sensing-Intuition
  TF: number; // Thinking-Feeling
  JP: number; // Judging-Perceiving
}

// Percentage breakdown for each pole
export interface DimensionPercentages {
  E: number;
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
}

// Complete test result
export interface TestResult {
  type: string; // e.g., "ENFP"
  scores: DimensionScores;
  percentages: DimensionPercentages;
}

// Single dimension test result
export interface SingleDimensionResult {
  dimension: Dimension;
  score: number; // 8-40 range
  preference: string; // E/I, S/N, T/F, or J/P letter
  leftPercent: number; // 0-100
  rightPercent: number; // 0-100
}

// Multilingual text (en is required, others optional for fallback)
export interface BilingualText {
  [locale: string]: string | undefined;
  en: string;
  zh?: string;
  ja?: string;
  ko?: string;
  'zh-tw'?: string;
}

// Question pair (bipolar scale)
export interface QuestionPair {
  id: number;
  dimension: Dimension;
  title?: BilingualText; // Optional question prompt to guide users
  leftTrait: BilingualText;
  rightTrait: BilingualText;
}

// Dimension to question IDs mapping
export type DimensionQuestions = {
  readonly [K in Dimension]: readonly number[];
};

// ============================================
// Test Quality Metrics Types
// ============================================

/** Confidence level for a dimension preference */
export type ConfidenceLevel = 'strong' | 'moderate' | 'slight' | 'balanced';

/** Confidence result for a single dimension */
export interface DimensionConfidence {
  dimension: Dimension;
  level: ConfidenceLevel;
  distance: number; // Distance from threshold (0-16 for full test)
  percentage: number; // 0-100 confidence percentage
}

/** Confidence results for all dimensions */
export interface TestConfidence {
  EI: DimensionConfidence;
  SN: DimensionConfidence;
  TF: DimensionConfidence;
  JP: DimensionConfidence;
  clarityIndex: number; // Overall profile clarity 0-100
}

/** Consistency check result for a dimension */
export interface ConsistencyResult {
  dimension: Dimension;
  isConsistent: boolean;
  variance: number; // Answer variance within dimension
  flaggedPairs: [number, number][]; // Question pairs with high divergence
}

/** Overall consistency for test */
export interface TestConsistency {
  EI: ConsistencyResult;
  SN: ConsistencyResult;
  TF: ConsistencyResult;
  JP: ConsistencyResult;
  overallConsistent: boolean;
  warnings: string[];
}
