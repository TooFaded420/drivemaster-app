/**
 * Questions API Route
 * GET /api/questions - Get questions with filters
 *
 * Question creation/seeding happens via /api/questions/seed (service role).
 * The old POST handler was removed: it targeted a pre-launch schema
 * (inline options/correct_answer) that does not match the production
 * schema (answers live in the answers table) and could never succeed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loadQuestions, searchQuestions } from '@/lib/data/question-loader';
import { DifficultyLevel, QuestionFilter } from '@/lib/data/questions/types';

/**
 * GET /api/questions
 * Query parameters:
 * - category: Filter by category ID
 * - difficulty: Filter by difficulty (easy, medium, hard)
 * - has_image: Filter by image availability (true/false)
 * - limit: Maximum number of questions to return
 * - random: Return random questions (true/false)
 * - search: Search query for question text
 */
export async function GET(request: NextRequest) {
  try {
    // Require auth — answers/explanations must not leak
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Build filter from query params
    const filter: QuestionFilter = {};
    
    if (searchParams.has('category')) {
      filter.category_id = searchParams.get('category')!;
    }
    
    if (searchParams.has('difficulty')) {
      const difficulty = searchParams.get('difficulty')!;
      if (['easy', 'medium', 'hard'].includes(difficulty)) {
        filter.difficulty = difficulty as DifficultyLevel;
      }
    }
    
    if (searchParams.has('has_image')) {
      filter.has_image = searchParams.get('has_image') === 'true';
    }
    
    if (searchParams.has('limit')) {
      filter.limit = parseInt(searchParams.get('limit')!, 10);
    }
    
    if (searchParams.get('random') === 'true') {
      filter.random = true;
    }
    
    // Handle search separately
    if (searchParams.has('search')) {
      const searchQuery = searchParams.get('search')!;
      const searchResults = searchQuestions({ 
        query: searchQuery,
        category: filter.category_id,
        difficulty: filter.difficulty,
        hasImage: filter.has_image,
      });
      
      const limited = filter.limit 
        ? searchResults.slice(0, filter.limit)
        : searchResults;
      
      return NextResponse.json({
        success: true,
        data: limited,
        count: limited.length,
        total: searchResults.length,
      });
    }
    
    // Load questions with filter
    const questions = loadQuestions(filter);
    
    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
    });
    
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
