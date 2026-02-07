/**
 * Content Seeder for Supabase
 * Seeds the database with Illinois DMV questions
 */

import { createClient } from '@supabase/supabase-js';
import { illinoisDMVQuestions } from './questions/illinois-dmv-questions';
import { ILLINOIS_CATEGORIES } from './questions/categories';
import { Question, QuestionCategory } from './questions/types';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Seed configuration options
 */
export interface SeedConfig {
  clearExisting: boolean;
  seedCategories: boolean;
  seedQuestions: boolean;
  batchSize: number;
  dryRun: boolean;
}

/**
 * Seed result summary
 */
export interface SeedResult {
  success: boolean;
  categoriesSeeded: number;
  questionsSeeded: number;
  errors: string[];
  duration: number;
}

/**
 * Default seed configuration
 */
const DEFAULT_CONFIG: SeedConfig = {
  clearExisting: false,
  seedCategories: true,
  seedQuestions: true,
  batchSize: 50,
  dryRun: false,
};

/**
 * Main seed function
 */
export async function seedDatabase(config: Partial<SeedConfig> = {}): Promise<SeedResult> {
  const startTime = Date.now();
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const result: SeedResult = {
    success: true,
    categoriesSeeded: 0,
    questionsSeeded: 0,
    errors: [],
    duration: 0,
  };

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Clear existing data if requested
    if (finalConfig.clearExisting && !finalConfig.dryRun) {
      console.log('Clearing existing data...');
      await clearExistingData(supabase);
    }

    // Seed categories
    if (finalConfig.seedCategories) {
      console.log('Seeding categories...');
      const categoryResult = await seedCategories(supabase, finalConfig.dryRun);
      result.categoriesSeeded = categoryResult.count;
      result.errors.push(...categoryResult.errors);
    }

    // Seed questions
    if (finalConfig.seedQuestions) {
      console.log('Seeding questions...');
      const questionResult = await seedQuestions(supabase, finalConfig);
      result.questionsSeeded = questionResult.count;
      result.errors.push(...questionResult.errors);
    }

  } catch (error) {
    result.success = false;
    result.errors.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  }

  result.duration = Date.now() - startTime;
  return result;
}

/**
 * Clear existing data from tables
 */
async function clearExistingData(supabase: any): Promise<void> {
  // Delete in correct order due to foreign key constraints
  await supabase.from('user_question_progress').delete().neq('id', 'placeholder');
  await supabase.from('questions').delete().neq('id', 'placeholder');
  await supabase.from('question_categories').delete().neq('id', 'placeholder');
}

/**
 * Seed question categories
 */
async function seedCategories(
  supabase: any,
  dryRun: boolean
): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = [];
  
  if (dryRun) {
    console.log(`[DRY RUN] Would seed ${ILLINOIS_CATEGORIES.length} categories`);
    return { count: ILLINOIS_CATEGORIES.length, errors };
  }

  for (const category of ILLINOIS_CATEGORIES) {
    const categoryData = {
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      question_count: illinoisDMVQuestions.filter(q => q.category_id === category.id).length,
      order_index: category.order,
    };

    const { error } = await supabase
      .from('question_categories')
      .upsert(categoryData, { onConflict: 'id' });

    if (error) {
      errors.push(`Failed to seed category ${category.id}: ${error.message}`);
    }
  }

  return { count: ILLINOIS_CATEGORIES.length, errors };
}

/**
 * Seed questions in batches
 */
async function seedQuestions(
  supabase: any,
  config: SeedConfig
): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = [];
  let seededCount = 0;

  if (config.dryRun) {
    console.log(`[DRY RUN] Would seed ${illinoisDMVQuestions.length} questions`);
    return { count: illinoisDMVQuestions.length, errors };
  }

  // Process in batches
  for (let i = 0; i < illinoisDMVQuestions.length; i += config.batchSize) {
    const batch = illinoisDMVQuestions.slice(i, i + config.batchSize);
    
    const questionsData = batch.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      category_id: q.category_id,
      difficulty: q.difficulty,
      has_image: q.has_image,
      image_url: q.image_url || null,
      times_asked: q.times_asked,
      correct_count: q.correct_count,
      source: q.source,
    }));

    const { error } = await supabase
      .from('questions')
      .upsert(questionsData, { onConflict: 'id' });

    if (error) {
      errors.push(`Failed to seed batch ${i / config.batchSize + 1}: ${error.message}`);
    } else {
      seededCount += batch.length;
      console.log(`Seeded ${seededCount}/${illinoisDMVQuestions.length} questions...`);
    }
  }

  return { count: seededCount, errors };
}

/**
 * Validate questions before seeding
 */
export function validateQuestions(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  illinoisDMVQuestions.forEach((q, index) => {
    // Check for duplicate IDs
    if (seenIds.has(q.id)) {
      errors.push(`Duplicate question ID: ${q.id} at index ${index}`);
    }
    seenIds.add(q.id);

    // Validate required fields
    if (!q.question_text || q.question_text.trim() === '') {
      errors.push(`Question ${q.id}: Missing question text`);
    }

    // Validate options
    if (!q.options || q.options.length !== 4) {
      errors.push(`Question ${q.id}: Must have exactly 4 options`);
    }

    // Validate correct_answer
    if (q.correct_answer < 0 || q.correct_answer > 3) {
      errors.push(`Question ${q.id}: correct_answer must be 0-3`);
    }

    // Validate explanation
    if (!q.explanation || q.explanation.trim() === '') {
      errors.push(`Question ${q.id}: Missing explanation`);
    }

    // Validate category
    const validCategories = ILLINOIS_CATEGORIES.map(c => c.id);
    if (!validCategories.includes(q.category_id)) {
      errors.push(`Question ${q.id}: Invalid category_id ${q.category_id}`);
    }

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
      errors.push(`Question ${q.id}: Invalid difficulty ${q.difficulty}`);
    }

    // Validate image_url if has_image is true
    if (q.has_image && (!q.image_url || q.image_url.trim() === '')) {
      errors.push(`Question ${q.id}: has_image is true but image_url is missing`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate migration SQL
 */
export function generateMigrationSQL(): string {
  const sql = [];
  
  sql.push('-- Create question categories table');
  sql.push(`
CREATE TABLE IF NOT EXISTS question_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  question_count INTEGER DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
  `.trim());

  sql.push('\n-- Create questions table');
  sql.push(`
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  question_text TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES question_categories(id),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  has_image BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  times_asked INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
  `.trim());

  sql.push('\n-- Create user question progress table');
  sql.push(`
CREATE TABLE IF NOT EXISTS user_question_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_seen TIMESTAMP WITH TIME ZONE,
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);
  `.trim());

  sql.push('\n-- Create indexes');
  sql.push('CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category_id);');
  sql.push('CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);');
  sql.push('CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_question_progress(user_id);');
  sql.push('CREATE INDEX IF NOT EXISTS idx_user_progress_question ON user_question_progress(question_id);');

  sql.push('\n-- Insert categories');
  ILLINOIS_CATEGORIES.forEach(cat => {
    const count = illinoisDMVQuestions.filter(q => q.category_id === cat.id).length;
    sql.push(`
INSERT INTO question_categories (id, name, description, icon, color, question_count, order_index)
VALUES ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.description.replace(/'/g, "''")}', '${cat.icon}', '${cat.color}', ${count}, ${cat.order})
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  question_count = EXCLUDED.question_count,
  order_index = EXCLUDED.order_index;
    `.trim());
  });

  sql.push('\n-- Insert questions (sample, use seeder for full set)');
  sql.push(`-- ${illinoisDMVQuestions.length} questions to be inserted`);
  sql.push('-- Use the content-seeder.ts script to insert all questions');

  return sql.join('\n\n');
}

/**
 * Export questions as JSON for backup
 */
export function exportQuestionsAsJSON(): string {
  return JSON.stringify({
    categories: ILLINOIS_CATEGORIES,
    questions: illinoisDMVQuestions,
    exported_at: new Date().toISOString(),
    version: '1.0.0',
  }, null, 2);
}

/**
 * CLI runner for seeding
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const config: Partial<SeedConfig> = {
    clearExisting: args.includes('--clear'),
    dryRun: args.includes('--dry-run'),
    seedCategories: !args.includes('--no-categories'),
    seedQuestions: !args.includes('--no-questions'),
  };

  // Validate first
  console.log('Validating questions...');
  const validation = validateQuestions();
  if (!validation.valid) {
    console.error('Validation failed:');
    validation.errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
  console.log(`✓ All ${illinoisDMVQuestions.length} questions validated`);

  // Run seed
  seedDatabase(config)
    .then(result => {
      console.log('\nSeed completed:');
      console.log(`  Success: ${result.success}`);
      console.log(`  Categories: ${result.categoriesSeeded}`);
      console.log(`  Questions: ${result.questionsSeeded}`);
      console.log(`  Duration: ${result.duration}ms`);
      
      if (result.errors.length > 0) {
        console.log('\nErrors:');
        result.errors.forEach(e => console.log(`  - ${e}`));
      }
      
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
