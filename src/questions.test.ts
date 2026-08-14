import { describe, it, expect } from 'vitest';
import {
  questions,
  sortedQuestions,
  dimensionQuestions,
  dimensionWeightSums,
  getQuestionWeight,
  TOTAL_QUESTIONS,
  QUESTIONS_PER_DIMENSION,
} from './questions';
import type { Dimension } from './types';

describe('questions data integrity', () => {
  it('has exactly 32 questions', () => {
    expect(questions.length).toBe(32);
    expect(TOTAL_QUESTIONS).toBe(32);
  });

  it('all question IDs are unique', () => {
    const ids = questions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(32);
  });

  it('all question IDs are in range 1-32', () => {
    questions.forEach((q) => {
      expect(q.id).toBeGreaterThanOrEqual(1);
      expect(q.id).toBeLessThanOrEqual(32);
    });
  });

  it('each question has required English text', () => {
    questions.forEach((q) => {
      expect(q.leftTrait.en).toBeDefined();
      expect(q.leftTrait.en.length).toBeGreaterThan(0);
      expect(q.rightTrait.en).toBeDefined();
      expect(q.rightTrait.en.length).toBeGreaterThan(0);
    });
  });

  it('each question has all 5 language translations', () => {
    const languages = ['en', 'zh', 'ja', 'ko', 'zh-tw'] as const;
    questions.forEach((q) => {
      languages.forEach((lang) => {
        expect(q.leftTrait[lang]).toBeDefined();
        expect(q.leftTrait[lang]!.length).toBeGreaterThan(0);
        expect(q.rightTrait[lang]).toBeDefined();
        expect(q.rightTrait[lang]!.length).toBeGreaterThan(0);
      });
    });
  });

  it('each question has a valid dimension', () => {
    const validDimensions: Dimension[] = ['EI', 'SN', 'TF', 'JP'];
    questions.forEach((q) => {
      expect(validDimensions).toContain(q.dimension);
    });
  });
});

describe('dimensionQuestions mapping', () => {
  it('has exactly 4 dimensions', () => {
    expect(Object.keys(dimensionQuestions).length).toBe(4);
  });

  it('each dimension has exactly 8 questions', () => {
    expect(QUESTIONS_PER_DIMENSION).toBe(8);
    expect(dimensionQuestions.EI.length).toBe(8);
    expect(dimensionQuestions.SN.length).toBe(8);
    expect(dimensionQuestions.TF.length).toBe(8);
    expect(dimensionQuestions.JP.length).toBe(8);
  });

  it('all question IDs in dimensionQuestions are valid', () => {
    const allIds = [
      ...dimensionQuestions.EI,
      ...dimensionQuestions.SN,
      ...dimensionQuestions.TF,
      ...dimensionQuestions.JP,
    ];
    allIds.forEach((id) => {
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(32);
    });
  });

  it('dimensionQuestions covers all 32 questions without duplicates', () => {
    const allIds = [
      ...dimensionQuestions.EI,
      ...dimensionQuestions.SN,
      ...dimensionQuestions.TF,
      ...dimensionQuestions.JP,
    ];
    expect(allIds.length).toBe(32);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(32);
  });

  it('question dimension matches dimensionQuestions mapping', () => {
    questions.forEach((q) => {
      const dimension = q.dimension;
      expect(dimensionQuestions[dimension]).toContain(q.id);
    });
  });

  it('EI dimension questions are correctly assigned', () => {
    const eiQuestions = questions.filter((q) => q.dimension === 'EI');
    expect(eiQuestions.length).toBe(8);
    eiQuestions.forEach((q) => {
      expect(dimensionQuestions.EI).toContain(q.id);
    });
  });

  it('SN dimension questions are correctly assigned', () => {
    const snQuestions = questions.filter((q) => q.dimension === 'SN');
    expect(snQuestions.length).toBe(8);
    snQuestions.forEach((q) => {
      expect(dimensionQuestions.SN).toContain(q.id);
    });
  });

  it('TF dimension questions are correctly assigned', () => {
    const tfQuestions = questions.filter((q) => q.dimension === 'TF');
    expect(tfQuestions.length).toBe(8);
    tfQuestions.forEach((q) => {
      expect(dimensionQuestions.TF).toContain(q.id);
    });
  });

  it('JP dimension questions are correctly assigned', () => {
    const jpQuestions = questions.filter((q) => q.dimension === 'JP');
    expect(jpQuestions.length).toBe(8);
    jpQuestions.forEach((q) => {
      expect(dimensionQuestions.JP).toContain(q.id);
    });
  });
});

describe('sortedQuestions', () => {
  it('has the same number of questions as the original', () => {
    expect(sortedQuestions.length).toBe(questions.length);
  });

  it('is sorted by ID in ascending order', () => {
    for (let i = 0; i < sortedQuestions.length - 1; i++) {
      expect(sortedQuestions[i].id).toBeLessThan(sortedQuestions[i + 1].id);
    }
  });

  it('first question has ID 1', () => {
    expect(sortedQuestions[0].id).toBe(1);
  });

  it('last question has ID 32', () => {
    expect(sortedQuestions[sortedQuestions.length - 1].id).toBe(32);
  });

  it('contains all the same questions as the original array', () => {
    const originalIds = new Set(questions.map((q) => q.id));
    const sortedIds = new Set(sortedQuestions.map((q) => q.id));
    expect(originalIds).toEqual(sortedIds);
  });
});

describe('constants', () => {
  it('TOTAL_QUESTIONS equals actual question count', () => {
    expect(TOTAL_QUESTIONS).toBe(questions.length);
  });

  it('QUESTIONS_PER_DIMENSION is correctly calculated', () => {
    expect(QUESTIONS_PER_DIMENSION).toBe(TOTAL_QUESTIONS / 4);
  });

  it('4 dimensions * 8 questions = 32 total', () => {
    expect(4 * QUESTIONS_PER_DIMENSION).toBe(TOTAL_QUESTIONS);
  });
});

describe('question weights', () => {
  it('every OEJTS question has an explicit weight', () => {
    for (const q of questions) {
      expect(q.weight).toBeDefined();
      expect(q.weight).toBeGreaterThan(0);
    }
  });

  it('weights within each dimension sum to 8.0 (score range stays 8-40)', () => {
    for (const dimension of ['EI', 'SN', 'TF', 'JP'] as Dimension[]) {
      expect(dimensionWeightSums[dimension]).toBeCloseTo(8.0, 10);
    }
  });

  it('dimensionWeightSums matches a direct lookup of the question weights', () => {
    for (const dimension of ['EI', 'SN', 'TF', 'JP'] as Dimension[]) {
      const sum = dimensionQuestions[dimension].reduce((s, id) => s + getQuestionWeight(id), 0);
      expect(sum).toBeCloseTo(dimensionWeightSums[dimension], 10);
    }
  });
});
