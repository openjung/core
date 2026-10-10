import { describe, it, expect } from 'vitest';
import {
  calculateQuickScores,
  determineQuickType,
  calculateQuickPercentages,
  generateQuickResult,
  isQuickTestComplete,
} from './scoring.js';
import type { TestAnswers, DimensionScores } from './types.js';
import { quickTestQuestionIds, QUICK_TEST_TOTAL } from './questions.js';

describe('calculateQuickScores', () => {
  it('returns minimum scores (2) when all answers are 1', () => {
    const answers: TestAnswers = {};
    // Quick test uses questions: EI[3,15], SN[24,32], TF[22,14], JP[9,13]
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
        answers[id] = 1;
      });
    const scores = calculateQuickScores(answers);
    expect(scores.EI).toBe(2);
    expect(scores.SN).toBe(2);
    expect(scores.TF).toBe(2);
    expect(scores.JP).toBe(2);
  });

  it('returns maximum scores (10) when all answers are 5', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
        answers[id] = 5;
      });
    const scores = calculateQuickScores(answers);
    expect(scores.EI).toBe(10);
    expect(scores.SN).toBe(10);
    expect(scores.TF).toBe(10);
    expect(scores.JP).toBe(10);
  });

  it('returns neutral scores (6) when all answers are 3', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
        answers[id] = 3;
      });
    const scores = calculateQuickScores(answers);
    expect(scores.EI).toBe(6);
    expect(scores.SN).toBe(6);
    expect(scores.TF).toBe(6);
    expect(scores.JP).toBe(6);
  });

  it('defaults missing answers to neutral (3)', () => {
    const answers: TestAnswers = {};
    const scores = calculateQuickScores(answers);
    // All defaults to 3, so 2 questions * 3 = 6 per dimension
    expect(scores.EI).toBe(6);
    expect(scores.SN).toBe(6);
    expect(scores.TF).toBe(6);
    expect(scores.JP).toBe(6);
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
    expect(scores.EI).toBe(2); // 2 * 1 = 2
    expect(scores.SN).toBe(10); // 2 * 5 = 10
    expect(scores.TF).toBe(4); // 2 * 2 = 4
    expect(scores.JP).toBe(8); // 2 * 4 = 8
  });

  it('only uses quick test question IDs', () => {
    const answers: TestAnswers = {};
    // Answer all 32 questions with 5
    for (let i = 1; i <= 32; i++) {
      answers[i] = 5;
    }
    // Override quick test questions with 1
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
        answers[id] = 1;
      });

    const scores = calculateQuickScores(answers);
    // Should only use quick test questions (answered 1)
    expect(scores.EI).toBe(2);
    expect(scores.SN).toBe(2);
    expect(scores.TF).toBe(2);
    expect(scores.JP).toBe(2);
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

  it('returns ESFJ for threshold scores (6) - left preference', () => {
    const scores: DimensionScores = { EI: 6, SN: 6, TF: 6, JP: 6 };
    expect(determineQuickType(scores)).toBe('ESFJ');
  });

  it('returns INTP for scores just above threshold (7)', () => {
    const scores: DimensionScores = { EI: 7, SN: 7, TF: 7, JP: 7 };
    expect(determineQuickType(scores)).toBe('INTP');
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
  it('returns 0% right / 100% left for minimum scores (2)', () => {
    const scores: DimensionScores = { EI: 2, SN: 2, TF: 2, JP: 2 };
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

  it('returns 100% right / 0% left for maximum scores (10)', () => {
    const scores: DimensionScores = { EI: 10, SN: 10, TF: 10, JP: 10 };
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

  it('returns 50% for neutral scores (6)', () => {
    const scores: DimensionScores = { EI: 6, SN: 6, TF: 6, JP: 6 };
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
    // Score 3: (3-2)/8*100 = 12.5 -> rounds to 13%
    const scores: DimensionScores = { EI: 3, SN: 3, TF: 3, JP: 3 };
    const percentages = calculateQuickPercentages(scores);
    expect(percentages.I).toBe(13);
    expect(percentages.E).toBe(87);
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
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
        answers[id] = 3;
      });
    const result = generateQuickResult(answers);
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('scores');
    expect(result).toHaveProperty('percentages');
  });

  it('type matches scores correctly', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
        answers[id] = 5;
      });
    const result = generateQuickResult(answers);
    expect(result.type).toBe('INTP');
    expect(result.scores.EI).toBe(10);
    expect(result.scores.SN).toBe(10);
    expect(result.scores.TF).toBe(10);
    expect(result.scores.JP).toBe(10);
  });

  it('percentages match scores correctly', () => {
    const answers: TestAnswers = {};
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
        answers[id] = 1;
      });
    const result = generateQuickResult(answers);
    expect(result.percentages.E).toBe(100);
    expect(result.percentages.I).toBe(0);
  });

  it('handles real-world ENFP answers', () => {
    // ENFP: E (low EI), N (high SN), F (low TF), P (high JP)
    const answers: TestAnswers = {};
    quickTestQuestionIds.EI.forEach((id) => {
      answers[id] = 2;
    }); // Low = E
    quickTestQuestionIds.SN.forEach((id) => {
      answers[id] = 4;
    }); // High = N
    quickTestQuestionIds.TF.forEach((id) => {
      answers[id] = 2;
    }); // Low = F
    quickTestQuestionIds.JP.forEach((id) => {
      answers[id] = 4;
    }); // High = P

    const result = generateQuickResult(answers);
    expect(result.type).toBe('ENFP');
    expect(result.scores.EI).toBe(4); // E preference
    expect(result.scores.SN).toBe(8); // N preference
    expect(result.scores.TF).toBe(4); // F preference
    expect(result.scores.JP).toBe(8); // P preference
  });

  it('handles real-world ISTJ answers', () => {
    // ISTJ: I (high EI), S (low SN), T (high TF), J (low JP)
    const answers: TestAnswers = {};
    quickTestQuestionIds.EI.forEach((id) => {
      answers[id] = 4;
    }); // High = I
    quickTestQuestionIds.SN.forEach((id) => {
      answers[id] = 2;
    }); // Low = S
    quickTestQuestionIds.TF.forEach((id) => {
      answers[id] = 4;
    }); // High = T
    quickTestQuestionIds.JP.forEach((id) => {
      answers[id] = 2;
    }); // Low = J

    const result = generateQuickResult(answers);
    expect(result.type).toBe('ISTJ');
    expect(result.scores.EI).toBe(8); // I preference
    expect(result.scores.SN).toBe(4); // S preference
    expect(result.scores.TF).toBe(8); // T preference
    expect(result.scores.JP).toBe(4); // J preference
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
    Object.values(quickTestQuestionIds)
      .flat()
      .forEach((id) => {
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
