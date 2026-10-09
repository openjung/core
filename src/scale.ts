/**
 * Shared scoring engine for every bipolar Likert scale in this package.
 *
 * The full OEJTS test, the quick test, single-dimension tests and the PurrJung
 * cat test all follow the same pattern: a set of question IDs per dimension,
 * answers from 1 (left trait) to 5 (right trait), a score range derived from
 * the question count, and a midpoint threshold that decides the pole letter.
 * Only the question IDs, the range and the pole letters differ.
 *
 * This module is internal. The public API lives in `scoring.ts` and
 * `purrjungScoring.ts`.
 */
import type {
  Dimension,
  DimensionPercentages,
  DimensionQuestions,
  DimensionScores,
  TestAnswers,
} from './types.js';

/** The four Jungian dimensions, in canonical type-string order. */
export const DIMENSIONS: readonly Dimension[] = ['EI', 'SN', 'TF', 'JP'];

/** Answer value used in place of an unanswered question. */
export const NEUTRAL_ANSWER = 3;

/** Pole letters for each dimension: `[left, right]` = `[low score, high score]`. */
export type DimensionPoles = Readonly<Record<Dimension, readonly [left: string, right: string]>>;

/** Everything the engine needs to score one kind of test. */
export interface ScaleSpec {
  /** Question IDs grouped by dimension. */
  readonly questionIds: DimensionQuestions;
  /** Lowest possible dimension score (question count × 1). */
  readonly min: number;
  /** Highest possible dimension score (question count × 5). */
  readonly max: number;
  /** Scores strictly above this value resolve to the right pole. */
  readonly threshold: number;
  /** Pole letters per dimension. */
  readonly poles: DimensionPoles;
}

/** Sum the answers for a list of question IDs, treating missing answers as neutral. */
export function sumAnswers(answers: TestAnswers, questionIds: readonly number[]): number {
  let sum = 0;
  for (const id of questionIds) {
    sum += answers[id] ?? NEUTRAL_ANSWER;
  }
  return sum;
}

/** Sum answers for every dimension. */
export function sumDimensions(
  answers: TestAnswers,
  questionIds: DimensionQuestions
): DimensionScores {
  return {
    EI: sumAnswers(answers, questionIds.EI),
    SN: sumAnswers(answers, questionIds.SN),
    TF: sumAnswers(answers, questionIds.TF),
    JP: sumAnswers(answers, questionIds.JP),
  };
}

/** Pick the pole letter for one dimension score. */
export function poleForScore(
  score: number,
  threshold: number,
  poles: readonly [left: string, right: string]
): string {
  return score > threshold ? poles[1] : poles[0];
}

/** Build the four-letter type string from dimension scores. */
export function scoresToType(
  scores: DimensionScores,
  threshold: number,
  poles: DimensionPoles
): string {
  return DIMENSIONS.map((dim) => poleForScore(scores[dim], threshold, poles[dim])).join('');
}

/**
 * Map a raw score onto 0–100, where `min` → 0 and `max` → 100.
 * The result is the share of the right pole; the left pole is `100 - result`.
 */
export function toRightPercentage(score: number, min: number, max: number): number {
  return Math.round(((score - min) / (max - min)) * 100);
}

/** Split every dimension score into a percentage for each of its two poles. */
export function scoresToPercentages(
  scores: DimensionScores,
  min: number,
  max: number,
  poles: DimensionPoles
): DimensionPercentages {
  const percentages: Record<string, number> = {};
  for (const dim of DIMENSIONS) {
    const right = toRightPercentage(scores[dim], min, max);
    const [leftPole, rightPole] = poles[dim];
    percentages[leftPole] = 100 - right;
    percentages[rightPole] = right;
  }
  return percentages as unknown as DimensionPercentages;
}

/** True when every question in the list has an answer. */
export function hasAllAnswers(answers: TestAnswers, questionIds: readonly number[]): boolean {
  return questionIds.every((id) => answers[id] !== undefined);
}
