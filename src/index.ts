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
  // Test Quality Metrics types
  ConfidenceLevel,
  DimensionConfidence,
  TestConfidence,
  ConsistencyResult,
  TestConsistency,
} from './types';

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
  // Question weights
  questionWeights,
  getQuestionWeight,
  dimensionWeightSums,
} from './questions';

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
} from './scoring';

// PurrJung Cat Test - Questions data
export {
  purrjungQuestions,
  purrjungDimensionQuestions,
  sortedPurrjungQuestions,
  PURRJUNG_TOTAL_QUESTIONS,
  PURRJUNG_QUESTIONS_PER_DIMENSION,
} from './purrjungQuestions';

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
} from './purrjungScoring';
