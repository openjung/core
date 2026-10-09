// Types
export type {
  TestAnswers,
  Dimension,
  DimensionScores,
  DimensionPercentages,
  TestResult,
  SingleDimensionResult,
  BilingualText,
  QuestionPair,
  DimensionQuestions,
  MultilingualText,
  // Test Quality Metrics types
  ConfidenceLevel,
  DimensionConfidence,
  TestConfidence,
  ConsistencyResult,
  TestConsistency,
} from './types.js';

// Questions data
export {
  questions,
  dimensionQuestions,
  sortedQuestions,
  TOTAL_QUESTIONS,
  QUESTIONS_PER_DIMENSION,
  // Quick test
  quickTestQuestionIds,
  quickTestQuestions,
  QUICK_TEST_TOTAL,
  QUICK_TEST_PER_DIMENSION,
} from './questions.js';

// Scoring functions
export {
  calculateScores,
  determineType,
  calculatePercentages,
  generateResult,
  isTestComplete,
  // Quick test scoring
  calculateQuickScores,
  determineQuickType,
  calculateQuickPercentages,
  generateQuickResult,
  isQuickTestComplete,
  // Single dimension scoring
  DIMENSION_QUESTIONS_COUNT,
  DIMENSION_SCORE_MIN,
  DIMENSION_SCORE_MAX,
  DIMENSION_THRESHOLD,
  calculateDimensionScore,
  determineDimensionPreference,
  calculateDimensionPercentages,
  generateDimensionResult,
  isDimensionTestComplete,
  getDimensionQuestionIds,
  // Test Quality Metrics
  getConfidenceLevel,
  calculateDimensionConfidence,
  calculateTestConfidence,
  checkDimensionConsistency,
  checkTestConsistency,
  getConfidenceLabel,
} from './scoring.js';

// Locales
export type { Locale } from './locales.js';
export {
  SUPPORTED_LOCALES,
  PURRJUNG_LOCALES,
  DEFAULT_LOCALE,
  getLocalizedText,
} from './locales.js';

// PurrJung Cat Test - Questions data
export {
  purrjungQuestions,
  purrjungDimensionQuestions,
  sortedPurrjungQuestions,
  PURRJUNG_TOTAL_QUESTIONS,
  PURRJUNG_QUESTIONS_PER_DIMENSION,
} from './purrjungQuestions.js';

// PurrJung Cat Test - Scoring functions
export {
  PURRJUNG_SCORE_MIN,
  PURRJUNG_SCORE_MAX,
  PURRJUNG_THRESHOLD,
  calculatePurrjungScores,
  determinePurrjungType,
  calculatePurrjungPercentages,
  generatePurrjungResult,
  isPurrjungTestComplete,
  getPurrjungDimensionQuestionIds,
} from './purrjungScoring.js';
