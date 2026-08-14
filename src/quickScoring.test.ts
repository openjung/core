import { describe, it, expect } from 'vitest';
import {
  calculateQuickScores,
  determineQuickType,
  calculateQuickPercentages,
  generateQuickResult,
  isQuickTestComplete,
} from './scoring';
import type { TestAnswers, DimensionScores } from './types';
import { quickTestQuestionIds, QUICK_TEST_TOTAL, getQuestionWeight } from './questions';

// Weight sums per quick-test dimension (EI: Q3+Q15, SN: Q24+Q32, TF: Q22+Q14, JP: Q9+Q13)
const QUICK_WEIGHT_SUMS = {
  EI: quickTestQuestionIds.EI.reduce((s, id) => s + getQuestionWeight(id), 0), // 2.4
  SN: quickTestQuestionIds.SN.reduce((s, id) => s + getQuestionWeight(id), 0), // 2.4
  TF: quickTestQuestionIds.TF.reduce((s, id) => s + getQuestionWeight(id), 0), // 2.3
  JP: quickTestQuestionIds.JP.reduce((s, id) => s + getQuestionWeight(id), 0), // 2.25
} as const;

describe('calculateQuickScores', () => {
  it('returns minimum scores when all answers are 1', () => {
    const answers: TestAnswers = {};
    // Quick test uses questions: EI[3,15], SN[24,32], TF[22,14], JP[9,13]
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 1;
    });
    const scores = calculateQuickScores(answers);
    expect(scores.EI).toBeCloseTo(QUICK_WEIGHT_SUMS.EI, 5); // 2.4
    expect(scores.SN).toBeCloseTo(QUICK_WEIGHT_SUMS.SN, 5); // 2.4
    expect(scores.TF).toBeCloseTo(QUICK_WEIGHT_SUMS.TF, 5); // 2.3
    expect(scores.JP).toBeCloseTo(QUICK_WEIGHT_SUMS.JP, 5); // 2.25
  });

  it('returns maximum scores when all answers are 5', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 5;
    });
    const scores = calculateQuickScores(answers);
    expect(scores.EI).toBeCloseTo(5 * QUICK_WEIGHT_SUMS.EI, 5); // 12
    expect(scores.SN).toBeCloseTo(5 * QUICK_WEIGHT_SUMS.SN, 5); // 12
    expect(scores.TF).toBeCloseTo(5 * QUICK_WEIGHT_SUMS.TF, 5); // 11.5
    expect(scores.JP).toBeCloseTo(5 * QUICK_WEIGHT_SUMS.JP, 5); // 11.25
  });

  it('returns neutral scores when all answers are 3', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 3;
    });
    const scores = calculateQuickScores(answers);
    expect(scores.EI).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.EI, 5); // 7.2
    expect(scores.SN).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.SN, 5); // 7.2
    expect(scores.TF).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.TF, 5); // 6.9
    expect(scores.JP).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.JP, 5); // 6.75
  });

  it('defaults missing answers to neutral (3)', () => {
    const answers: TestAnswers = {};
    const scores = calculateQuickScores(answers);
    // All defaults to 3, so 3 * weightSum per dimension
    expect(scores.EI).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.EI, 5);
    expect(scores.SN).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.SN, 5);
    expect(scores.TF).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.TF, 5);
    expect(scores.JP).toBeCloseTo(3 * QUICK_WEIGHT_SUMS.JP, 5);
  });

  it('correctly calculates scores for mixed answers', () => {
    const answers: TestAnswers = {};
    // Set EI questions to 1
    quickTestQuestionIds.EI.forEach((id) => {
      answers[id] = 1;
    });
    // Set SN questions to 5
    quickTestQuestionIds.SN.forEach((id) => {
      answers[id] = 5;
    });
    // Set TF questions to 2
    quickTestQuestionIds.TF.forEach((id) => {
      answers[id] = 2;
    });
    // Set JP questions to 4
    quickTestQuestionIds.JP.forEach((id) => {
      answers[id] = 4;
    });

    const scores = calculateQuickScores(answers);
    expect(scores.EI).toBeCloseTo(1 * QUICK_WEIGHT_SUMS.EI, 5); // 2.4
    expect(scores.SN).toBeCloseTo(5 * QUICK_WEIGHT_SUMS.SN, 5); // 12
    expect(scores.TF).toBeCloseTo(2 * QUICK_WEIGHT_SUMS.TF, 5); // 4.6
    expect(scores.JP).toBeCloseTo(4 * QUICK_WEIGHT_SUMS.JP, 5); // 9
  });

  it('only uses quick test question IDs', () => {
    const answers: TestAnswers = {};
    // Answer all 32 questions with 5
    for (let i = 1; i <= 32; i++) {
      answers[i] = 5;
    }
    // Override quick test questions with 1
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 1;
    });

    const scores = calculateQuickScores(answers);
    // Should only use quick test questions (answered 1)
    expect(scores.EI).toBeCloseTo(QUICK_WEIGHT_SUMS.EI, 5);
    expect(scores.SN).toBeCloseTo(QUICK_WEIGHT_SUMS.SN, 5);
    expect(scores.TF).toBeCloseTo(QUICK_WEIGHT_SUMS.TF, 5);
    expect(scores.JP).toBeCloseTo(QUICK_WEIGHT_SUMS.JP, 5);
  });
});

describe('determineQuickType', () => {
  it('returns ESFJ for all minimum scores (2)', () => {
    const scores: DimensionScores = { EI: 2, SN: 2, TF: 2, JP: 2 };
    expect(determineQuickType(scores)).toBe('ESFJ');
  });

  it('returns INTP for all maximum scores (10)', () => {
    const scores: DimensionScores = { EI: 10, SN: 10, TF: 10, JP: 10 };
    expect(determineQuickType(scores)).toBe('INTP');
  });

  it('returns ESFJ for scores just below each threshold', () => {
    // Thresholds: EI 7.2, SN 7.2, TF 6.9, JP 6.75
    const scores: DimensionScores = { EI: 7.1, SN: 7.1, TF: 6.8, JP: 6.7 };
    expect(determineQuickType(scores)).toBe('ESFJ');
  });

  it('returns INTP for scores just above each threshold', () => {
    const scores: DimensionScores = { EI: 7.3, SN: 7.3, TF: 7, JP: 6.8 };
    expect(determineQuickType(scores)).toBe('INTP');
  });

  it('breaks exact ties deterministically using the highest-weighted non-neutral answer', () => {
    // EI: Q3 (weight 1.2) answered 4, Q15 (weight 1.2) answered 2 => score = 7.2 (exact tie).
    // Tie-breaker looks at highest-weighted questions first: Q3 = 4 > 3 => right pole (I).
    const scores: DimensionScores = { EI: 7.2, SN: 2.4, TF: 2.3, JP: 2.25 };
    const answers: TestAnswers = { 3: 4, 15: 2, 24: 1, 32: 1, 22: 1, 14: 1, 9: 1, 13: 1 };
    expect(determineQuickType(scores, answers)).toBe('ISFJ');
  });

  it('exact tie with all-neutral answers falls back to left pole', () => {
    const scores: DimensionScores = { EI: 7.2, SN: 7.2, TF: 6.9, JP: 6.75 };
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 3;
    });
    expect(determineQuickType(scores, answers)).toBe('ESFJ');
  });

  // Test all 16 MBTI types with quick test score ranges
  const typeTests: Array<{ scores: DimensionScores; expected: string }> = [
    { scores: { EI: 2, SN: 2, TF: 2, JP: 2 }, expected: 'ESFJ' },
    { scores: { EI: 2, SN: 2, TF: 2, JP: 10 }, expected: 'ESFP' },
    { scores: { EI: 2, SN: 2, TF: 10, JP: 2 }, expected: 'ESTJ' },
    { scores: { EI: 2, SN: 2, TF: 10, JP: 10 }, expected: 'ESTP' },
    { scores: { EI: 2, SN: 10, TF: 2, JP: 2 }, expected: 'ENFJ' },
    { scores: { EI: 2, SN: 10, TF: 2, JP: 10 }, expected: 'ENFP' },
    { scores: { EI: 2, SN: 10, TF: 10, JP: 2 }, expected: 'ENTJ' },
    { scores: { EI: 2, SN: 10, TF: 10, JP: 10 }, expected: 'ENTP' },
    { scores: { EI: 10, SN: 2, TF: 2, JP: 2 }, expected: 'ISFJ' },
    { scores: { EI: 10, SN: 2, TF: 2, JP: 10 }, expected: 'ISFP' },
    { scores: { EI: 10, SN: 2, TF: 10, JP: 2 }, expected: 'ISTJ' },
    { scores: { EI: 10, SN: 2, TF: 10, JP: 10 }, expected: 'ISTP' },
    { scores: { EI: 10, SN: 10, TF: 2, JP: 2 }, expected: 'INFJ' },
    { scores: { EI: 10, SN: 10, TF: 2, JP: 10 }, expected: 'INFP' },
    { scores: { EI: 10, SN: 10, TF: 10, JP: 2 }, expected: 'INTJ' },
    { scores: { EI: 10, SN: 10, TF: 10, JP: 10 }, expected: 'INTP' },
  ];

  typeTests.forEach(({ scores, expected }) => {
    it(`returns ${expected} for scores EI:${scores.EI} SN:${scores.SN} TF:${scores.TF} JP:${scores.JP}`, () => {
      expect(determineQuickType(scores)).toBe(expected);
    });
  });
});

describe('calculateQuickPercentages', () => {
  // Per-dimension score ranges: EI 2.4-12, SN 2.4-12, TF 2.3-11.5, JP 2.25-11.25
  const MIN = { EI: 2.4, SN: 2.4, TF: 2.3, JP: 2.25 };
  const MAX = { EI: 12, SN: 12, TF: 11.5, JP: 11.25 };

  it('returns 0% right / 100% left for minimum scores', () => {
    const scores: DimensionScores = { ...MIN };
    const percentages = calculateQuickPercentages(scores);
    // Left traits (E, S, F, J) should be 100%
    expect(percentages.E).toBe(100);
    expect(percentages.I).toBe(0);
    expect(percentages.S).toBe(100);
    expect(percentages.N).toBe(0);
    expect(percentages.F).toBe(100);
    expect(percentages.T).toBe(0);
    expect(percentages.J).toBe(100);
    expect(percentages.P).toBe(0);
  });

  it('returns 100% right / 0% left for maximum scores', () => {
    const scores: DimensionScores = { ...MAX };
    const percentages = calculateQuickPercentages(scores);
    // Right traits (I, N, T, P) should be 100%
    expect(percentages.E).toBe(0);
    expect(percentages.I).toBe(100);
    expect(percentages.S).toBe(0);
    expect(percentages.N).toBe(100);
    expect(percentages.F).toBe(0);
    expect(percentages.T).toBe(100);
    expect(percentages.J).toBe(0);
    expect(percentages.P).toBe(100);
  });

  it('returns 50% for neutral (midpoint) scores', () => {
    const scores: DimensionScores = { EI: 7.2, SN: 7.2, TF: 6.9, JP: 6.75 };
    const percentages = calculateQuickPercentages(scores);
    expect(percentages.E).toBe(50);
    expect(percentages.I).toBe(50);
    expect(percentages.S).toBe(50);
    expect(percentages.N).toBe(50);
    expect(percentages.F).toBe(50);
    expect(percentages.T).toBe(50);
    expect(percentages.J).toBe(50);
    expect(percentages.P).toBe(50);
  });

  it('correctly rounds percentages', () => {
    // 25% right for each dimension
    const scores: DimensionScores = {
      EI: MIN.EI + 0.25 * (MAX.EI - MIN.EI), // 4.8
      SN: MIN.SN + 0.25 * (MAX.SN - MIN.SN), // 4.8
      TF: MIN.TF + 0.25 * (MAX.TF - MIN.TF), // 4.6
      JP: MIN.JP + 0.25 * (MAX.JP - MIN.JP), // 4.5
    };
    const percentages = calculateQuickPercentages(scores);
    expect(percentages.I).toBe(25);
    expect(percentages.E).toBe(75);
  });

  it('clamps out-of-range scores to 0-100%', () => {
    const low: DimensionScores = { EI: 2, SN: 2, TF: 2, JP: 2 };
    const high: DimensionScores = { EI: 15, SN: 15, TF: 15, JP: 15 };
    const lowPct = calculateQuickPercentages(low);
    const highPct = calculateQuickPercentages(high);
    expect(lowPct.I).toBe(0);
    expect(lowPct.E).toBe(100);
    expect(highPct.I).toBe(100);
    expect(highPct.E).toBe(0);
  });

  it('each pair sums to 100%', () => {
    const scores: DimensionScores = { EI: 4, SN: 7, TF: 3, JP: 9 };
    const percentages = calculateQuickPercentages(scores);
    expect(percentages.E + percentages.I).toBe(100);
    expect(percentages.S + percentages.N).toBe(100);
    expect(percentages.F + percentages.T).toBe(100);
    expect(percentages.J + percentages.P).toBe(100);
  });
});

describe('generateQuickResult', () => {
  it('generates complete result with all components', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 3;
    });
    const result = generateQuickResult(answers);
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('scores');
    expect(result).toHaveProperty('percentages');
  });

  it('type matches scores correctly', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 5;
    });
    const result = generateQuickResult(answers);
    expect(result.type).toBe('INTP');
    expect(result.scores.EI).toBeCloseTo(12, 5);
    expect(result.scores.SN).toBeCloseTo(12, 5);
    expect(result.scores.TF).toBeCloseTo(11.5, 5);
    expect(result.scores.JP).toBeCloseTo(11.25, 5);
  });

  it('percentages match scores correctly', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 1;
    });
    const result = generateQuickResult(answers);
    expect(result.percentages.E).toBe(100);
    expect(result.percentages.I).toBe(0);
  });

  it('handles real-world ENFP answers', () => {
    // ENFP: E (low EI), N (high SN), F (low TF), P (high JP)
    const answers: TestAnswers = {};
    quickTestQuestionIds.EI.forEach((id) => { answers[id] = 2; }); // Low = E
    quickTestQuestionIds.SN.forEach((id) => { answers[id] = 4; }); // High = N
    quickTestQuestionIds.TF.forEach((id) => { answers[id] = 2; }); // Low = F
    quickTestQuestionIds.JP.forEach((id) => { answers[id] = 4; }); // High = P

    const result = generateQuickResult(answers);
    expect(result.type).toBe('ENFP');
    expect(result.scores.EI).toBeCloseTo(4.8, 5);  // E preference
    expect(result.scores.SN).toBeCloseTo(9.6, 5);  // N preference
    expect(result.scores.TF).toBeCloseTo(4.6, 5);  // F preference
    expect(result.scores.JP).toBeCloseTo(9, 5);    // P preference
  });

  it('handles real-world ISTJ answers', () => {
    // ISTJ: I (high EI), S (low SN), T (high TF), J (low JP)
    const answers: TestAnswers = {};
    quickTestQuestionIds.EI.forEach((id) => { answers[id] = 4; }); // High = I
    quickTestQuestionIds.SN.forEach((id) => { answers[id] = 2; }); // Low = S
    quickTestQuestionIds.TF.forEach((id) => { answers[id] = 4; }); // High = T
    quickTestQuestionIds.JP.forEach((id) => { answers[id] = 2; }); // Low = J

    const result = generateQuickResult(answers);
    expect(result.type).toBe('ISTJ');
    expect(result.scores.EI).toBeCloseTo(9.6, 5);  // I preference
    expect(result.scores.SN).toBeCloseTo(4.8, 5);  // S preference
    expect(result.scores.TF).toBeCloseTo(9.2, 5);  // T preference
    expect(result.scores.JP).toBeCloseTo(4.5, 5);  // J preference
  });
});

describe('isQuickTestComplete', () => {
  it('returns false for empty answers', () => {
    expect(isQuickTestComplete({})).toBe(false);
  });

  it('returns false for partial answers', () => {
    const answers: TestAnswers = { 3: 3, 15: 3, 24: 3 };
    expect(isQuickTestComplete(answers)).toBe(false);
  });

  it('returns true for exactly 8 answers', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds).flat().forEach((id) => {
      answers[id] = 3;
    });
    expect(isQuickTestComplete(answers)).toBe(true);
    expect(Object.keys(answers).length).toBe(QUICK_TEST_TOTAL);
  });

  it('returns false for more than 8 answers', () => {
    const answers: TestAnswers = {};
    for (let i = 1; i <= 9; i++) {
      answers[i] = 3;
    }
    expect(isQuickTestComplete(answers)).toBe(false);
  });

  it('returns false for 7 answers', () => {
    const answers: TestAnswers = {};
    const quickIds = Object.values(quickTestQuestionIds).flat();
    quickIds.slice(0, 7).forEach((id) => {
      answers[id] = 3;
    });
    expect(isQuickTestComplete(answers)).toBe(false);
  });

  it('QUICK_TEST_TOTAL equals 8', () => {
    expect(QUICK_TEST_TOTAL).toBe(8);
  });
});
