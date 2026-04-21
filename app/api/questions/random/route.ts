/**
 * Random Questions API Route
 * GET /api/questions/random - Get random questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRandomQuestions, getPracticeTestQuestions, getAdaptiveQuestions } from '@/lib/data/questions';
import { DifficultyLevel } from '@/lib/data/questions/types';

/**
 * GET /api/questions/random
 * Query parameters:
 * - count: Number of questions to return (default: 10)
 * - mode: Selection mode - 'random', 'test', 'adaptive' (default: 'random')
 * - category: Filter by category ID
 * - difficulty: Filter by difficulty (easy, medium, hard)
 * - exclude: Comma-separated list of question IDs to exclude
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
    
    const count = parseInt(searchParams.get('count') || '10', 10);
    const mode = searchParams.get('mode') || 'random';
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty') as DifficultyLevel | null;
    const exclude = searchParams.get('exclude')?.split(',').filter(Boolean) || [];
    
    let questions;
    
    switch (mode) {
      case 'test':
        // Get a balanced set of questions for a practice test
        questions = getPracticeTestQuestions(count);
        break;
        
      case 'adaptive':
        // Get questions based on adaptive difficulty
        // In a real implementation, this would use user's actual performance
        const mockPerformance = {
          easy: parseFloat(searchParams.get('easy_perf') || '0.8'),
          medium: parseFloat(searchParams.get('medium_perf') || '0.6'),
          hard: parseFloat(searchParams.get('hard_perf') || '0.4'),
        };
        questions = getAdaptiveQuestions(mockPerformance, count);
        break;
        
      case 'random':
      default:
        // Get random questions with optional filters
        let pool = getRandomQuestions(1000); // Get large pool first
        
        if (category) {
          pool = pool.filter(q => q.category_id === category);
        }
        
        if (difficulty) {
          pool = pool.filter(q => q.difficulty === difficulty);
        }
        
        if (exclude.length > 0) {
          pool = pool.filter(q => !exclude.includes(q.id));
        }
        
        // Shuffle and limit
        questions = pool.sort(() => Math.random() - 0.5).slice(0, count);
        break;
    }
    
    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
      mode,
    });
    
  } catch (error) {
    console.error('Error fetching random questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch random questions' },
      { status: 500 }
    );
  }
}
