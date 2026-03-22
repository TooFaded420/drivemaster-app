# Contributing to DriveMaster

Thanks for wanting to help drivers pass their tests! Here's how to contribute.

## The Easiest Way to Contribute: Add Questions

The highest-impact contribution is adding question banks for new states or countries. No coding required — just knowledge of your local driving rules.

### Adding a Question Bank

1. **Fork the repo** and create a branch: `git checkout -b questions/california`

2. **Create your question file** at `lib/data/questions/{state-or-country}-questions.ts`

3. **Follow the question format:**

```typescript
export const questions = [
  {
    id: "ca-ts-001",           // {state}-{category}-{number}
    question_text: "What does a red octagonal sign mean?",
    options: ["Yield", "Stop", "Slow down", "No entry"],
    correct_answer: 1,         // 0-indexed
    explanation: "A red octagon is always a stop sign. Come to a complete stop.",
    category_id: "traffic-signs",
    difficulty: "easy",        // easy | medium | hard
    has_image: false,
    source: "California Driver Handbook 2026"
  },
  // ... more questions
];
```

4. **Categories:** Use these standard category IDs:
   - `traffic-signs` — Sign recognition and meaning
   - `rules-of-the-road` — Right of way, lanes, turns
   - `safe-driving` — Following distance, speed, weather
   - `alcohol-drugs` — DUI laws, BAC limits, penalties
   - `vehicle-operation` — Lights, signals, mirrors, parking
   - `sharing-the-road` — Pedestrians, cyclists, school zones

5. **Quality checklist:**
   - [ ] Questions sourced from official state/country handbook
   - [ ] Each question has 4 options (or 2 for true/false)
   - [ ] Explanations are clear and reference the rule
   - [ ] Difficulty is appropriate (easy = common sense, hard = specific laws)
   - [ ] No copyrighted content — paraphrase in your own words
   - [ ] Source field references the official handbook and year

6. **Submit a PR** with the title: `questions: add {State/Country} question bank ({N} questions)`

### Minimum Question Count
- **Recommended:** 100+ questions per state/country
- **Minimum for acceptance:** 50 questions with good category coverage

## Code Contributions

### Setup

```bash
git clone https://github.com/TooFaded420/drivemaster-app.git
cd drivemaster-app
npm install
cp .env.example .env.local
# Fill in your Supabase credentials
npm run dev
```

### Architecture

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, PostgreSQL, Realtime)
- **State:** Zustand + TanStack React Query
- **Tests:** Vitest + React Testing Library
- **Design:** See `DESIGN.md` for the full design system

### Development Guidelines

1. **Read DESIGN.md** before touching any UI. Colors, fonts, spacing are all defined there.
2. **Read CLAUDE.md** for project conventions and constraints.
3. **Write tests** for any new logic. Run `npm test` before submitting.
4. **Feature flags** — new features should be behind flags in `lib/feature-flags.ts`.
5. **Dash's personality** — if adding mascot messages, follow the tone guide in DESIGN.md. Ultra-casual, Gen Z, never condescending.

### PR Guidelines

- Keep PRs focused — one feature or fix per PR
- Include tests for new functionality
- Update DESIGN.md if adding new UI patterns
- Reference any related issues

### Running Tests

```bash
npm test          # Run all tests
npm run test:watch # Watch mode
```

## Reporting Issues

- **Bug reports:** Include steps to reproduce, expected behavior, and screenshots if UI-related
- **Feature requests:** Describe the user story, not just the technical solution
- **Question bank errors:** If you find an incorrect question, open an issue with the question ID and the correct answer with source

## Code of Conduct

Be kind. We're here to help people pass their driving tests. No toxicity, no gatekeeping, no ego. Teens use this app — keep it welcoming.

## License

- **Code:** MIT License (see LICENSE)
- **Question banks:** CC BY-SA 4.0 (see LICENSE)
