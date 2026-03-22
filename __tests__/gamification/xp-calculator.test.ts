import { describe, it, expect } from "vitest";
import { calculateXP, calculateAnswerXP } from "@/lib/gamification/xp-calculator";

/**
 * XP Calculator Tests
 *
 * Covers all 6 multiplier paths:
 *   1. Base XP (correct answers × per-question XP)
 *   2. Speed bonus (fast/medium/slow/none)
 *   3. Streak bonus (capped at 10)
 *   4. Perfect quiz bonus (100% with 5+ questions)
 *   5. First attempt bonus (20 XP)
 *   6. Difficulty bonus (20% for hard)
 */

describe("calculateXP", () => {
  const baseInput = {
    correctAnswers: 8,
    totalQuestions: 10,
    averageTimePerQuestion: 15,
    streakCount: 3,
    isFirstAttempt: false,
    difficulty: "medium" as const,
  };

  // ── Base XP ──────────────────────────────────────────
  describe("base XP", () => {
    it("awards 10 XP per correct answer on medium difficulty", () => {
      const result = calculateXP({ ...baseInput, correctAnswers: 5 });
      expect(result.baseXP).toBe(50);
    });

    it("awards 15 XP per correct answer on hard difficulty", () => {
      const result = calculateXP({ ...baseInput, correctAnswers: 5, difficulty: "hard" });
      expect(result.baseXP).toBe(75);
    });

    it("awards 0 base XP for 0 correct answers", () => {
      const result = calculateXP({ ...baseInput, correctAnswers: 0 });
      expect(result.baseXP).toBe(0);
    });
  });

  // ── Speed Bonus ──────────────────────────────────────
  describe("speed bonus", () => {
    it("awards 50% speed bonus for avg < 10s", () => {
      const result = calculateXP({ ...baseInput, averageTimePerQuestion: 5 });
      expect(result.speedBonus).toBe(Math.round(result.baseXP * 0.5));
    });

    it("awards 25% speed bonus for avg 10-20s", () => {
      const result = calculateXP({ ...baseInput, averageTimePerQuestion: 15 });
      expect(result.speedBonus).toBe(Math.round(result.baseXP * 0.25));
    });

    it("awards 10% speed bonus for avg 20-30s", () => {
      const result = calculateXP({ ...baseInput, averageTimePerQuestion: 25 });
      expect(result.speedBonus).toBe(Math.round(result.baseXP * 0.1));
    });

    it("awards no speed bonus for avg > 30s", () => {
      const result = calculateXP({ ...baseInput, averageTimePerQuestion: 45 });
      expect(result.speedBonus).toBe(0);
    });
  });

  // ── Streak Bonus ─────────────────────────────────────
  describe("streak bonus", () => {
    it("awards 1 XP per streak count", () => {
      const result = calculateXP({ ...baseInput, streakCount: 5 });
      expect(result.streakBonus).toBe(5);
    });

    it("caps streak bonus at 10", () => {
      const result = calculateXP({ ...baseInput, streakCount: 25 });
      expect(result.streakBonus).toBe(10);
    });

    it("awards 0 streak bonus for 0 streak", () => {
      const result = calculateXP({ ...baseInput, streakCount: 0 });
      expect(result.streakBonus).toBe(0);
    });
  });

  // ── Perfect Quiz Bonus ───────────────────────────────
  describe("perfect quiz bonus", () => {
    it("awards 100 XP for 100% with 5+ questions", () => {
      const result = calculateXP({
        ...baseInput,
        correctAnswers: 10,
        totalQuestions: 10,
      });
      expect(result.perfectBonus).toBe(100);
    });

    it("does NOT award perfect bonus for < 5 questions", () => {
      const result = calculateXP({
        ...baseInput,
        correctAnswers: 4,
        totalQuestions: 4,
      });
      expect(result.perfectBonus).toBe(0);
    });

    it("does NOT award perfect bonus for < 100% accuracy", () => {
      const result = calculateXP({
        ...baseInput,
        correctAnswers: 9,
        totalQuestions: 10,
      });
      expect(result.perfectBonus).toBe(0);
    });
  });

  // ── First Attempt Bonus ──────────────────────────────
  describe("first attempt bonus", () => {
    it("awards 20 XP for first attempt", () => {
      const result = calculateXP({ ...baseInput, isFirstAttempt: true });
      expect(result.firstAttemptBonus).toBe(20);
    });

    it("awards 0 for non-first attempt", () => {
      const result = calculateXP({ ...baseInput, isFirstAttempt: false });
      expect(result.firstAttemptBonus).toBe(0);
    });
  });

  // ── Difficulty Bonus ─────────────────────────────────
  describe("difficulty bonus", () => {
    it("awards 20% bonus for hard difficulty", () => {
      const result = calculateXP({ ...baseInput, difficulty: "hard", correctAnswers: 10 });
      // Base = 10 * 15 = 150. Difficulty bonus = 150 * 0.2 = 30
      expect(result.difficultyBonus).toBe(30);
    });

    it("awards 0 for medium difficulty", () => {
      const result = calculateXP({ ...baseInput, difficulty: "medium" });
      expect(result.difficultyBonus).toBe(0);
    });

    it("awards 0 for easy difficulty", () => {
      const result = calculateXP({ ...baseInput, difficulty: "easy" });
      expect(result.difficultyBonus).toBe(0);
    });
  });

  // ── Total XP ─────────────────────────────────────────
  describe("total XP", () => {
    it("sums all components correctly", () => {
      const result = calculateXP(baseInput);
      const expectedTotal =
        result.baseXP +
        result.speedBonus +
        result.streakBonus +
        result.perfectBonus +
        result.firstAttemptBonus +
        result.difficultyBonus;
      expect(result.totalXP).toBe(expectedTotal);
    });

    it("includes breakdown entries for all non-zero components", () => {
      const result = calculateXP({
        ...baseInput,
        correctAnswers: 10,
        totalQuestions: 10,
        isFirstAttempt: true,
        difficulty: "hard",
        streakCount: 5,
        averageTimePerQuestion: 5,
      });
      // Should have: base, speed, streak, perfect, first attempt, hard mode
      expect(result.breakdown.length).toBe(6);
    });
  });

  // ── Edge Cases ───────────────────────────────────────
  describe("edge cases", () => {
    it("handles 0 questions without crashing", () => {
      const result = calculateXP({
        ...baseInput,
        correctAnswers: 0,
        totalQuestions: 0,
        streakCount: 0,
      });
      expect(result.totalXP).toBe(0);
      expect(result.baseXP).toBe(0);
    });

    it("handles very fast answers (0 seconds)", () => {
      const result = calculateXP({ ...baseInput, averageTimePerQuestion: 0 });
      expect(result.speedBonus).toBeGreaterThan(0);
    });

    it("handles negative streak count gracefully", () => {
      const result = calculateXP({ ...baseInput, streakCount: -1 });
      expect(result.streakBonus).toBeLessThanOrEqual(0);
    });
  });
});

describe("calculateAnswerXP", () => {
  it("returns 0 for incorrect answers", () => {
    expect(calculateAnswerXP(false, 5, 3)).toBe(0);
  });

  it("awards base XP + speed + streak for correct fast answer", () => {
    const xp = calculateAnswerXP(true, 5, 3);
    // base(10) + speed(5) + streak(3) = 18
    expect(xp).toBe(18);
  });

  it("awards base XP + medium speed for 15s answer", () => {
    const xp = calculateAnswerXP(true, 15, 0);
    // base(10) + speed(3) + streak(0) = 13
    expect(xp).toBe(13);
  });

  it("awards higher base for hard difficulty", () => {
    const xp = calculateAnswerXP(true, 5, 0, "hard");
    // base(15) + speed(5) + streak(0) = 20
    expect(xp).toBe(20);
  });

  it("caps streak bonus at 10", () => {
    const xp = calculateAnswerXP(true, 50, 20);
    // base(10) + speed(0) + streak(10) = 20
    expect(xp).toBe(20);
  });
});
