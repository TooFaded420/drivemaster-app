# Question Bank Format Specification

## Overview

DriveMaster uses a standardized format for driving test question banks. This allows contributors to add questions for any state or country without touching application code.

## File Location

```
lib/data/questions/{identifier}-questions.ts
```

Where `{identifier}` is a lowercase kebab-case name:
- US states: `illinois`, `california`, `texas`, `new-york`
- Countries: `uk`, `germany`, `brazil`, `india`

## Question Schema

```typescript
interface Question {
  /** Unique ID: {state/country code}-{category abbrev}-{number} */
  id: string;

  /** The question text. Plain text, no HTML. */
  question_text: string;

  /** Answer options. Exactly 4 for multiple choice, 2 for true/false. */
  options: string[];

  /** Index of the correct answer in the options array (0-indexed). */
  correct_answer: number;

  /** Explanation shown after answering. Should reference the rule. */
  explanation: string;

  /** Standard category ID (see categories below). */
  category_id: string;

  /** Difficulty level. */
  difficulty: "easy" | "medium" | "hard";

  /** Whether the question has an associated image. */
  has_image: boolean;

  /** URL to the image (relative to /public/questions/). Optional. */
  image_url?: string;

  /** Official source reference (handbook name + year). */
  source: string;
}
```

## Standard Categories

| ID | Name | Description |
|----|------|-------------|
| `traffic-signs` | Traffic Signs | Sign shapes, colors, and meanings |
| `rules-of-the-road` | Rules of the Road | Right of way, lane usage, turns, intersections |
| `safe-driving` | Safe Driving | Following distance, speed, weather, night driving |
| `alcohol-drugs` | Alcohol & Drugs | DUI/DWI laws, BAC limits, implied consent |
| `vehicle-operation` | Vehicle Operation | Lights, signals, mirrors, parking, maintenance |
| `sharing-the-road` | Sharing the Road | Pedestrians, cyclists, school zones, emergency vehicles |

## Difficulty Guidelines

- **Easy:** Common sense or universally known rules (red light = stop)
- **Medium:** Rules that require study but are frequently tested (right of way at 4-way stop)
- **Hard:** Specific laws, numeric thresholds, or edge cases (BAC limit for commercial drivers)

## ID Format

```
{region}-{category}-{number}
```

Examples:
- `il-ts-001` — Illinois, Traffic Signs, question 1
- `ca-rr-042` — California, Rules of the Road, question 42
- `uk-sd-015` — United Kingdom, Safe Driving, question 15

Category abbreviations:
- `ts` = traffic-signs
- `rr` = rules-of-the-road
- `sd` = safe-driving
- `ad` = alcohol-drugs
- `vo` = vehicle-operation
- `sr` = sharing-the-road

## Image Questions

For questions with images (traffic signs, road scenarios):

1. Place images in `public/questions/{region}/`
2. Use descriptive filenames: `stop-sign.png`, `yield-intersection.png`
3. Images should be 400x300px minimum, PNG or WebP format
4. Set `has_image: true` and `image_url: "/questions/{region}/{filename}"`

## Validation

Before submitting, verify:
1. All questions have unique IDs
2. `correct_answer` index is within `options` array bounds
3. Category IDs match the standard list
4. No duplicate questions (same text, different ID)
5. Source references a real, current official handbook
6. Minimum 50 questions with coverage across at least 4 categories

## Example

```typescript
// lib/data/questions/california-questions.ts

export const californiaQuestions = [
  {
    id: "ca-ts-001",
    question_text: "What does a yellow diamond-shaped sign indicate?",
    options: [
      "Construction zone ahead",
      "Warning or caution",
      "School zone",
      "Hospital nearby"
    ],
    correct_answer: 1,
    explanation: "Yellow diamond-shaped signs are warning signs. They alert drivers to potential hazards or changes in road conditions ahead.",
    category_id: "traffic-signs",
    difficulty: "easy",
    has_image: false,
    source: "California Driver Handbook 2026"
  },
  // ... 99+ more questions
];
```
