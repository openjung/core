import { dimensionQuestions, TOTAL_QUESTIONS, quickTestQuestionIds, QUICK_TEST_TOTAL, getQuestionWeight } from './questions';
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
} from './types';

/** Round a weighted score to 2 decimal places (keeps URLs and display clean) */
const roundScore = (value: number): number => Math.round(value * 100) / 100;

/** Tolerance for treating a weighted score as an exact tie at the threshold */
const TIE_EPSILON = 1e-9;

/**
 * Deterministic tie-breaker for a score landing exactly on the threshold.
 * Examines the dimension's questions from highest to lowest weight and uses
 * the first non-neutral answer. Falls back to 'left' only when every answer
 * is neutral (i.e. the user genuinely provided no signal on this dimension).
 */
function breakTie(answers: TestAnswers | undefined, questionIds: readonly number[]): 'left' | 'right' {
  if (answers) {
    const byWeightDesc = [...questionIds].sort((a, b) => getQuestionWeight(b) - getQuestionWeight(a));
    for (const qId of byWeightDesc) {
      const answer = answers[qId] ?? 3;
      if (answer > 3) return 'right';
      if (answer < 3) return 'left';
    }
  }
  return 'left';
}

/**
 * Resolve a dimension letter from a weighted score.
 * Exact ties (|score - threshold| <= TIE_EPSILON) are broken deterministically
 * via breakTie instead of being silently assigned to the left pole.
 */
function resolvePreference(
  score: number,
  threshold: number,
  questionIds: readonly number[],
  answers: TestAnswers | undefined,
  left: string,
  right: string
): string {
  const diff = score - threshold;
  if (Math.abs(diff) <= TIE_EPSILON) {
    return breakTie(answers, questionIds) === 'right' ? right : left;
  }
  return diff > 0 ? right : left;
}

/**
 * Calculate dimension scores from test answers
 * Each dimension has 8 questions scored 1-5, weighted by discriminating power.
 * Weights per dimension sum to 8.0, so the total range stays 8-40.
 */
export function calculateScores(answers: TestAnswers): DimensionScores {
  const scores: DimensionScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const [dimension, questionIds] of Object.entries(dimensionQuestions)) {
    const raw = questionIds.reduce(
      (sum, qId) => sum + (answers[qId] ?? 3) * getQuestionWeight(qId), // Default to neutral (3) if missing
      0
    );
    scores[dimension as keyof DimensionScores] = roundScore(raw);
  }

  return scores;
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
 * With weighted scoring an exact tie at 24 is practically unreachable; if it
 * still happens (e.g. all-neutral answers), the tie is broken deterministically
 * using the highest-weighted non-neutral answer instead of silently defaulting
 * to the left pole. Pass `answers` to enable tie-breaking.
 */
export function determineType(scores: DimensionScores, answers?: TestAnswers): string {
  const threshold = 24; // = 3 * 8.0 (question weights per dimension sum to 8.0)

  const e_i = resolvePreference(scores.EI, threshold, dimensionQuestions.EI, answers, 'E', 'I');
  const s_n = resolvePreference(scores.SN, threshold, dimensionQuestions.SN, answers, 'S', 'N');
  const t_f = resolvePreference(scores.TF, threshold, dimensionQuestions.TF, answers, 'F', 'T');
  const j_p = resolvePreference(scores.JP, threshold, dimensionQuestions.JP, answers, 'J', 'P');

  return `${e_i}${s_n}${t_f}${j_p}`;
}

/**
 * Calculate percentage preference for each trait pole
 * Converts raw scores (8-40) to percentages (0-100)
 */
export function calculatePercentages(scores: DimensionScores): DimensionPercentages {
  const toRightPercentage = (score: number): number => {
    // Convert 8-40 range to 0-100
    // Score 8 = 0% right, Score 40 = 100% right
    const normalized = ((score - 8) / 32) * 100;
    return Math.round(normalized);
  };

  const eiRight = toRightPercentage(scores.EI); // I percentage
  const snRight = toRightPercentage(scores.SN); // N percentage
  const tfRight = toRightPercentage(scores.TF); // T percentage
  const jpRight = toRightPercentage(scores.JP); // P percentage

  return {
    E: 100 - eiRight,
    I: eiRight,
    S: 100 - snRight,
    N: snRight,
    F: 100 - tfRight,
    T: tfRight,
    J: 100 - jpRight,
    P: jpRight,
  };
}

/**
 * Generate complete test result from answers
 */
export function generateResult(answers: TestAnswers): TestResult {
  const scores = calculateScores(answers);
  const type = determineType(scores, answers);
  const percentages = calculatePercentages(scores);

  return { type, scores, percentages };
}

/**
 * Validate if all questions are answered
 */
export function isTestComplete(answers: TestAnswers, totalQuestions: number = TOTAL_QUESTIONS): boolean {
  return Object.keys(answers).length === totalQuestions;
}

// ============================================
// Quick Test Mode Functions (8 questions)
// ============================================

/**
 * Calculate dimension scores from quick test answers
 * Each dimension has 2 questions scored 1-5, weighted by discriminating power.
 * Score range per dimension: weightSum to 5 * weightSum.
 */
export function calculateQuickScores(answers: TestAnswers): DimensionScores {
  const scores: DimensionScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const [dimension, questionIds] of Object.entries(quickTestQuestionIds)) {
    const raw = questionIds.reduce(
      (sum, qId) => sum + (answers[qId] ?? 3) * getQuestionWeight(qId), // Default to neutral (3) if missing
      0
    );
    scores[dimension as keyof DimensionScores] = roundScore(raw);
  }

  return scores;
}

/** Neutral (midpoint) score of a quick-test dimension, derived from its question weights */
function getQuickThreshold(dimension: Dimension): number {
  const weightSum = quickTestQuestionIds[dimension].reduce((sum, qId) => sum + getQuestionWeight(qId), 0);
  return 3 * weightSum;
}

/**
 * Determine MBTI type from quick test dimension scores
 * Threshold per dimension = 3 * (sum of the 2 question weights).
 * Ties are broken deterministically; pass `answers` to enable tie-breaking.
 */
export function determineQuickType(scores: DimensionScores, answers?: TestAnswers): string {
  const e_i = resolvePreference(scores.EI, getQuickThreshold('EI'), quickTestQuestionIds.EI, answers, 'E', 'I');
  const s_n = resolvePreference(scores.SN, getQuickThreshold('SN'), quickTestQuestionIds.SN, answers, 'S', 'N');
  const t_f = resolvePreference(scores.TF, getQuickThreshold('TF'), quickTestQuestionIds.TF, answers, 'F', 'T');
  const j_p = resolvePreference(scores.JP, getQuickThreshold('JP'), quickTestQuestionIds.JP, answers, 'J', 'P');

  return `${e_i}${s_n}${t_f}${j_p}`;
}

/**
 * Calculate percentage preference for each trait pole from quick test
 * Maps each dimension's weighted score range to 0-100.
 */
export function calculateQuickPercentages(scores: DimensionScores): DimensionPercentages {
  const toRightPercentage = (dimension: Dimension, score: number): number => {
    const weightSum = quickTestQuestionIds[dimension].reduce((sum, qId) => sum + getQuestionWeight(qId), 0);
    const min = weightSum; // All answers = 1
    const max = 5 * weightSum; // All answers = 5
    const normalized = ((score - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, Math.round(normalized)));
  };

  const eiRight = toRightPercentage('EI', scores.EI); // I percentage
  const snRight = toRightPercentage('SN', scores.SN); // N percentage
  const tfRight = toRightPercentage('TF', scores.TF); // T percentage
  const jpRight = toRightPercentage('JP', scores.JP); // P percentage

  return {
    E: 100 - eiRight,
    I: eiRight,
    S: 100 - snRight,
    N: snRight,
    F: 100 - tfRight,
    T: tfRight,
    J: 100 - jpRight,
    P: jpRight,
  };
}

/**
 * Generate complete test result from quick test answers
 */
export function generateQuickResult(answers: TestAnswers): TestResult {
  const scores = calculateQuickScores(answers);
  const type = determineQuickType(scores, answers);
  const percentages = calculateQuickPercentages(scores);

  return { type, scores, percentages };
}

/**
 * Validate if all quick test questions are answered
 */
export function isQuickTestComplete(answers: TestAnswers): boolean {
  return Object.keys(answers).length === QUICK_TEST_TOTAL;
}

// ============================================
// Single Dimension Test Functions (8 questions)
// ============================================

/** Number of questions per dimension */
export const DIMENSION_QUESTIONS_COUNT = 8;

/** Score range for single dimension: 8-40 */
export const DIMENSION_SCORE_MIN = 8;
export const DIMENSION_SCORE_MAX = 40;
export const DIMENSION_THRESHOLD = 24; // Midpoint

/**
 * Dimension preference mapping
 * Left preference (low score) -> Right preference (high score)
 */
const dimensionPreferences: Record<Dimension, { left: string; right: string }> = {
  EI: { left: 'E', right: 'I' },
  SN: { left: 'S', right: 'N' },
  TF: { left: 'F', right: 'T' },
  JP: { left: 'J', right: 'P' },
};

/**
 * Calculate single dimension score from test answers
 * @param answers - TestAnswers with dimension questions answered
 * @param dimension - Target dimension (EI, SN, TF, JP)
 * @returns Score in 8-40 range
 */
export function calculateDimensionScore(answers: TestAnswers, dimension: Dimension): number {
  const questionIds = dimensionQuestions[dimension];
  const raw = questionIds.reduce(
    (sum, qId) => sum + (answers[qId] ?? 3) * getQuestionWeight(qId), // Default to neutral (3) if missing
    0
  );
  return roundScore(raw);
}

/**
 * Determine dimension preference letter from score
 * Ties at the threshold are broken deterministically; pass `answers` to enable.
 * @param score - Weighted score 8-40
 * @param dimension - Target dimension
 * @param answers - Optional raw answers for tie-breaking
 * @returns Preference letter (E/I, S/N, F/T, J/P)
 */
export function determineDimensionPreference(score: number, dimension: Dimension, answers?: TestAnswers): string {
  const prefs = dimensionPreferences[dimension];
  return resolvePreference(score, DIMENSION_THRESHOLD, dimensionQuestions[dimension], answers, prefs.left, prefs.right);
}

/**
 * Calculate percentages for both poles of a dimension
 * @param score - Raw score 8-40
 * @returns Object with left and right percentages (total = 100)
 */
export function calculateDimensionPercentages(score: number): { left: number; right: number } {
  // Convert 8-40 range to 0-100 (right percentage)
  const rightPercent = Math.round(((score - DIMENSION_SCORE_MIN) / (DIMENSION_SCORE_MAX - DIMENSION_SCORE_MIN)) * 100);
  return {
    left: 100 - rightPercent,
    right: rightPercent,
  };
}

/**
 * Generate complete single dimension test result
 * @param answers - TestAnswers with dimension questions answered
 * @param dimension - Target dimension
 * @returns SingleDimensionResult with score, preference, and percentages
 */
export function generateDimensionResult(answers: TestAnswers, dimension: Dimension): SingleDimensionResult {
  const score = calculateDimensionScore(answers, dimension);
  const preference = determineDimensionPreference(score, dimension, answers);
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
  const questionIds = dimensionQuestions[dimension];
  return questionIds.every(qId => answers[qId] !== undefined);
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
// Test Quality Metrics Functions
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
export function calculateDimensionConfidence(score: number, dimension: Dimension): DimensionConfidence {
  const distance = Math.abs(score - DIMENSION_THRESHOLD);
  const level = getConfidenceLevel(distance);
  // Max distance is 16 (from 24 to 8 or 24 to 40), convert to percentage
  const percentage = Math.round((distance / 16) * 100);

  return {
    dimension,
    level,
    distance,
    percentage,
  };
}

/**
 * Calculate confidence for all dimensions and overall clarity
 * @param scores - DimensionScores from test
 * @returns TestConfidence with per-dimension confidence and clarity index
 */
export function calculateTestConfidence(scores: DimensionScores): TestConfidence {
  const dimensions: Dimension[] = ['EI', 'SN', 'TF', 'JP'];
  const confidences: Record<string, DimensionConfidence> = {};

  let totalDistance = 0;
  for (const dim of dimensions) {
    const confidence = calculateDimensionConfidence(scores[dim], dim);
    confidences[dim] = confidence;
    totalDistance += confidence.distance;
  }

  // Clarity index: average distance normalized to 0-100
  // Max total distance = 16 * 4 = 64
  const clarityIndex = Math.round((totalDistance / 64) * 100);

  return {
    EI: confidences.EI,
    SN: confidences.SN,
    TF: confidences.TF,
    JP: confidences.JP,
    clarityIndex,
  };
}

/**
 * Calculate variance of answers within a dimension
 * @param answers - Test answers
 * @param dimension - Target dimension
 * @returns Variance of the 8 answers (0 = all same, higher = more varied)
 */
function calculateAnswerVariance(answers: TestAnswers, dimension: Dimension): number {
  const questionIds = dimensionQuestions[dimension];
  const values = questionIds.map(qId => answers[qId] ?? 3);

  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
}

/** Maximum answer difference to consider consistent (on 1-5 scale) */
const CONSISTENCY_THRESHOLD = 3;

/**
 * Check consistency of answers within a dimension
 * Flags question pairs where answers differ significantly
 * @param answers - Test answers
 * @param dimension - Target dimension
 * @returns ConsistencyResult with variance and flagged pairs
 */
export function checkDimensionConsistency(answers: TestAnswers, dimension: Dimension): ConsistencyResult {
  const questionIds = dimensionQuestions[dimension];
  const variance = calculateAnswerVariance(answers, dimension);
  const flaggedPairs: [number, number][] = [];

  // Compare adjacent question pairs within dimension
  for (let i = 0; i < questionIds.length - 1; i++) {
    const q1 = questionIds[i];
    const q2 = questionIds[i + 1];
    const diff = Math.abs((answers[q1] ?? 3) - (answers[q2] ?? 3));
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
  const dimensions: Dimension[] = ['EI', 'SN', 'TF', 'JP'];
  const results: Record<string, ConsistencyResult> = {};
  const warnings: string[] = [];

  let allConsistent = true;
  for (const dim of dimensions) {
    const result = checkDimensionConsistency(answers, dim);
    results[dim] = result;
    if (!result.isConsistent) {
      allConsistent = false;
      warnings.push(`Inconsistent answers in ${dim} dimension`);
    }
  }

  return {
    EI: results.EI,
    SN: results.SN,
    TF: results.TF,
    JP: results.JP,
    overallConsistent: allConsistent,
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
