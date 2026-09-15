# @openjung/core

Core OEJTS (Open Extended Jungian Type Scales) MBTI personality test questions and scoring logic.

Based on the [Open Extended Jungian Type Scales 1.2](https://openpsychometrics.org/tests/OEJTS/) by [Open Psychometrics](https://openpsychometrics.org/).

## Installation

```bash
npm install @openjung/core
```

## Usage

```typescript
import {
  questions,
  sortedQuestions,
  generateResult,
  isTestComplete,
  type TestAnswers,
  type TestResult,
} from '@openjung/core';

// Get all questions sorted by ID
console.log(sortedQuestions.length); // 32

// Record user answers (questionId -> score 1-5)
const answers: TestAnswers = {
  1: 4,  // Question 1, leaning right
  2: 2,  // Question 2, leaning left
  // ... all 32 questions
};

// Check if test is complete
if (isTestComplete(answers)) {
  // Generate result
  const result: TestResult = generateResult(answers);

  console.log(result.type);        // e.g., "ENFP"
  console.log(result.scores);      // { EI: 28, SN: 30, TF: 18, JP: 32 }
  console.log(result.percentages); // { E: 38, I: 62, S: 31, N: 69, ... }
}
```

## API

### Data Exports

- `questions` - Array of all 32 question pairs
- `sortedQuestions` - Questions sorted by ID (for test presentation)
- `dimensionQuestions` - Question IDs grouped by dimension
- `TOTAL_QUESTIONS` - Total number of questions (32)
- `QUESTIONS_PER_DIMENSION` - Questions per dimension (8)

### Functions

- `generateResult(answers)` - Generate complete test result from answers
- `calculateScores(answers)` - Calculate raw dimension scores
- `determineType(scores)` - Determine MBTI type from scores
- `calculatePercentages(scores)` - Calculate percentage preferences
- `isTestComplete(answers)` - Check if all questions are answered

### Types

- `TestAnswers` - Map of question ID to answer (1-5)
- `TestResult` - Complete result with type, scores, and percentages
- `DimensionScores` - Raw scores for EI, SN, TF, JP dimensions
- `DimensionPercentages` - Percentage for each trait pole
- `QuestionPair` - Question with bipolar traits
- `BilingualText` - Multilingual text (`en` required, other locale keys optional)
- `Dimension` - Dimension type ('EI' | 'SN' | 'TF' | 'JP')

## Question Format

The question bank has 44 complete locales. The 39 added locales are AI-assisted drafts, not documented human-reviewed or validated language versions. See [the translation record](TRANSLATIONS.md) for sources, licensing, unchanged contracts and native-speaker review priorities.

Each question is a bipolar trait pair:

```typescript
{
  id: 1,
  dimension: 'JP',
  leftTrait: { en: 'Makes lists', zh: '制定清单' },
  rightTrait: { en: 'Relies on memory', zh: '依靠记忆' }
}
```

Users answer on a 1-5 scale:
- 1 = Strongly agree with left trait
- 3 = Neutral
- 5 = Strongly agree with right trait

## Scoring

- Each dimension has 8 questions
- Raw scores range from 8 (all 1s) to 40 (all 5s)
- Threshold of 24 determines type preference
- Percentages normalized from 0-100%

## Claude Code Skill

Install the OpenJung API skill for Claude Code to get AI-assisted integration guidance:

```bash
npx skills add https://github.com/openjung/core --skill openjung-api
```

This skill provides:
- Complete API endpoint documentation
- Scoring system explanation
- TypeScript types and integration examples

## License

Original code: MIT. OEJTS questionnaire items and adaptations, including translations and subsets: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), by Eric Jorgenson / Open Psychometrics. See [the translation record](TRANSLATIONS.md) and [original questionnaire](https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf).
