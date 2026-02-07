/**
 * Illinois DMV Question Categories
 * Based on Illinois Rules of the Road 2024 structure
 */

import { QuestionCategory } from './types';

export const ILLINOIS_CATEGORIES: QuestionCategory[] = [
  {
    id: 'traffic-laws',
    name: 'Traffic Laws & Rules of the Road',
    description: 'Fundamental traffic laws, right-of-way rules, and general driving regulations in Illinois',
    icon: 'TrafficCone',
    color: '#3B82F6', // Blue
    question_count: 0,
    order: 1,
  },
  {
    id: 'traffic-signs',
    name: 'Traffic Signs & Signals',
    description: 'Recognition and understanding of regulatory, warning, and guide signs, traffic signals, and pavement markings',
    icon: 'Signpost',
    color: '#EF4444', // Red
    question_count: 0,
    order: 2,
  },
  {
    id: 'safe-driving',
    name: 'Safe Driving Practices',
    description: 'Defensive driving techniques, speed management, following distances, and hazard awareness',
    icon: 'Shield',
    color: '#10B981', // Green
    question_count: 0,
    order: 3,
  },
  {
    id: 'alcohol-drugs',
    name: 'Alcohol & Drug Laws',
    description: 'DUI laws, implied consent, blood alcohol concentration limits, and penalties',
    icon: 'Wine',
    color: '#8B5CF6', // Purple
    question_count: 0,
    order: 4,
  },
  {
    id: 'sharing-road',
    name: 'Sharing the Road',
    description: 'Interacting with pedestrians, cyclists, motorcycles, trucks, and emergency vehicles',
    icon: 'Users',
    color: '#F59E0B', // Amber
    question_count: 0,
    order: 5,
  },
  {
    id: 'parking-emergency',
    name: 'Parking & Emergency Situations',
    description: 'Parking regulations, emergency procedures, and vehicle breakdown protocols',
    icon: 'ParkingCircle',
    color: '#EC4899', // Pink
    question_count: 0,
    order: 6,
  },
  {
    id: 'vehicle-equipment',
    name: 'Vehicle Equipment & Maintenance',
    description: 'Required vehicle equipment, safety inspections, and basic maintenance requirements',
    icon: 'Wrench',
    color: '#6366F1', // Indigo
    question_count: 0,
    order: 7,
  },
  {
    id: 'road-conditions',
    name: 'Road Conditions & Weather',
    description: 'Driving in adverse weather, construction zones, and varying road conditions',
    icon: 'CloudRain',
    color: '#06B6D4', // Cyan
    question_count: 0,
    order: 8,
  },
  {
    id: 'illinois-specific',
    name: 'Illinois-Specific Laws',
    description: 'Illinois-specific regulations including Scott\'s Law, Move Over Law, GDL program, and insurance requirements',
    icon: 'MapPin',
    color: '#14B8A6', // Teal
    question_count: 0,
    order: 9,
  },
];

// Category lookup helpers
export const getCategoryById = (id: string): QuestionCategory | undefined => {
  return ILLINOIS_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryName = (id: string): string => {
  const category = getCategoryById(id);
  return category?.name || id;
};

export const getCategoryColor = (id: string): string => {
  const category = getCategoryById(id);
  return category?.color || '#6B7280';
};

// Category ID type for type safety
export type CategoryId = 
  | 'traffic-laws'
  | 'traffic-signs'
  | 'safe-driving'
  | 'alcohol-drugs'
  | 'sharing-road'
  | 'parking-emergency'
  | 'vehicle-equipment'
  | 'road-conditions'
  | 'illinois-specific';

// Validate category ID
export const isValidCategoryId = (id: string): id is CategoryId => {
  return ILLINOIS_CATEGORIES.some(cat => cat.id === id);
};

// Get categories for study plan (ordered)
export const getOrderedCategories = (): QuestionCategory[] => {
  return [...ILLINOIS_CATEGORIES].sort((a, b) => a.order - b.order);
};

// Get recommended study order for new drivers
export const getRecommendedStudyOrder = (): string[] => {
  // Start with signs (visual), then laws (foundational), then specific topics
  return [
    'traffic-signs',      // Visual recognition first
    'traffic-laws',       // Foundation
    'safe-driving',       // Application
    'sharing-road',       // Interaction
    'illinois-specific',  // State-specific
    'alcohol-drugs',      // Important for safety
    'road-conditions',    // Situational
    'parking-emergency',  // Specific scenarios
    'vehicle-equipment',  // Technical
  ];
};
