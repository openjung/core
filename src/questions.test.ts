import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import {
  questions,
  sortedQuestions,
  dimensionQuestions,
  TOTAL_QUESTIONS,
  QUESTIONS_PER_DIMENSION,
} from './questions.js';
import { questionTranslations } from './questionTranslations.js';
import { generateResult } from './scoring.js';
import type { Dimension } from './types.js';

// Independent release contract, not derived from the data being checked.
const originalLanguages = ['en', 'zh', 'ja', 'ko', 'zh-tw'];
const addedLanguages = [
  'ms',
  'de',
  'fr',
  'es',
  'ar',
  'he',
  'ru',
  'pt-br',
  'id',
  'vi',
  'th',
  'tr',
  'it',
  'pl',
  'nl',
  'hi',
  'bn',
  'fil',
  'uk',
  'sw',
  'cs',
  'ro',
  'hu',
  'sk',
  'el',
  'sv',
  'no',
  'da',
  'fi',
  'my',
  'km',
  'lo',
  'si',
  'ta',
  'am',
  'ha',
  'yo',
  'zu',
  'ig',
];

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

  it.each([...originalLanguages, ...addedLanguages])(
    '%s has all 32 titles and both poles without fallback',
    (locale) => {
      for (const question of questions) {
        for (const field of ['title', 'leftTrait', 'rightTrait'] as const) {
          const text = question[field]!;
          expect(
            Object.prototype.hasOwnProperty.call(text, locale),
            `${question.id}.${field}.${locale}`
          ).toBe(true);
          expect(text[locale]?.trim().length).toBeGreaterThan(0);
          if (locale !== 'en') expect(text[locale]).not.toBe(text.en);
        }
        expect(question.leftTrait[locale]).not.toBe(question.rightTrait[locale]);
      }
    }
  );

  it('contains exactly the 39 added locales and explicitly keyed triples for IDs 1–32', () => {
    expect(Object.keys(questionTranslations)).toEqual(addedLanguages);
    for (const translations of Object.values(questionTranslations)) {
      expect(Object.keys(translations).map(Number)).toEqual(
        Array.from({ length: 32 }, (_, i) => i + 1)
      );
      for (const triple of Object.values(translations)) expect(triple).toHaveLength(3);
    }
  });

  it('preserves the original five-language text, array order, IDs and dimensions byte for byte', () => {
    const original = questions.map((q) => [
      q.id,
      q.dimension,
      ...originalLanguages.flatMap((locale) => [
        q.title![locale],
        q.leftTrait[locale],
        q.rightTrait[locale],
      ]),
    ]);
    // Captured before expansion from core f56d3e1, not regenerated from new translations.
    expect(createHash('sha256').update(JSON.stringify(original)).digest('hex')).toBe(
      'b9fedaa050ef561cf352fdcb17aa2fb121f209a32e132094dae98084cea53a65'
    );
  });

  it('keeps every ID on its original dimension and score 1/5 on the original left/right poles', () => {
    const assignments: [Dimension, number[], string][] = [
      ['JP', [1, 5, 9, 13, 17, 21, 25, 29], 'ESFP'],
      ['TF', [2, 6, 10, 14, 18, 22, 26, 30], 'ESTJ'],
      ['EI', [3, 7, 11, 15, 19, 23, 27, 31], 'ISFJ'],
      ['SN', [4, 8, 12, 16, 20, 24, 28, 32], 'ENFJ'],
    ];
    for (const [dimension, ids, rightType] of assignments) {
      expect(dimensionQuestions[dimension]).toEqual(ids);
      for (const id of ids) {
        expect(questions.find((q) => q.id === id)?.dimension).toBe(dimension);
        // Other answers stay neutral: changing ONE item must affect only its own dimension.
        const left = generateResult({ [id]: 1 });
        const right = generateResult({ [id]: 5 });
        expect(left.scores).toEqual({ EI: 24, SN: 24, TF: 24, JP: 24, [dimension]: 22 });
        expect(right.scores).toEqual({ EI: 24, SN: 24, TF: 24, JP: 24, [dimension]: 26 });
        expect(left.type).toBe('ESFJ');
        expect(right.type).toBe(rightType);
      }
    }
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
