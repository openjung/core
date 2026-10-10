import { describe, it, expect } from 'vitest';
import * as api from './index.js';

/**
 * Public API contract. Every name here is re-exported by downstream apps
 * (openjung.org re-exports most of them verbatim), so removing or renaming one
 * is a breaking change. Add new names freely; remove only with a major bump.
 */
const PUBLIC_EXPORTS = [
  // Question bank
  'questions',
  'sortedQuestions',
  'dimensionQuestions',
  'TOTAL_QUESTIONS',
  'QUESTIONS_PER_DIMENSION',
  // Quick test
  'quickTestQuestionIds',
  'quickTestQuestions',
  'QUICK_TEST_TOTAL',
  'QUICK_TEST_PER_DIMENSION',
  // Full test scoring
  'calculateScores',
  'determineType',
  'calculatePercentages',
  'generateResult',
  'isTestComplete',
  // Quick test scoring
  'calculateQuickScores',
  'determineQuickType',
  'calculateQuickPercentages',
  'generateQuickResult',
  'isQuickTestComplete',
  // Single dimension
  'DIMENSION_QUESTIONS_COUNT',
  'DIMENSION_SCORE_MIN',
  'DIMENSION_SCORE_MAX',
  'DIMENSION_THRESHOLD',
  'calculateDimensionScore',
  'determineDimensionPreference',
  'calculateDimensionPercentages',
  'generateDimensionResult',
  'isDimensionTestComplete',
  'getDimensionQuestionIds',
  // Quality metrics
  'getConfidenceLevel',
  'calculateDimensionConfidence',
  'calculateTestConfidence',
  'checkDimensionConsistency',
  'checkTestConsistency',
  'getConfidenceLabel',
  // Locales
  'SUPPORTED_LOCALES',
  'PURRJUNG_LOCALES',
  'DEFAULT_LOCALE',
  'getLocalizedText',
  // PurrJung
  'purrjungQuestions',
  'purrjungDimensionQuestions',
  'sortedPurrjungQuestions',
  'PURRJUNG_TOTAL_QUESTIONS',
  'PURRJUNG_QUESTIONS_PER_DIMENSION',
  'PURRJUNG_SCORE_MIN',
  'PURRJUNG_SCORE_MAX',
  'PURRJUNG_THRESHOLD',
  'calculatePurrjungScores',
  'determinePurrjungType',
  'calculatePurrjungPercentages',
  'generatePurrjungResult',
  'isPurrjungTestComplete',
  'getPurrjungDimensionQuestionIds',
].sort();

describe('public API surface', () => {
  it('exports exactly the documented runtime names', () => {
    expect(Object.keys(api).sort()).toEqual(PUBLIC_EXPORTS);
  });

  it('exports no undefined values', () => {
    for (const name of PUBLIC_EXPORTS) {
      expect(api[name as keyof typeof api], name).toBeDefined();
    }
  });
});
