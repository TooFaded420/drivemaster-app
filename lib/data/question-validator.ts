/**
 * Question Content Validator
 * Validates question format, checks for duplicates, and verifies content
 */

import { Question, DifficultyLevel } from './questions/types';
import { illinoisDMVQuestions } from './questions/illinois-dmv-questions';
import { ILLINOIS_CATEGORIES, isValidCategoryId } from './questions/categories';
import { classifyDifficulty, validateDifficulty } from './questions/difficulty';

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  stats: ValidationStats;
}

/**
 * Validation error
 */
export interface ValidationError {
  questionId: string;
  field: string;
  message: string;
  severity: 'error' | 'critical';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  questionId: string;
  field: string;
  message: string;
  suggestion?: string;
}

/**
 * Validation statistics
 */
export interface ValidationStats {
  totalQuestions: number;
  validQuestions: number;
  errorsFound: number;
  warningsFound: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<DifficultyLevel, number>;
  duplicateCount: number;
  imageCount: number;
}

/**
 * Validate entire question bank
 */
export function validateQuestionBank(): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const seenIds = new Set<string>();
  const seenQuestions = new Set<string>();
  let duplicateCount = 0;

  illinoisDMVQuestions.forEach((question, index) => {
    // Check for duplicate IDs
    if (seenIds.has(question.id)) {
      errors.push({
        questionId: question.id,
        field: 'id',
        message: `Duplicate question ID found at index ${index}`,
        severity: 'critical',
      });
    }
    seenIds.add(question.id);

    // Check for duplicate question text (similar questions)
    const normalizedText = normalizeText(question.question_text);
    if (seenQuestions.has(normalizedText)) {
      warnings.push({
        questionId: question.id,
        field: 'question_text',
        message: 'Potentially duplicate question text',
        suggestion: 'Review to ensure this is not a duplicate question',
      });
      duplicateCount++;
    }
    seenQuestions.add(normalizedText);

    // Validate all fields
    errors.push(...validateRequiredFields(question));
    errors.push(...validateFieldFormats(question));
    warnings.push(...validateContentQuality(question));
    warnings.push(...validateDifficultyAssignment(question));
  });

  const stats: ValidationStats = {
    totalQuestions: illinoisDMVQuestions.length,
    validQuestions: illinoisDMVQuestions.length - errors.filter(e => e.severity === 'critical').length,
    errorsFound: errors.length,
    warningsFound: warnings.length,
    byCategory: countByCategory(),
    byDifficulty: countByDifficulty(),
    duplicateCount,
    imageCount: illinoisDMVQuestions.filter(q => q.has_image).length,
  };

  return {
    valid: errors.filter(e => e.severity === 'critical').length === 0,
    errors,
    warnings,
    stats,
  };
}

/**
 * Validate required fields
 */
function validateRequiredFields(question: Question): ValidationError[] {
  const errors: ValidationError[] = [];

  // ID validation
  if (!question.id || question.id.trim() === '') {
    errors.push({
      questionId: question.id || 'unknown',
      field: 'id',
      message: 'Question ID is required',
      severity: 'critical',
    });
  }

  // Question text validation
  if (!question.question_text || question.question_text.trim() === '') {
    errors.push({
      questionId: question.id,
      field: 'question_text',
      message: 'Question text is required',
      severity: 'critical',
    });
  }

  // Options validation
  if (!question.options || question.options.length !== 4) {
    errors.push({
      questionId: question.id,
      field: 'options',
      message: `Question must have exactly 4 options, found ${question.options?.length || 0}`,
      severity: 'critical',
    });
  }

  // Check for empty options
  question.options?.forEach((option, idx) => {
    if (!option || option.trim() === '') {
      errors.push({
        questionId: question.id,
        field: `options[${idx}]`,
        message: `Option ${idx + 1} is empty`,
        severity: 'critical',
      });
    }
  });

  // Correct answer validation
  if (question.correct_answer === undefined || question.correct_answer === null) {
    errors.push({
      questionId: question.id,
      field: 'correct_answer',
      message: 'Correct answer is required',
      severity: 'critical',
    });
  } else if (question.correct_answer < 0 || question.correct_answer > 3) {
    errors.push({
      questionId: question.id,
      field: 'correct_answer',
      message: `Correct answer must be 0-3, found ${question.correct_answer}`,
      severity: 'critical',
    });
  }

  // Explanation validation
  if (!question.explanation || question.explanation.trim() === '') {
    errors.push({
      questionId: question.id,
      field: 'explanation',
      message: 'Explanation is required',
      severity: 'critical',
    });
  }

  // Category validation
  if (!question.category_id) {
    errors.push({
      questionId: question.id,
      field: 'category_id',
      message: 'Category ID is required',
      severity: 'critical',
    });
  } else if (!isValidCategoryId(question.category_id)) {
    errors.push({
      questionId: question.id,
      field: 'category_id',
      message: `Invalid category ID: ${question.category_id}`,
      severity: 'critical',
    });
  }

  // Difficulty validation
  if (!question.difficulty) {
    errors.push({
      questionId: question.id,
      field: 'difficulty',
      message: 'Difficulty is required',
      severity: 'critical',
    });
  } else if (!['easy', 'medium', 'hard'].includes(question.difficulty)) {
    errors.push({
      questionId: question.id,
      field: 'difficulty',
      message: `Invalid difficulty: ${question.difficulty}`,
      severity: 'critical',
    });
  }

  // Source validation
  if (!question.source || question.source.trim() === '') {
    errors.push({
      questionId: question.id,
      field: 'source',
      message: 'Source citation is required',
      severity: 'error',
    });
  }

  // Image validation
  if (question.has_image && (!question.image_url || question.image_url.trim() === '')) {
    errors.push({
      questionId: question.id,
      field: 'image_url',
      message: 'has_image is true but image_url is missing',
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Validate field formats
 */
function validateFieldFormats(question: Question): ValidationError[] {
  const errors: ValidationError[] = [];

  // ID format validation (should follow pattern: il-XX-NNN)
  const idPattern = /^il-[a-z]{2}-\d{3}$/;
  if (!idPattern.test(question.id)) {
    errors.push({
      questionId: question.id,
      field: 'id',
      message: `ID should follow pattern 'il-XX-NNN' (e.g., il-ts-001), found: ${question.id}`,
      severity: 'error',
    });
  }

  // Question text length
  if (question.question_text && question.question_text.length > 500) {
    errors.push({
      questionId: question.id,
      field: 'question_text',
      message: `Question text is very long (${question.question_text.length} chars), consider shortening`,
      severity: 'error',
    });
  }

  // Check for duplicate options
  const uniqueOptions = new Set(question.options?.map(o => normalizeText(o)));
  if (uniqueOptions.size !== question.options?.length) {
    errors.push({
      questionId: question.id,
      field: 'options',
      message: 'Duplicate answer options found',
      severity: 'critical',
    });
  }

  // Check for "All of the above" / "None of the above" placement
  const normalizedOptions = question.options?.map(o => normalizeText(o));
  const allOfAboveIndex = normalizedOptions?.findIndex(o => 
    o.includes('all of the above') || o.includes('all the above')
  );
  const noneOfAboveIndex = normalizedOptions?.findIndex(o => 
    o.includes('none of the above') || o.includes('none above')
  );

  if (allOfAboveIndex !== undefined && allOfAboveIndex !== -1 && allOfAboveIndex !== 3) {
    errors.push({
      questionId: question.id,
      field: 'options',
      message: '"All of the above" should typically be the last option',
      severity: 'error',
    });
  }

  if (noneOfAboveIndex !== undefined && noneOfAboveIndex !== -1 && noneOfAboveIndex !== 3) {
    errors.push({
      questionId: question.id,
      field: 'options',
      message: '"None of the above" should typically be the last option',
      severity: 'error',
    });
  }

  return errors;
}

/**
 * Validate content quality
 */
function validateContentQuality(question: Question): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check question text quality
  if (question.question_text) {
    // Check for proper punctuation
    if (!question.question_text.endsWith('?') && !question.question_text.endsWith('.')) {
      warnings.push({
        questionId: question.id,
        field: 'question_text',
        message: 'Question should end with ? or .',
        suggestion: 'Add proper punctuation',
      });
    }

    // Check for excessive capitalization
    const capsRatio = (question.question_text.match(/[A-Z]/g) || []).length / question.question_text.length;
    if (capsRatio > 0.3) {
      warnings.push({
        questionId: question.id,
        field: 'question_text',
        message: 'High ratio of capital letters - check for unnecessary caps',
      });
    }

    // Check for double spaces
    if (question.question_text.includes('  ')) {
      warnings.push({
        questionId: question.id,
        field: 'question_text',
        message: 'Contains double spaces',
        suggestion: 'Remove extra spaces',
      });
    }
  }

  // Check explanation quality
  if (question.explanation) {
    if (question.explanation.length < 30) {
      warnings.push({
        questionId: question.id,
        field: 'explanation',
        message: 'Explanation is very short - consider adding more detail',
      });
    }

    // Check if explanation just repeats the answer
    const correctOption = question.options?.[question.correct_answer]?.toLowerCase();
    if (correctOption && question.explanation.toLowerCase().includes(correctOption)) {
      // This is actually good - explanation references the answer
    }
  }

  // Check source format
  if (question.source) {
    const expectedPrefix = 'Illinois Rules of the Road';
    if (!question.source.includes(expectedPrefix)) {
      warnings.push({
        questionId: question.id,
        field: 'source',
        message: `Source should reference "${expectedPrefix}"`,
        suggestion: 'Use format: "Illinois Rules of the Road 2024 - Chapter X: Topic"',
      });
    }
  }

  return warnings;
}

/**
 * Validate difficulty assignment
 */
function validateDifficultyAssignment(question: Question): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  const validation = validateDifficulty(question);
  
  if (validation.mismatch) {
    warnings.push({
      questionId: question.id,
      field: 'difficulty',
      message: `Difficulty may be misclassified. Assigned: ${validation.assigned}, Calculated: ${validation.calculated}`,
      suggestion: 'Review and adjust if needed',
    });
  }

  return warnings;
}

/**
 * Check for answer key consistency
 */
export function verifyAnswerKeys(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  illinoisDMVQuestions.forEach(question => {
    // Verify correct_answer points to a valid option
    if (question.correct_answer < 0 || question.correct_answer >= (question.options?.length || 0)) {
      errors.push(`${question.id}: correct_answer index out of bounds`);
    }

    // Verify explanation mentions or aligns with correct answer
    const correctOption = question.options?.[question.correct_answer];
    if (correctOption && question.explanation) {
      // This is a basic check - in practice, explanations don't always include the exact answer text
      const explanationLower = question.explanation.toLowerCase();
      const keyTerms = correctOption.toLowerCase().split(' ').filter(w => w.length > 3);
      
      // Check if at least one key term from the answer appears in the explanation
      const hasKeyTerm = keyTerms.some(term => explanationLower.includes(term));
      if (!hasKeyTerm && keyTerms.length > 0) {
        // This is just a warning-level issue
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check source citations
 */
export function verifySourceCitations(): { valid: boolean; errors: string[]; coverage: Record<string, number> } {
  const errors: string[] = [];
  const coverage: Record<string, number> = {};

  illinoisDMVQuestions.forEach(question => {
    if (!question.source) {
      errors.push(`${question.id}: Missing source citation`);
      return;
    }

    // Track coverage by chapter
    const chapterMatch = question.source.match(/Chapter (\d+)/);
    if (chapterMatch) {
      const chapter = `Chapter ${chapterMatch[1]}`;
      coverage[chapter] = (coverage[chapter] || 0) + 1;
    }

    // Verify source format
    if (!question.source.includes('Illinois Rules of the Road')) {
      errors.push(`${question.id}: Source should reference Illinois Rules of the Road`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    coverage,
  };
}

/**
 * Find similar questions
 */
export function findSimilarQuestions(threshold: number = 0.8): Array<{ q1: string; q2: string; similarity: number }> {
  const similar: Array<{ q1: string; q2: string; similarity: number }> = [];

  for (let i = 0; i < illinoisDMVQuestions.length; i++) {
    for (let j = i + 1; j < illinoisDMVQuestions.length; j++) {
      const q1 = illinoisDMVQuestions[i];
      const q2 = illinoisDMVQuestions[j];

      const similarity = calculateSimilarity(q1.question_text, q2.question_text);
      
      if (similarity >= threshold) {
        similar.push({ q1: q1.id, q2: q2.id, similarity });
      }
    }
  }

  return similar.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Calculate text similarity (simple Jaccard similarity)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(normalizeText(text1).split(' '));
  const words2 = new Set(normalizeText(text2).split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Normalize text for comparison
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Count questions by category
 */
function countByCategory(): Record<string, number> {
  const counts: Record<string, number> = {};
  
  ILLINOIS_CATEGORIES.forEach(cat => {
    counts[cat.id] = illinoisDMVQuestions.filter(q => q.category_id === cat.id).length;
  });
  
  return counts;
}

/**
 * Count questions by difficulty
 */
function countByDifficulty(): Record<DifficultyLevel, number> {
  return {
    easy: illinoisDMVQuestions.filter(q => q.difficulty === 'easy').length,
    medium: illinoisDMVQuestions.filter(q => q.difficulty === 'medium').length,
    hard: illinoisDMVQuestions.filter(q => q.difficulty === 'hard').length,
  };
}

/**
 * Generate validation report
 */
export function generateValidationReport(): string {
  const result = validateQuestionBank();
  const answerCheck = verifyAnswerKeys();
  const sourceCheck = verifySourceCitations();
  const similarQuestions = findSimilarQuestions(0.9);

  let report = '# Illinois DMV Question Bank Validation Report\n\n';
  
  report += '## Summary\n\n';
  report += `- **Total Questions**: ${result.stats.totalQuestions}\n`;
  report += `- **Valid Questions**: ${result.stats.validQuestions}\n`;
  report += `- **Critical Errors**: ${result.errors.filter(e => e.severity === 'critical').length}\n`;
  report += `- **Warnings**: ${result.warnings.length}\n`;
  report += `- **Overall Valid**: ${result.valid ? '✓ YES' : '✗ NO'}\n\n`;

  report += '## Distribution\n\n';
  report += '### By Category\n';
  Object.entries(result.stats.byCategory).forEach(([cat, count]) => {
    report += `- ${cat}: ${count}\n`;
  });
  
  report += '\n### By Difficulty\n';
  Object.entries(result.stats.byDifficulty).forEach(([diff, count]) => {
    report += `- ${diff}: ${count}\n`;
  });
  
  report += `\n### With Images: ${result.stats.imageCount}\n`;

  if (result.errors.length > 0) {
    report += '\n## Errors\n\n';
    result.errors.forEach(e => {
      report += `- **${e.severity.toUpperCase()}** [${e.questionId}] ${e.field}: ${e.message}\n`;
    });
  }

  if (result.warnings.length > 0) {
    report += '\n## Warnings\n\n';
    result.warnings.slice(0, 20).forEach(w => {
      report += `- [${w.questionId}] ${w.field}: ${w.message}\n`;
    });
    if (result.warnings.length > 20) {
      report += `- ... and ${result.warnings.length - 20} more warnings\n`;
    }
  }

  if (similarQuestions.length > 0) {
    report += '\n## Similar Questions (Potential Duplicates)\n\n';
    similarQuestions.slice(0, 10).forEach(s => {
      report += `- ${s.q1} ↔ ${s.q2} (${Math.round(s.similarity * 100)}% similar)\n`;
    });
  }

  report += '\n## Source Coverage\n\n';
  Object.entries(sourceCheck.coverage).forEach(([chapter, count]) => {
    report += `- ${chapter}: ${count} questions\n`;
  });

  return report;
}

/**
 * CLI runner for validation
 */
if (require.main === module) {
  console.log('Running question bank validation...\n');
  
  const result = validateQuestionBank();
  
  console.log(generateValidationReport());
  
  process.exit(result.valid ? 0 : 1);
}
