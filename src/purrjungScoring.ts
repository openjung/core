import { purrjungDimensionQuestions, PURRJUNG_TOTAL_QUESTIONS } from './purrjungQuestions.js';
import { scoresToPercentages, scoresToType, sumDimensions, type DimensionPoles } from './scale.js';
import type {
  TestAnswers,
  DimensionScores,
  DimensionPercentages,
  TestResult,
  Dimension,
} from './types.js';

/**
 * PurrJung Cat Personality Test Scoring
 *
 * Each dimension has 4 questions scored 1-5
 * Total range per dimension: 4-20
 *
 * Dimension scoring direction:
 * - EI: Low (4-12) = Social (E), High (13-20) = Solitary (I)
 * - SN: Low (4-12) = Routine (S), High (13-20) = Novelty (N)
 * - TF: Low (4-12) = Independent (T), High (13-20) = Bonded (F)
 * - JP: Low (4-12) = Structured (J), High (13-20) = Spontaneous (P)
 *
 * Note that TF runs T → F here, the opposite of the human OEJTS test (F → T).
 */

// Score range constants
export const PURRJUNG_SCORE_MIN = 4; // 4 questions × 1 = 4
export const PURRJUNG_SCORE_MAX = 20; // 4 questions × 5 = 20
export const PURRJUNG_THRESHOLD = 12; // Midpoint of 4-20 range

/** Pole letters: `[low score, high score]` per dimension. */
const PURRJUNG_POLES: DimensionPoles = {
  EI: ['E', 'I'], // Social ↔ Solitary
  SN: ['S', 'N'], // Routine ↔ Novelty
  TF: ['T', 'F'], // Independent ↔ Bonded
  JP: ['J', 'P'], // Structured ↔ Spontaneous
};

/**
 * Calculate dimension scores from PurrJung test answers
 * Each dimension has 4 questions scored 1-5
 * Total range per dimension: 4-20
 * Unanswered questions count as neutral (3).
 */
export function calculatePurrjungScores(answers: TestAnswers): DimensionScores {
  return sumDimensions(answers, purrjungDimensionQuestions);
}

/**
 * Determine cat personality type from dimension scores
 *
 * - EI: Low = E (Social), High = I (Solitary)
 * - SN: Low = S (Routine), High = N (Novelty)
 * - TF: Low = T (Independent), High = F (Bonded)
 * - JP: Low = J (Structured), High = P (Spontaneous)
 *
 * Threshold: 12 (midpoint of 4-20 range)
 */
export function determinePurrjungType(scores: DimensionScores): string {
  return scoresToType(scores, PURRJUNG_THRESHOLD, PURRJUNG_POLES);
}

/**
 * Calculate percentage preference for each trait pole
 * Converts raw scores (4-20) to percentages (0-100)
 */
export function calculatePurrjungPercentages(scores: DimensionScores): DimensionPercentages {
  return scoresToPercentages(scores, PURRJUNG_SCORE_MIN, PURRJUNG_SCORE_MAX, PURRJUNG_POLES);
}

/**
 * Generate complete PurrJung test result from answers
 */
export function generatePurrjungResult(answers: TestAnswers): TestResult {
  const scores = calculatePurrjungScores(answers);
  const type = determinePurrjungType(scores);
  const percentages = calculatePurrjungPercentages(scores);

  return { type, scores, percentages };
}

/**
 * Check whether exactly 16 answers have been recorded (count check only).
 */
export function isPurrjungTestComplete(answers: TestAnswers): boolean {
  return Object.keys(answers).length === PURRJUNG_TOTAL_QUESTIONS;
}

/**
 * Get the question IDs for a specific dimension
 */
export function getPurrjungDimensionQuestionIds(dimension: Dimension): readonly number[] {
  return purrjungDimensionQuestions[dimension];
}
