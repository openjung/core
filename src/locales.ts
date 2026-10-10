import type { MultilingualText } from './types.js';

/**
 * Locales shipped with the OEJTS question bank (`questions`), in the order they were added.
 *
 * The first five have shipped since 1.0. The remaining 39 are AI-assisted drafts awaiting
 * native-speaker review; see TRANSLATIONS.md for provenance and caveats.
 */
export const SUPPORTED_LOCALES = [
  'en',
  'zh',
  'ja',
  'ko',
  'zh-tw',
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
] as const;

/** A locale code present in every OEJTS question. */
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Locales shipped with the PurrJung cat test (`purrjungQuestions`). */
export const PURRJUNG_LOCALES = ['en', 'zh', 'ja', 'ko', 'zh-tw'] as const;

/** The locale every text object is guaranteed to contain. */
export const DEFAULT_LOCALE = 'en' as const;

/**
 * Read a localized string, falling back to English when the locale is missing.
 *
 * @param text - A multilingual text object such as a question's `title` or `leftTrait`
 * @param locale - The locale to read, e.g. `'de'` or `'zh-tw'`
 */
export function getLocalizedText(text: MultilingualText, locale: string): string {
  return text[locale] ?? text[DEFAULT_LOCALE];
}
