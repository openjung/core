# OpenJung API Reference

## Table of Contents

1. [TypeScript Types](#typescript-types)
2. [Complete API Specifications](#complete-api-specifications)
3. [Scoring Algorithm](#scoring-algorithm)
4. [Test Modes](#test-modes)
5. [All 32 Questions](#all-32-questions)
6. [Integration Examples](#integration-examples)

---

## TypeScript Types

```typescript
// Answer format: question ID → score (1-5)
interface TestAnswers {
  [questionId: number]: number;
}

// Dimension raw scores
interface DimensionScores {
  EI: number; // 8-40
  SN: number; // 8-40
  TF: number; // 8-40
  JP: number; // 8-40
}

// Percentage breakdown
interface DimensionPercentages {
  E: number;
  I: number; // sum to 100
  S: number;
  N: number; // sum to 100
  T: number;
  F: number; // sum to 100
  J: number;
  P: number; // sum to 100
}

// Complete test result
interface TestResult {
  type: string; // "ENFP", "INTJ", etc.
  scores: DimensionScores;
  percentages: DimensionPercentages;
}

// API response with localized info
interface ApiResult extends TestResult {
  typeInfo: {
    name: string;
    nickname: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    compatibleTypes: string[];
    famousExamples: string[];
  };
  shareUrl: string;
}

// Question structure
interface Question {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  title?: string; // Optional guidance text
  leftTrait: string; // Left option (score 1)
  rightTrait: string; // Right option (score 5)
}

// Confidence metrics
type ConfidenceLevel = 'strong' | 'moderate' | 'slight' | 'balanced';

interface DimensionConfidence {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  level: ConfidenceLevel;
  distance: number; // Distance from threshold (24)
  percentage: number; // 0-100 confidence
}
```

---

## Complete API Specifications

### GET /api/questions

**Purpose**: Retrieve all 32 OEJTS test questions

**Query Parameters:**

| Parameter | Type   | Default | Description                      |
| --------- | ------ | ------- | -------------------------------- |
| locale    | string | "en"    | Language code for localized text |

**Headers:**

- `Access-Control-Allow-Origin: *` (CORS enabled)
- `Cache-Control: public, max-age=86400` (24h cache)

**Success Response (200):**

```json
{
  "totalQuestions": 32,
  "questions": [
    {
      "id": 1,
      "dimension": "JP",
      "leftTrait": "Makes lists",
      "rightTrait": "Relies on memory"
    },
    {
      "id": 2,
      "dimension": "TF",
      "leftTrait": "Skeptical",
      "rightTrait": "Wants to believe"
    }
  ]
}
```

---

### POST /api/calculate

**Purpose**: Calculate personality type from submitted answers

**Request Body:**

```typescript
{
  answers: Record<string, number>;  // Required: all 32 answers
  locale?: string;                   // Optional: default "en"
  save?: boolean;                    // Optional: persist to DB
}
```

**Validation Rules:**

- All 32 questions must be answered
- Answer values must be integers 1-5
- Answer keys must be string numbers "1" through "32"

**Success Response (200):**

```json
{
  "result": {
    "type": "ENFP",
    "scores": {
      "EI": 18,
      "SN": 28,
      "TF": 22,
      "JP": 32
    },
    "percentages": {
      "E": 75,
      "I": 25,
      "S": 12,
      "N": 88,
      "T": 31,
      "F": 69,
      "J": 0,
      "P": 100
    },
    "typeInfo": {
      "name": "Campaigner",
      "nickname": "The Enthusiast",
      "description": "ENFPs are creative, enthusiastic people...",
      "strengths": [
        "Curious and observant",
        "Energetic and enthusiastic",
        "Excellent communicators",
        "Know how to relax"
      ],
      "weaknesses": [
        "Poor practical skills",
        "Difficulty focusing",
        "Overthink things",
        "Get stressed easily"
      ],
      "compatibleTypes": ["INFJ", "INTJ", "INFP"],
      "famousExamples": ["Robin Williams", "Walt Disney"]
    },
    "shareUrl": "https://openjung.org/type/enfp?ei=18&sn=28&tf=22&jp=32"
  },
  "recordId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response (400):**

```json
{
  "error": "INCOMPLETE_ANSWERS",
  "message": "All 32 questions must be answered",
  "missing": [15, 23, 31]
}
```

---

### POST /api/record

**Purpose**: Record a completed test result (analytics, non-blocking)

**Request Body:**

```typescript
{
  answers: Record<string, number>;
  result: {
    type: string;
    scores: DimensionScores;
    percentages: DimensionPercentages;
  };
  locale?: string;
}
```

**Success Response (201):**

```json
{
  "success": true,
  "recordId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### GET /api/stats

**Purpose**: Retrieve aggregate test statistics

**Headers:**

- `Cache-Control: public, max-age=300` (5min cache)

**Success Response (200):**

```json
{
  "totalTests": 15234,
  "typeDistribution": [
    { "type": "INFP", "count": 2341 },
    { "type": "ENFP", "count": 1893 },
    { "type": "INTJ", "count": 1654 }
  ],
  "localeDistribution": [
    { "locale": "en", "count": 8234 },
    { "locale": "zh", "count": 4123 }
  ],
  "recentTrend": [{ "date": "2026-01-01", "count": 234 }],
  "lastUpdated": "2026-01-28T12:34:56Z"
}
```

---

## Scoring Algorithm

### Step 1: Sum Dimension Scores

```typescript
// Each dimension has 8 questions
const dimensionQuestions = {
  EI: [3, 7, 11, 15, 19, 23, 27, 31],
  SN: [4, 8, 12, 16, 20, 24, 28, 32],
  TF: [2, 6, 10, 14, 18, 22, 26, 30],
  JP: [1, 5, 9, 13, 17, 21, 25, 29],
};

function calculateScores(answers: TestAnswers): DimensionScores {
  const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const [dim, qIds] of Object.entries(dimensionQuestions)) {
    scores[dim] = qIds.reduce((sum, id) => sum + answers[id], 0);
  }
  return scores;
}
```

### Step 2: Determine Type Letters

```typescript
const THRESHOLD = 24;

function determineType(scores: DimensionScores): string {
  return [
    scores.EI <= THRESHOLD ? 'E' : 'I',
    scores.SN <= THRESHOLD ? 'S' : 'N',
    scores.TF <= THRESHOLD ? 'F' : 'T', // Note: TF inverted
    scores.JP <= THRESHOLD ? 'J' : 'P',
  ].join('');
}
```

### Step 3: Calculate Percentages

```typescript
function calculatePercentages(scores: DimensionScores): DimensionPercentages {
  const toPercent = (score: number) => ((score - 8) / 32) * 100;

  return {
    I: toPercent(scores.EI),
    E: 100 - toPercent(scores.EI),
    N: toPercent(scores.SN),
    S: 100 - toPercent(scores.SN),
    T: toPercent(scores.TF),
    F: 100 - toPercent(scores.TF),
    P: toPercent(scores.JP),
    J: 100 - toPercent(scores.JP),
  };
}
```

---

## Test Modes

### Full Test (32 Questions)

- Default mode
- All 32 OEJTS questions
- Most accurate results
- Score range: 8-40 per dimension

### Quick Test (8 Questions)

- 2 questions per dimension
- Selected questions: [3, 15, 24, 32, 22, 14, 9, 13]
- Score range: 2-10 per dimension
- Threshold: 6

### Dimension Test (8 Questions)

- Single dimension focus
- 8 questions for selected dimension only
- Returns single dimension result

---

## All 32 Questions

| ID  | Dim | Left Trait                    | Right Trait                      |
| --- | --- | ----------------------------- | -------------------------------- |
| 1   | JP  | Makes lists                   | Relies on memory                 |
| 2   | TF  | Skeptical                     | Wants to believe                 |
| 3   | EI  | Bored by time alone           | Needs time alone                 |
| 4   | SN  | Accepts things as they are    | Unsatisfied with the status quo  |
| 5   | JP  | Keeps a clean room            | Tolerates a messy room           |
| 6   | TF  | Thinks "robotic" is an insult | Thinks "robotic" is a compliment |
| 7   | EI  | Energized by interaction      | Drained by interaction           |
| 8   | SN  | Prefers routine tasks         | Prefers new challenges           |
| 9   | JP  | Plans social events ahead     | Goes with the flow               |
| 10  | TF  | Sentimental                   | Unsentimental                    |
| 11  | EI  | Comfortable in groups         | Uncomfortable in groups          |
| 12  | SN  | Focuses on details            | Focuses on big picture           |
| 13  | JP  | Prepares for meetings         | Wings it                         |
| 14  | TF  | Tenderhearted                 | Tough-minded                     |
| 15  | EI  | Initiates conversations       | Waits to be approached           |
| 16  | SN  | Works with facts              | Works with ideas                 |
| 17  | JP  | Finishes tasks early          | Finishes at deadline             |
| 18  | TF  | Values harmony                | Values truth                     |
| 19  | EI  | Thinks out loud               | Thinks inside head               |
| 20  | SN  | Trusts experience             | Trusts intuition                 |
| 21  | JP  | Follows schedules             | Follows impulses                 |
| 22  | TF  | Empathetic                    | Analytical                       |
| 23  | EI  | Joins group activities        | Prefers one-on-one               |
| 24  | SN  | Practical                     | Theoretical                      |
| 25  | JP  | Organized workspace           | Creative chaos                   |
| 26  | TF  | Decides with heart            | Decides with head                |
| 27  | EI  | Outgoing                      | Reserved                         |
| 28  | SN  | Concrete                      | Abstract                         |
| 29  | JP  | Punctual                      | Flexible with time               |
| 30  | TF  | Personal approach             | Impersonal approach              |
| 31  | EI  | Party animal                  | Homebody                         |
| 32  | SN  | Realistic                     | Imaginative                      |

---

## Integration Examples

### React Component

```tsx
import { useState, useEffect } from 'react';

function PersonalityTest() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('https://openjung.org/api/questions')
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions));
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submit = async () => {
    const response = await fetch('https://openjung.org/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    });
    const data = await response.json();
    setResult(data.result);
  };

  if (result) {
    return <div>Your type: {result.type}</div>;
  }

  return (
    <div>
      {questions.map((q) => (
        <div key={q.id}>
          <p>
            {q.leftTrait} ← → {q.rightTrait}
          </p>
          {[1, 2, 3, 4, 5].map((v) => (
            <button
              key={v}
              onClick={() => handleAnswer(q.id, v)}
              className={answers[q.id] === v ? 'selected' : ''}
            >
              {v}
            </button>
          ))}
        </div>
      ))}
      <button onClick={submit} disabled={Object.keys(answers).length < 32}>
        Submit
      </button>
    </div>
  );
}
```

### Python Integration

```python
import requests

BASE_URL = "https://openjung.org"

# Fetch questions
questions = requests.get(f"{BASE_URL}/api/questions").json()["questions"]

# Simulate answers (in real app, collect from user)
answers = {str(i): 3 for i in range(1, 33)}  # All neutral

# Calculate result
result = requests.post(
    f"{BASE_URL}/api/calculate",
    json={"answers": answers, "locale": "en"}
).json()

print(f"Type: {result['result']['type']}")
print(f"Scores: {result['result']['scores']}")
```

### cURL Examples

```bash
# Fetch questions
curl "https://openjung.org/api/questions?locale=en"

# Calculate result
curl -X POST "https://openjung.org/api/calculate" \
  -H "Content-Type: application/json" \
  -d '{"answers":{"1":3,"2":4,"3":2,...,"32":5}}'

# Get statistics
curl "https://openjung.org/api/stats"
```

---

## Supported Locales

| Code  | Language            | Code | Language   |
| ----- | ------------------- | ---- | ---------- |
| en    | English             | ko   | Korean     |
| zh    | Simplified Chinese  | es   | Spanish    |
| zh-tw | Traditional Chinese | fr   | French     |
| ja    | Japanese            | de   | German     |
| pt    | Portuguese          | ru   | Russian    |
| hi    | Hindi               | bn   | Bengali    |
| fil   | Filipino            | uk   | Ukrainian  |
| sw    | Swahili             | cs   | Czech      |
| ro    | Romanian            | hu   | Hungarian  |
| sk    | Slovak              | el   | Greek      |
| sv    | Swedish             | no   | Norwegian  |
| da    | Danish              | fi   | Finnish    |
| ms    | Malay               | km   | Khmer      |
| lo    | Lao                 | si   | Sinhala    |
| ta    | Tamil               | am   | Amharic    |
| ha    | Hausa               | yo   | Yoruba     |
| zu    | Zulu                | ig   | Igbo       |
| ar    | Arabic              | he   | Hebrew     |
| th    | Thai                | vi   | Vietnamese |
| id    | Indonesian          | tr   | Turkish    |
| pl    | Polish              | nl   | Dutch      |
| it    | Italian             | ...  | 44+ total  |
