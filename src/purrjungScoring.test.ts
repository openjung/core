import { describe, it, expect } from 'vitest';
import {
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
import {
  purrjungQuestions,
  purrjungDimensionQuestions,
  sortedPurrjungQuestions,
  PURRJUNG_TOTAL_QUESTIONS,
  PURRJUNG_QUESTIONS_PER_DIMENSION,
} from './purrjungQuestions.js';
import type { Dimension, TestAnswers } from './types.js';

const DIMENSIONS: Dimension[] = ['EI', 'SN', 'TF', 'JP'];

function allAnswers(value: number): TestAnswers {
  const answers: TestAnswers = {};
  for (let i = 1; i <= PURRJUNG_TOTAL_QUESTIONS; i++) answers[i] = value;
  return answers;
}

describe('PurrJung question bank', () => {
  it('has 16 questions, 4 per dimension, with unique sequential IDs', () => {
    expect(purrjungQuestions).toHaveLength(PURRJUNG_TOTAL_QUESTIONS);
    expect(PURRJUNG_TOTAL_QUESTIONS).toBe(16);
    expect(PURRJUNG_QUESTIONS_PER_DIMENSION).toBe(4);
    expect(sortedPurrjungQuestions.map((q) => q.id)).toEqual(
      Array.from({ length: 16 }, (_, i) => i + 1)
    );
    for (const dim of DIMENSIONS) {
      expect(purrjungDimensionQuestions[dim]).toHaveLength(4);
      expect(getPurrjungDimensionQuestionIds(dim)).toBe(purrjungDimensionQuestions[dim]);
    }
  });

  it('assigns every question to the dimension that lists its ID', () => {
    for (const question of purrjungQuestions) {
      expect(purrjungDimensionQuestions[question.dimension]).toContain(question.id);
    }
  });
});

describe('calculatePurrjungScores', () => {
  it('returns 4 per dimension when every answer is 1', () => {
    expect(calculatePurrjungScores(allAnswers(1))).toEqual({ EI: 4, SN: 4, TF: 4, JP: 4 });
  });

  it('returns 20 per dimension when every answer is 5', () => {
    expect(calculatePurrjungScores(allAnswers(5))).toEqual({ EI: 20, SN: 20, TF: 20, JP: 20 });
  });

  it('treats missing answers as neutral (3)', () => {
    expect(calculatePurrjungScores({})).toEqual({ EI: 12, SN: 12, TF: 12, JP: 12 });
  });

  it('matches the exported range constants', () => {
    expect(PURRJUNG_SCORE_MIN).toBe(4);
    expect(PURRJUNG_SCORE_MAX).toBe(20);
    expect(PURRJUNG_THRESHOLD).toBe(12);
  });
});

describe('determinePurrjungType', () => {
  it('resolves low scores to E, S, T, J (TF direction is inverted versus the human test)', () => {
    expect(determinePurrjungType({ EI: 4, SN: 4, TF: 4, JP: 4 })).toBe('ESTJ');
  });

  it('resolves high scores to I, N, F, P', () => {
    expect(determinePurrjungType({ EI: 20, SN: 20, TF: 20, JP: 20 })).toBe('INFP');
  });

  it('resolves the exact midpoint to the left pole', () => {
    expect(determinePurrjungType({ EI: 12, SN: 12, TF: 12, JP: 12 })).toBe('ESTJ');
    expect(determinePurrjungType({ EI: 13, SN: 13, TF: 13, JP: 13 })).toBe('INFP');
  });
});

describe('calculatePurrjungPercentages', () => {
  it('maps the minimum score to 100% left', () => {
    const p = calculatePurrjungPercentages({ EI: 4, SN: 4, TF: 4, JP: 4 });
    expect(p).toEqual({ E: 100, I: 0, S: 100, N: 0, T: 100, F: 0, J: 100, P: 0 });
  });

  it('maps the maximum score to 100% right', () => {
    const p = calculatePurrjungPercentages({ EI: 20, SN: 20, TF: 20, JP: 20 });
    expect(p).toEqual({ E: 0, I: 100, S: 0, N: 100, T: 0, F: 100, J: 0, P: 100 });
  });

  it('maps the midpoint to 50/50 and always sums each pair to 100', () => {
    const p = calculatePurrjungPercentages({ EI: 12, SN: 12, TF: 12, JP: 12 });
    expect(p.E).toBe(50);
    expect(p.T).toBe(50);
    for (let score = 4; score <= 20; score++) {
      const q = calculatePurrjungPercentages({ EI: score, SN: score, TF: score, JP: score });
      expect(q.E + q.I).toBe(100);
      expect(q.S + q.N).toBe(100);
      expect(q.T + q.F).toBe(100);
      expect(q.J + q.P).toBe(100);
    }
  });
});

describe('generatePurrjungResult', () => {
  it('combines scores, type and percentages', () => {
    const answers: TestAnswers = { ...allAnswers(3), 1: 1, 2: 1, 3: 1, 4: 1, 13: 5, 14: 5 };
    const result = generatePurrjungResult(answers);
    expect(result.scores).toEqual({ EI: 4, SN: 12, TF: 12, JP: 16 });
    expect(result.type).toBe('ESTP');
    expect(result.percentages.E).toBe(100);
    expect(result.percentages.P).toBe(75);
  });
});

describe('isPurrjungTestComplete', () => {
  it('is true for exactly 16 answers and false otherwise', () => {
    expect(isPurrjungTestComplete({})).toBe(false);
    expect(isPurrjungTestComplete(allAnswers(3))).toBe(true);
    const fifteen = allAnswers(3);
    delete fifteen[16];
    expect(isPurrjungTestComplete(fifteen)).toBe(false);
  });
});
