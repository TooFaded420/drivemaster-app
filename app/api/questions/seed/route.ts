/**
 * Question Seeding API Route (Admin Only)
 * POST /api/questions/seed - Seed questions to Supabase
 * GET /api/questions/seed/validate - Validate question bank
 */

import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase, validateQuestions, generateMigrationSQL, exportQuestionsAsJSON, SeedConfig } from '@/lib/data/content-seeder';
import { validateQuestionBank, generateValidationReport } from '@/lib/data/question-validator';

/**
 * POST /api/questions/seed
 * Seed questions to Supabase database
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
    
    // Parse request body for configuration
    const body = await request.json().catch(() => ({}));
    
    const config: Partial<SeedConfig> = {
      clearExisting: body.clearExisting === true,
      seedCategories: body.seedCategories !== false,
      seedQuestions: body.seedQuestions !== false,
      batchSize: body.batchSize || 50,
      dryRun: body.dryRun === true,
    };
    
    // Validate questions first
    const validation = validateQuestions();
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Question validation failed',
        validation_errors: validation.errors,
      }, { status: 400 });
    }
    
    // Run seeding
    const result = await seedDatabase(config);
    
    return NextResponse.json({
      success: result.success,
      data: {
        categories_seeded: result.categoriesSeeded,
        questions_seeded: result.questionsSeeded,
        duration_ms: result.duration,
      },
      errors: result.errors,
      dry_run: config.dryRun,
    });
    
  } catch (error) {
    console.error('Error seeding questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed questions' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/questions/seed/validate
 * Run validation on question bank
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access (matches POST/PUT pattern)
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    
    const result = validateQuestionBank();
    
    if (format === 'markdown') {
      const report = generateValidationReport();
      return new NextResponse(report, {
        headers: { 'Content-Type': 'text/markdown' },
      });
    }
    
    return NextResponse.json({
      success: result.valid,
      data: {
        valid: result.valid,
        total_questions: result.stats.totalQuestions,
        valid_questions: result.stats.validQuestions,
        errors_found: result.stats.errorsFound,
        warnings_found: result.stats.warningsFound,
        by_category: result.stats.byCategory,
        by_difficulty: result.stats.byDifficulty,
        image_count: result.stats.imageCount,
      },
      errors: result.errors.slice(0, 20), // Limit errors in response
      warnings: result.warnings.slice(0, 20), // Limit warnings in response
    });
    
  } catch (error) {
    console.error('Error validating questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate questions' },
      { status: 500 }
    );
  }
}

/**
 * Export questions as SQL migration
 * GET /api/questions/seed/export?format=sql
 */
export async function PUT(request: NextRequest) {
  try {
    // Verify admin access
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'sql';
    
    if (format === 'sql') {
      const sql = generateMigrationSQL();
      return new NextResponse(sql, {
        headers: { 
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename="illinois_dmv_questions.sql"'
        },
      });
    }
    
    if (format === 'json') {
      const json = exportQuestionsAsJSON();
      return new NextResponse(json, {
        headers: { 
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="illinois_dmv_questions.json"'
        },
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid format. Use "sql" or "json"' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error exporting questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export questions' },
      { status: 500 }
    );
  }
}
