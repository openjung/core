# @openjung/core

[![CI](https://github.com/openjung/core/actions/workflows/ci.yml/badge.svg)](https://github.com/openjung/core/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Questions: CC BY-NC-SA 4.0](https://img.shields.io/badge/questions-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE-DATA)
[![Locales](https://img.shields.io/badge/locales-44-green.svg)](TRANSLATIONS.md)

Questions, scoring and translations for the **Open Extended Jungian Type Scales** (OEJTS), the open-source personality test behind [openjung.org](https://openjung.org). Pure TypeScript, zero dependencies, ESM.

- **32-question OEJTS 1.2** with the 8-question quick mode and per-dimension mini tests
- **Scoring** that is deterministic and documented: raw scores, four-letter type, pole percentages
- **Quality metrics**: confidence per dimension, profile clarity, answer-consistency flags
- **44 locales** on every question (5 human-reviewed, 39 AI-drafted; see [TRANSLATIONS.md](TRANSLATIONS.md))
- **PurrJung**, a 16-question companion test for cats, sharing the same result shape

Based on the [OEJTS 1.2](https://openpsychometrics.org/tests/OEJTS/) by Eric Jorgenson / [Open Psychometrics](https://openpsychometrics.org/).

## Install

```bash
npm install @openjung/core
```

Requires Node 18+ or any bundler that understands ESM. The package ships `dist/` with declarations and source maps, plus `src/` for readers.

## Quick start

```ts
import { sortedQuestions, generateResult, isTestComplete, type TestAnswers } from '@openjung/core';

// Present `sortedQuestions` (32 bipolar pairs, ordered by ID) and collect 1–5 answers:
//   1 = strongly the left trait, 3 = neutral, 5 = strongly the right trait
const answers: TestAnswers = { 1: 4, 2: 2 /* …all 32 question IDs */ };

if (isTestComplete(answers)) {
  const result = generateResult(answers);
  result.type; //        "ENFP"
  result.scores; //      { EI: 18, SN: 30, TF: 20, JP: 32 }   raw, 8–40 each
  result.percentages; // { E: 69, I: 31, S: 31, N: 69, T: 38, F: 62, J: 25, P: 75 }
}
```

Every question looks like this. Locale keys beyond `en` are present on all 44 supported locales:

```ts
{
  id: 1,
  dimension: 'JP',
  title:      { en: 'How do you track tasks?', zh: '你如何记录任务？', de: 'Wie behältst du deine Aufgaben im Blick?', /* … */ },
  leftTrait:  { en: 'Makes lists',             zh: '制定清单',          de: 'Ich mache Listen',                        /* … */ },
  rightTrait: { en: 'Relies on memory',        zh: '依靠记忆',          de: 'Ich verlasse mich auf mein Gedächtnis', /* … */ },
}
```

## Scoring model

| Test             | Questions | Per dimension | Score range | Midpoint | Low score →    | High score →   |
| ---------------- | --------- | ------------- | ----------- | -------- | -------------- | -------------- |
| Full             | 32        | 8             | 8–40        | 24       | E, S, F, J     | I, N, T, P     |
| Quick            | 8         | 2             | 2–10        | 6        | E, S, F, J     | I, N, T, P     |
| Single dimension | 8         | 8             | 8–40        | 24       | E / S / F / J  | I / N / T / P  |
| PurrJung (cats)  | 16        | 4             | 4–20        | 12       | E, S, **T**, J | I, N, **F**, P |

- Scores are plain sums of the 1–5 answers. Unanswered questions count as neutral (3).
- A score **above** the midpoint resolves to the high-score pole; a score exactly on the midpoint resolves to the low-score pole.
- Percentages map the score range linearly onto 0–100 for the high-score pole; the opposite pole is the remainder. Each pair sums to 100.
- Note that TF runs **F → T** on the human tests (left traits are Feeling) and **T → F** on PurrJung.

## API

Everything is exported from the package root. Types are listed at the end.

### Question bank

| Export                     | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| `questions`                | All 32 `QuestionPair`s, grouped by dimension                         |
| `sortedQuestions`          | The same questions ordered by ID, for presentation                   |
| `dimensionQuestions`       | `{ EI, SN, TF, JP }` → question IDs                                  |
| `TOTAL_QUESTIONS`          | `32`                                                                 |
| `QUESTIONS_PER_DIMENSION`  | `8`                                                                  |
| `quickTestQuestionIds`     | `{ EI, SN, TF, JP }` → the two most discriminating IDs per dimension |
| `quickTestQuestions`       | Those 8 IDs, sorted                                                  |
| `QUICK_TEST_TOTAL`         | `8`                                                                  |
| `QUICK_TEST_PER_DIMENSION` | `2`                                                                  |

### Full test

| Function                          | Returns                                                                   |
| --------------------------------- | ------------------------------------------------------------------------- |
| `generateResult(answers)`         | `TestResult` with `type`, `scores`, `percentages`                         |
| `calculateScores(answers)`        | `DimensionScores`, 8–40 each                                              |
| `determineType(scores)`           | Four-letter type string                                                   |
| `calculatePercentages(scores)`    | `DimensionPercentages`, one entry per pole                                |
| `isTestComplete(answers, total?)` | `true` when exactly `total` (default 32) answers exist. Count check only. |

### Quick test

`generateQuickResult`, `calculateQuickScores`, `determineQuickType`, `calculateQuickPercentages` and `isQuickTestComplete` mirror the full-test functions over the 8 quick-test questions.

### Single dimension

Score one dimension on its own, for a focused mini test:

```ts
import {
  generateDimensionResult,
  isDimensionTestComplete,
  getDimensionQuestionIds,
} from '@openjung/core';

getDimensionQuestionIds('EI'); // [3, 7, 11, 15, 19, 23, 27, 31]

if (isDimensionTestComplete(answers, 'EI')) {
  generateDimensionResult(answers, 'EI');
  // { dimension: 'EI', score: 18, preference: 'E', leftPercent: 69, rightPercent: 31 }
}
```

Also exported: `calculateDimensionScore`, `determineDimensionPreference`, `calculateDimensionPercentages`, and the constants `DIMENSION_QUESTIONS_COUNT` (8), `DIMENSION_SCORE_MIN` (8), `DIMENSION_SCORE_MAX` (40), `DIMENSION_THRESHOLD` (24).

### Quality metrics

How clear and how internally consistent a result is:

```ts
import { calculateTestConfidence, checkTestConsistency, getConfidenceLabel } from '@openjung/core';

const confidence = calculateTestConfidence(result.scores);
confidence.EI; //          { dimension: 'EI', level: 'moderate', distance: 6, percentage: 38 }
confidence.clarityIndex; // 0–100, how far the whole profile sits from the midpoints

getConfidenceLabel(confidence.EI.level, 'E'); // "Moderate E preference"

const consistency = checkTestConsistency(answers);
consistency.overallConsistent; // false when adjacent answers in a dimension diverge by 3+
consistency.warnings; //        ["Inconsistent answers in SN dimension"]
```

Levels: `strong` (distance ≥ 12 from the midpoint), `moderate` (≥ 6), `slight` (≥ 2), `balanced`. Per-dimension variants: `calculateDimensionConfidence`, `checkDimensionConsistency`, `getConfidenceLevel`.

### Locales

```ts
import { SUPPORTED_LOCALES, getLocalizedText, type Locale } from '@openjung/core';

SUPPORTED_LOCALES; // ['en', 'zh', 'ja', 'ko', 'zh-tw', 'ms', 'de', 'fr', …] (44)
getLocalizedText(question.leftTrait, 'de'); // falls back to `en` for unknown locales
```

`PURRJUNG_LOCALES` lists the five locales available on the cat test. `DEFAULT_LOCALE` is `'en'`.

The 39 locales added in September 2026 are AI-assisted drafts without native-speaker review. [TRANSLATIONS.md](TRANSLATIONS.md) records their provenance and the phrases most in need of review; corrections are welcome through the _Translation correction_ issue template.

### PurrJung

A 16-question cat temperament test on the same four axes (Social/Solitary, Routine/Novelty, Independent/Bonded, Structured/Spontaneous):

```ts
import { sortedPurrjungQuestions, generatePurrjungResult } from '@openjung/core';

generatePurrjungResult(catAnswers); // { type: 'ISFP', scores: { EI: 16, … }, percentages: { … } }
```

Also exported: `purrjungQuestions`, `purrjungDimensionQuestions`, `PURRJUNG_TOTAL_QUESTIONS` (16), `PURRJUNG_QUESTIONS_PER_DIMENSION` (4), `PURRJUNG_SCORE_MIN` (4), `PURRJUNG_SCORE_MAX` (20), `PURRJUNG_THRESHOLD` (12), `calculatePurrjungScores`, `determinePurrjungType`, `calculatePurrjungPercentages`, `isPurrjungTestComplete`, `getPurrjungDimensionQuestionIds`.

### Types

`TestAnswers`, `Dimension`, `DimensionScores`, `DimensionPercentages`, `TestResult`, `SingleDimensionResult`, `QuestionPair`, `MultilingualText` (alias `BilingualText`, deprecated), `DimensionQuestions`, `Locale`, `ConfidenceLevel`, `DimensionConfidence`, `TestConfidence`, `ConsistencyResult`, `TestConsistency`.

## Claude Code skill

The repository ships a skill that teaches Claude Code the openjung.org HTTP API and this package's scoring model:

```bash
npx skills add https://github.com/openjung/core --skill openjung-api
```

## Development

```bash
npm ci
npm run check   # typecheck, format check, tests, build, package lint
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contracts that must not change silently, and for the release process.

## License

Code is [MIT](LICENSE). The OEJTS questionnaire items and all adaptations of them, including the 44 locales and the quick subset, are [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) by Eric Jorgenson / Open Psychometrics; see [LICENSE-DATA](LICENSE-DATA) and the [original questionnaire](https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf).
