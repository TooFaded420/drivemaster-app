/**
 * Questions API Route
 * GET /api/questions - Get questions with filters
 * POST /api/questions - Create new question (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loadQuestions, searchQuestions } from '@/lib/data/question-loader';
import { QuestionFilter } from '@/lib/data/questions/types';

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
        filter.difficulty = difficulty as any;
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

/**
 * POST /api/questions
 * Create a new question (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify admin authentication
    const { data: { user: postUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !postUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // For now, only allow seeding via service role or environment check
    // In production, implement proper admin verification
    const isAdmin = request.headers.get('x-admin-key') === process.env.ADMIN_API_KEY;
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['question_text', 'options', 'correct_answer', 'explanation', 'category_id', 'difficulty'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate options array
    if (!Array.isArray(body.options) || body.options.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'Options must be an array of exactly 4 items' },
        { status: 400 }
      );
    }
    
    // Validate correct_answer
    if (body.correct_answer < 0 || body.correct_answer > 3) {
      return NextResponse.json(
        { success: false, error: 'correct_answer must be between 0 and 3' },
        { status: 400 }
      );
    }
    
    // Insert question
    const { data, error } = await supabase
      .from('questions')
      .insert({
        id: body.id || `il-${body.category_id?.substring(0, 2)}-${Date.now().toString().slice(-3)}`,
        question_text: body.question_text,
        options: body.options,
        correct_answer: body.correct_answer,
        explanation: body.explanation,
        category_id: body.category_id,
        difficulty: body.difficulty,
        has_image: body.has_image || false,
        image_url: body.image_url || null,
        source: body.source || 'Illinois Rules of the Road 2024',
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
      message: 'Question created successfully',
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
