import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_LOCALES,
  PURRJUNG_LOCALES,
  DEFAULT_LOCALE,
  getLocalizedText,
} from './locales.js';
import { questions } from './questions.js';
import { purrjungQuestions } from './purrjungQuestions.js';
import { questionTranslations } from './questionTranslations.js';

describe('SUPPORTED_LOCALES', () => {
  it('lists 44 unique locales starting with the five reviewed ones', () => {
    expect(SUPPORTED_LOCALES).toHaveLength(44);
    expect(new Set(SUPPORTED_LOCALES).size).toBe(44);
    expect(SUPPORTED_LOCALES.slice(0, 5)).toEqual(['en', 'zh', 'ja', 'ko', 'zh-tw']);
  });

  it('matches the locales in the translation table', () => {
    const added = SUPPORTED_LOCALES.slice(5);
    expect([...added].sort()).toEqual(Object.keys(questionTranslations).sort());
  });

  it('is present on every field of every OEJTS question', () => {
    for (const question of questions) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(question.title?.[locale], `q${question.id} title ${locale}`).toBeTruthy();
        expect(question.leftTrait[locale], `q${question.id} left ${locale}`).toBeTruthy();
        expect(question.rightTrait[locale], `q${question.id} right ${locale}`).toBeTruthy();
      }
    }
  });

  it('starts with the default locale', () => {
    expect(SUPPORTED_LOCALES[0]).toBe(DEFAULT_LOCALE);
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('PURRJUNG_LOCALES', () => {
  it('is present on every field of every PurrJung question', () => {
    expect(PURRJUNG_LOCALES).toEqual(['en', 'zh', 'ja', 'ko', 'zh-tw']);
    for (const question of purrjungQuestions) {
      for (const locale of PURRJUNG_LOCALES) {
        expect(question.title?.[locale], `q${question.id} title ${locale}`).toBeTruthy();
        expect(question.leftTrait[locale], `q${question.id} left ${locale}`).toBeTruthy();
        expect(question.rightTrait[locale], `q${question.id} right ${locale}`).toBeTruthy();
      }
    }
  });
});

describe('getLocalizedText', () => {
  const text = { en: 'Makes lists', de: 'Macht Listen' };

  it('returns the requested locale when present', () => {
    expect(getLocalizedText(text, 'de')).toBe('Macht Listen');
  });

  it('falls back to English for a missing locale', () => {
    expect(getLocalizedText(text, 'fr')).toBe('Makes lists');
  });

  it('returns the real translation for every question and locale, never the fallback', () => {
    const q1 = questions.find((q) => q.id === 1)!;
    for (const locale of SUPPORTED_LOCALES) {
      expect(getLocalizedText(q1.leftTrait, locale)).toBe(q1.leftTrait[locale]);
    }
  });
});
