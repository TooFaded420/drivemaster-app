/**
 * Categories API Route
 * GET /api/questions/categories - Get all question categories
 */

import { NextResponse } from 'next/server';
import { ILLINOIS_CATEGORIES } from '@/lib/data/questions/categories';
import { getCategoryQuestionCounts } from '@/lib/data/questions';

/**
 * GET /api/questions/categories
 * Returns all question categories with question counts
 */
export async function GET() {
  try {
    // Get question counts for each category
    const counts = getCategoryQuestionCounts();
    
    // Merge categories with their counts
    const categoriesWithCounts = ILLINOIS_CATEGORIES.map(cat => ({
      ...cat,
      question_count: counts[cat.id] || 0,
    }));
    
    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
      count: categoriesWithCounts.length,
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
