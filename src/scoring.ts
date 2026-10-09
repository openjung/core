import {
  dimensionQuestions,
  TOTAL_QUESTIONS,
  quickTestQuestionIds,
  QUICK_TEST_TOTAL,
} from './questions.js';
import {
  DIMENSIONS,
  NEUTRAL_ANSWER,
  hasAllAnswers,
  poleForScore,
  scoresToPercentages,
  scoresToType,
  sumAnswers,
  sumDimensions,
  toRightPercentage,
  type DimensionPoles,
} from './scale.js';
import type {
  TestAnswers,
  DimensionScores,
  DimensionPercentages,
  TestResult,
  Dimension,
  SingleDimensionResult,
  ConfidenceLevel,
  DimensionConfidence,
  TestConfidence,
  ConsistencyResult,
  TestConsistency,
} from './types.js';

/**
 * Pole letters for the human OEJTS test.
 * Low scores (left traits) map to the first letter, high scores (right traits) to the second.
 *
 * - EI: E ↔ I
 * - SN: S ↔ N
 * - TF: F ↔ T (note the order: low = Feeling, high = Thinking)
 * - JP: J ↔ P
 */
const OEJTS_POLES: DimensionPoles = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['F', 'T'],
  JP: ['J', 'P'],
};

// ============================================
// Full Test (32 questions, 8 per dimension)
// ============================================

/** Number of questions per dimension */
export const DIMENSION_QUESTIONS_COUNT = 8;

/** Score range for one dimension of the full test: 8-40 */
export const DIMENSION_SCORE_MIN = 8;
export const DIMENSION_SCORE_MAX = 40;
/** Midpoint of the 8-40 range; scores above it resolve to the right pole */
export const DIMENSION_THRESHOLD = 24;

/**
 * Calculate dimension scores from test answers
 * Each dimension has 8 questions scored 1-5
 * Total range per dimension: 8-40
 * Unanswered questions count as neutral (3).
 */
export function calculateScores(answers: TestAnswers): DimensionScores {
  return sumDimensions(answers, dimensionQuestions);
}

/**
 * Determine MBTI type from dimension scores
 *
 * Scoring direction (based on OEJTS design):
 * - EI: Low (8-24) = Extroversion (E), High (25-40) = Introversion (I)
 *       Left traits are E-oriented, right traits are I-oriented
 * - SN: Low (8-24) = Sensing (S), High (25-40) = Intuition (N)
 *       Left traits are S-oriented, right traits are N-oriented
 * - TF: Low (8-24) = Feeling (F), High (25-40) = Thinking (T)
 *       Left traits are F-oriented, right traits are T-oriented
 * - JP: Low (8-24) = Judging (J), High (25-40) = Perceiving (P)
 *       Left traits are J-oriented, right traits are P-oriented
 */
export function determineType(scores: DimensionScores): string {
  return scoresToType(scores, DIMENSION_THRESHOLD, OEJTS_POLES);
}

/**
 * Calculate percentage preference for each trait pole
 * Converts raw scores (8-40) to percentages (0-100)
 */
export function calculatePercentages(scores: DimensionScores): DimensionPercentages {
  return scoresToPercentages(scores, DIMENSION_SCORE_MIN, DIMENSION_SCORE_MAX, OEJTS_POLES);
}

/**
 * Generate complete test result from answers
 */
export function generateResult(answers: TestAnswers): TestResult {
  const scores = calculateScores(answers);
  const type = determineType(scores);
  const percentages = calculatePercentages(scores);

  return { type, scores, percentages };
}

/**
 * Check whether the expected number of questions has been answered.
 *
 * This is a count check only: it does not verify which IDs are present or that
 * values fall within 1-5. Use `isDimensionTestComplete` for ID-level checks.
 */
export function isTestComplete(
  answers: TestAnswers,
  totalQuestions: number = TOTAL_QUESTIONS
): boolean {
  return Object.keys(answers).length === totalQuestions;
}

// ============================================
// Quick Test Mode (8 questions, 2 per dimension)
// ============================================

/** Score range for one dimension of the quick test: 2-10 */
const QUICK_SCORE_MIN = 2;
const QUICK_SCORE_MAX = 10;
/** Midpoint of the 2-10 range */
const QUICK_THRESHOLD = 6;

/**
 * Calculate dimension scores from quick test answers
 * Each dimension has 2 questions scored 1-5
 * Total range per dimension: 2-10
 */
export function calculateQuickScores(answers: TestAnswers): DimensionScores {
  return sumDimensions(answers, quickTestQuestionIds);
}

/**
 * Determine MBTI type from quick test dimension scores
 * Threshold adjusted for 2-10 range (midpoint = 6)
 */
export function determineQuickType(scores: DimensionScores): string {
  return scoresToType(scores, QUICK_THRESHOLD, OEJTS_POLES);
}

/**
 * Calculate percentage preference for each trait pole from quick test
 * Converts raw scores (2-10) to percentages (0-100)
 */
export function calculateQuickPercentages(scores: DimensionScores): DimensionPercentages {
  return scoresToPercentages(scores, QUICK_SCORE_MIN, QUICK_SCORE_MAX, OEJTS_POLES);
}

/**
 * Generate complete test result from quick test answers
 */
export function generateQuickResult(answers: TestAnswers): TestResult {
  const scores = calculateQuickScores(answers);
  const type = determineQuickType(scores);
  const percentages = calculateQuickPercentages(scores);

  return { type, scores, percentages };
}

/**
 * Check whether exactly 8 answers have been recorded (count check only).
 */
export function isQuickTestComplete(answers: TestAnswers): boolean {
  return Object.keys(answers).length === QUICK_TEST_TOTAL;
}

// ============================================
// Single Dimension Test (8 questions)
// ============================================

/**
 * Calculate single dimension score from test answers
 * @param answers - TestAnswers with dimension questions answered
 * @param dimension - Target dimension (EI, SN, TF, JP)
 * @returns Score in 8-40 range
 */
export function calculateDimensionScore(answers: TestAnswers, dimension: Dimension): number {
  return sumAnswers(answers, dimensionQuestions[dimension]);
}

/**
 * Determine dimension preference letter from score
 * @param score - Raw score 8-40
 * @param dimension - Target dimension
 * @returns Preference letter (E/I, S/N, F/T, J/P)
 */
export function determineDimensionPreference(score: number, dimension: Dimension): string {
  return poleForScore(score, DIMENSION_THRESHOLD, OEJTS_POLES[dimension]);
}

/**
 * Calculate percentages for both poles of a dimension
 * @param score - Raw score 8-40
 * @returns Object with left and right percentages (total = 100)
 */
export function calculateDimensionPercentages(score: number): { left: number; right: number } {
  const right = toRightPercentage(score, DIMENSION_SCORE_MIN, DIMENSION_SCORE_MAX);
  return { left: 100 - right, right };
}

/**
 * Generate complete single dimension test result
 * @param answers - TestAnswers with dimension questions answered
 * @param dimension - Target dimension
 * @returns SingleDimensionResult with score, preference, and percentages
 */
export function generateDimensionResult(
  answers: TestAnswers,
  dimension: Dimension
): SingleDimensionResult {
  const score = calculateDimensionScore(answers, dimension);
  const preference = determineDimensionPreference(score, dimension);
  const { left, right } = calculateDimensionPercentages(score);

  return {
    dimension,
    score,
    preference,
    leftPercent: left,
    rightPercent: right,
  };
}

/**
 * Validate if all dimension questions are answered
 * @param answers - TestAnswers object
 * @param dimension - Target dimension
 * @returns True if all 8 questions for the dimension are answered
 */
export function isDimensionTestComplete(answers: TestAnswers, dimension: Dimension): boolean {
  return hasAllAnswers(answers, dimensionQuestions[dimension]);
}

/**
 * Get the question IDs for a specific dimension
 * @param dimension - Target dimension
 * @returns Array of question IDs (8 questions)
 */
export function getDimensionQuestionIds(dimension: Dimension): readonly number[] {
  return dimensionQuestions[dimension];
}

// ============================================
// Test Quality Metrics
// ============================================

/**
 * Confidence level thresholds based on distance from midpoint (24)
 * - Strong: distance >= 12 (score 8-12 or 36-40)
 * - Moderate: distance >= 6 (score 13-18 or 30-35)
 * - Slight: distance >= 2 (score 19-22 or 26-29)
 * - Balanced: distance < 2 (score 23-25)
 */
const CONFIDENCE_THRESHOLDS = {
  strong: 12,
  moderate: 6,
  slight: 2,
} as const;

/** Largest possible distance from the midpoint (24 → 8 or 24 → 40). */
const MAX_DISTANCE = DIMENSION_SCORE_MAX - DIMENSION_THRESHOLD;

/**
 * Calculate confidence level from distance to threshold
 * @param distance - Absolute distance from threshold (0-16)
 * @returns ConfidenceLevel
 */
export function getConfidenceLevel(distance: number): ConfidenceLevel {
  if (distance >= CONFIDENCE_THRESHOLDS.strong) return 'strong';
  if (distance >= CONFIDENCE_THRESHOLDS.moderate) return 'moderate';
  if (distance >= CONFIDENCE_THRESHOLDS.slight) return 'slight';
  return 'balanced';
}

/**
 * Calculate confidence for a single dimension
 * @param score - Raw dimension score (8-40)
 * @param dimension - The dimension being measured
 * @returns DimensionConfidence with level, distance, and percentage
 */
export function calculateDimensionConfidence(
  score: number,
  dimension: Dimension
): DimensionConfidence {
  const distance = Math.abs(score - DIMENSION_THRESHOLD);
  const level = getConfidenceLevel(distance);
  const percentage = Math.round((distance / MAX_DISTANCE) * 100);

  return { dimension, level, distance, percentage };
}

/**
 * Calculate confidence for all dimensions and overall clarity
 * @param scores - DimensionScores from test
 * @returns TestConfidence with per-dimension confidence and clarity index
 */
export function calculateTestConfidence(scores: DimensionScores): TestConfidence {
  const EI = calculateDimensionConfidence(scores.EI, 'EI');
  const SN = calculateDimensionConfidence(scores.SN, 'SN');
  const TF = calculateDimensionConfidence(scores.TF, 'TF');
  const JP = calculateDimensionConfidence(scores.JP, 'JP');

  // Clarity index: total distance normalized to 0-100 (max = 16 × 4 = 64)
  const totalDistance = EI.distance + SN.distance + TF.distance + JP.distance;
  const clarityIndex = Math.round((totalDistance / (MAX_DISTANCE * DIMENSIONS.length)) * 100);

  return { EI, SN, TF, JP, clarityIndex };
}

/**
 * Calculate variance of answers within a dimension
 * @param answers - Test answers
 * @param dimension - Target dimension
 * @returns Variance of the 8 answers (0 = all same, higher = more varied)
 */
function calculateAnswerVariance(answers: TestAnswers, dimension: Dimension): number {
  const values = dimensionQuestions[dimension].map((qId) => answers[qId] ?? NEUTRAL_ANSWER);

  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

/** Maximum answer difference to consider consistent (on 1-5 scale) */
const CONSISTENCY_THRESHOLD = 3;

/**
 * Check consistency of answers within a dimension
 * Flags adjacent question pairs whose answers differ by 3 or more
 * @param answers - Test answers
 * @param dimension - Target dimension
 * @returns ConsistencyResult with variance and flagged pairs
 */
export function checkDimensionConsistency(
  answers: TestAnswers,
  dimension: Dimension
): ConsistencyResult {
  const questionIds = dimensionQuestions[dimension];
  const variance = calculateAnswerVariance(answers, dimension);
  const flaggedPairs: [number, number][] = [];

  for (let i = 0; i < questionIds.length - 1; i++) {
    const q1 = questionIds[i];
    const q2 = questionIds[i + 1];
    const diff = Math.abs((answers[q1] ?? NEUTRAL_ANSWER) - (answers[q2] ?? NEUTRAL_ANSWER));
    if (diff >= CONSISTENCY_THRESHOLD) {
      flaggedPairs.push([q1, q2]);
    }
  }

  return {
    dimension,
    isConsistent: flaggedPairs.length === 0,
    variance,
    flaggedPairs,
  };
}

/**
 * Check consistency across all dimensions
 * @param answers - Complete test answers
 * @returns TestConsistency with per-dimension results and overall status
 */
export function checkTestConsistency(answers: TestAnswers): TestConsistency {
  const EI = checkDimensionConsistency(answers, 'EI');
  const SN = checkDimensionConsistency(answers, 'SN');
  const TF = checkDimensionConsistency(answers, 'TF');
  const JP = checkDimensionConsistency(answers, 'JP');

  const warnings = [EI, SN, TF, JP]
    .filter((result) => !result.isConsistent)
    .map((result) => `Inconsistent answers in ${result.dimension} dimension`);

  return {
    EI,
    SN,
    TF,
    JP,
    overallConsistent: warnings.length === 0,
    warnings,
  };
}

/**
 * Get a descriptive label for confidence level
 * @param level - ConfidenceLevel
 * @param preference - The dominant preference letter (E, I, S, N, etc.)
 * @returns Human-readable description
 */
export function getConfidenceLabel(level: ConfidenceLevel, preference: string): string {
  switch (level) {
    case 'strong':
      return `Strong ${preference} preference`;
    case 'moderate':
      return `Moderate ${preference} preference`;
    case 'slight':
      return `Slight ${preference} preference`;
    case 'balanced':
      return 'Balanced on this dimension';
  }
}
