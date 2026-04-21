export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Onboarding data type
export interface OnboardingData {
  stepsCompleted: number[];
  stepsSkipped: number[];
  assessmentScore?: number;
  assessmentLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  studyDays?: string[];
  dailyGoal?: number;
  testDate?: string;
  [key: string]: Json | undefined;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          state: string
          test_type: string
          test_date: string | null
          created_at: string
          updated_at: string
          // Onboarding fields
          onboarding_completed: boolean
          onboarding_step: number
          onboarding_data: Json | null
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          state?: string
          test_type?: string
          test_date?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          onboarding_data?: Json | null
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          state?: string
          test_type?: string
          test_date?: string | null
          created_at?: string
          updated_at?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          onboarding_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          user_id: string
          total_xp: number
          current_level: number
          current_streak: number
          longest_streak: number
          last_activity_date: string | null
          streak_freezes: number
          miles_currency: number
        }
        Insert: {
          user_id: string
          total_xp?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          streak_freezes?: number
          miles_currency?: number
        }
        Update: {
          user_id?: string
          total_xp?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_activity_date?: string | null
          streak_freezes?: number
          miles_currency?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          icon: string | null
          color: string | null
          sort_order: number | null
          question_count: number
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number | null
          question_count?: number
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number | null
          question_count?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: number
          category_id: number | null
          question_text: string
          question_type: string
          explanation: string | null
          difficulty: string
          image_url: string | null
          is_active: boolean
          source: string | null
          created_at: string
          times_asked: number
          correct_count: number
        }
        Insert: {
          id?: number
          category_id?: number | null
          question_text: string
          question_type?: string
          explanation?: string | null
          difficulty?: string
          image_url?: string | null
          is_active?: boolean
          source?: string | null
          created_at?: string
          times_asked?: number
          correct_count?: number
        }
        Update: {
          id?: number
          category_id?: number | null
          question_text?: string
          question_type?: string
          explanation?: string | null
          difficulty?: string
          image_url?: string | null
          is_active?: boolean
          source?: string | null
          created_at?: string
          times_asked?: number
          correct_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      answers: {
        Row: {
          id: number
          question_id: number
          answer_text: string
          is_correct: boolean
          sort_order: number | null
        }
        Insert: {
          id?: number
          question_id: number
          answer_text: string
          is_correct?: boolean
          sort_order?: number | null
        }
        Update: {
          id?: number
          question_id?: number
          answer_text?: string
          is_correct?: boolean
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
        ]
      }
      user_attempts: {
        Row: {
          id: number
          user_id: string
          question_id: number
          selected_answer_id: number | null
          is_correct: boolean | null
          time_taken: number | null
          attempt_date: string
          session_id: string | null
        }
        Insert: {
          id?: number
          user_id: string
          question_id: number
          selected_answer_id?: number | null
          is_correct?: boolean | null
          time_taken?: number | null
          attempt_date?: string
          session_id?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          question_id?: number
          selected_answer_id?: number | null
          is_correct?: boolean | null
          time_taken?: number | null
          attempt_date?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempts_selected_answer_id_fkey"
            columns: ["selected_answer_id"]
            isOneToOne: false
            referencedRelation: "answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      quiz_sessions: {
        Row: {
          id: string
          user_id: string
          quiz_type: string | null
          category_id: number | null
          question_count: number | null
          correct_count: number | null
          xp_earned: number | null
          started_at: string
          completed_at: string | null
          is_completed: boolean
          time_taken_seconds: number | null
          mistake_count: number
          streak_count: number
        }
        Insert: {
          id: string
          user_id: string
          quiz_type?: string | null
          category_id?: number | null
          question_count?: number | null
          correct_count?: number | null
          xp_earned?: number | null
          started_at?: string
          completed_at?: string | null
          is_completed?: boolean
          time_taken_seconds?: number | null
          mistake_count?: number
          streak_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          quiz_type?: string | null
          category_id?: number | null
          question_count?: number | null
          correct_count?: number | null
          xp_earned?: number | null
          started_at?: string
          completed_at?: string | null
          is_completed?: boolean
          time_taken_seconds?: number | null
          mistake_count?: number
          streak_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      achievements: {
        Row: {
          id: number
          name: string
          description: string | null
          icon: string | null
          requirement_type: string | null
          requirement_value: number | null
          xp_reward: number
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          icon?: string | null
          requirement_type?: string | null
          requirement_value?: number | null
          xp_reward?: number
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          icon?: string | null
          requirement_type?: string | null
          requirement_value?: number | null
          xp_reward?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          user_id: string
          achievement_id: number
          earned_at: string
        }
        Insert: {
          user_id: string
          achievement_id: number
          earned_at?: string
        }
        Update: {
          user_id?: string
          achievement_id?: number
          earned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      leaderboards: {
        Row: {
          id: number
          name: string
          type: string | null
          start_date: string | null
          end_date: string | null
          is_active: boolean
        }
        Insert: {
          id?: number
          name: string
          type?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
        }
        Update: {
          id?: number
          name?: string
          type?: string | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          id: number
          leaderboard_id: number
          user_id: string
          xp_earned: number
          rank: number | null
          tier: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          leaderboard_id: number
          user_id: string
          xp_earned?: number
          rank?: number | null
          tier?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          leaderboard_id?: number
          user_id?: string
          xp_earned?: number
          rank?: number | null
          tier?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_quests: {
        Row: {
          id: number
          user_id: string
          quest_type: string | null
          target_value: number | null
          current_value: number
          xp_reward: number | null
          is_completed: boolean
          date: string
          completed_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          quest_type?: string | null
          target_value?: number | null
          current_value?: number
          xp_reward?: number | null
          is_completed?: boolean
          date?: string
          completed_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          quest_type?: string | null
          target_value?: number | null
          current_value?: number
          xp_reward?: number | null
          is_completed?: boolean
          date?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_wrong_answers: {
        Row: {
          user_id: string
          question_id: number
          wrong_count: number
          last_attempted: string
          is_mastered: boolean
        }
        Insert: {
          user_id: string
          question_id: number
          wrong_count?: number
          last_attempted?: string
          is_mastered?: boolean
        }
        Update: {
          user_id?: string
          question_id?: number
          wrong_count?: number
          last_attempted?: string
          is_mastered?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_wrong_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_wrong_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_leagues: {
        Row: {
          user_id: string
          current_league: string
          weekly_xp: number
          season_id: string
          last_week_rank: number | null
          last_week_league: string | null
          promotion_shown_at: string | null
          demotion_warning_shown_at: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          current_league?: string
          weekly_xp?: number
          season_id: string
          last_week_rank?: number | null
          last_week_league?: string | null
          promotion_shown_at?: string | null
          demotion_warning_shown_at?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_league?: string
          weekly_xp?: number
          season_id?: string
          last_week_rank?: number | null
          last_week_league?: string | null
          promotion_shown_at?: string | null
          demotion_warning_shown_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_leagues_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      league_seasons: {
        Row: {
          id: string
          week_start: string
          week_end: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          week_start: string
          week_end: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          week_start?: string
          week_end?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      parent_links: {
        Row: {
          id: string
          teen_user_id: string
          parent_user_id: string | null
          invite_code: string | null
          invite_expires_at: string | null
          status: string
          linked_at: string | null
          approved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          teen_user_id: string
          parent_user_id?: string | null
          invite_code?: string | null
          invite_expires_at?: string | null
          status?: string
          linked_at?: string | null
          approved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          teen_user_id?: string
          parent_user_id?: string | null
          invite_code?: string | null
          invite_expires_at?: string | null
          status?: string
          linked_at?: string | null
          approved_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          id: string
          creator_id: string
          seed: string
          question_ids: number[]
          status: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          seed: string
          question_ids: number[]
          status?: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          seed?: string
          question_ids?: number[]
          status?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: []
      }
      challenge_results: {
        Row: {
          id: string
          challenge_id: string
          user_id: string
          score: number
          correct_count: number
          total_questions: number
          time_taken_seconds: number | null
          completed_at: string
        }
        Insert: {
          id?: string
          challenge_id: string
          user_id: string
          score: number
          correct_count: number
          total_questions: number
          time_taken_seconds?: number | null
          completed_at?: string
        }
        Update: {
          id?: string
          challenge_id?: string
          user_id?: string
          score?: number
          correct_count?: number
          total_questions?: number
          time_taken_seconds?: number | null
          completed_at?: string
        }
        Relationships: []
      }
      ai_explanations: {
        Row: {
          question_id: number
          wrong_answer_index: number
          explanation: string
          created_at: string
        }
        Insert: {
          question_id: number
          wrong_answer_index: number
          explanation: string
          created_at?: string
        }
        Update: {
          question_id?: number
          wrong_answer_index?: number
          explanation?: string
          created_at?: string
        }
        Relationships: []
      }
      friends: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      leaderboard_entries: {
        Row: {
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          state: string
          total_xp: number
          weekly_xp: number
          current_league: string
          season_id: string
          rank: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      friend_leaderboard: {
        Row: {
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_xp: number
          weekly_xp: number
          current_league: string
          rank: number | null
          is_friend: boolean
        }
        Relationships: [
          {
            foreignKeyName: "friend_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      increment_weekly_xp: {
        Args: {
          user_id: string
          xp_amount: number
          max_per_call?: number
        }
        Returns: number
      }
      increment_xp: {
        Args: {
          user_id_param: string
          xp_amount: number
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type aliases for commonly used database types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Helper type for QuizSession
export type QuizSession = Tables<'quiz_sessions'>

// Helper type for Question with answers
export interface QuestionWithAnswers extends Tables<'questions'> {
  answers: Tables<'answers'>[]
}

// Helper type for UserAttempt with question and answers
export interface UserAttemptWithDetails extends Tables<'user_attempts'> {
  question: Tables<'questions'>
  selectedAnswer: Tables<'answers'> | null
}

// Helper type for Category with progress
export interface CategoryWithProgress extends Tables<'categories'> {
  questionsAnswered: number
  correctAnswers: number
  accuracy: number
}

// Helper types for League system
export type UserLeague = Tables<'user_leagues'>
export type LeagueSeason = Tables<'league_seasons'>
export type Friend = Tables<'friends'>

// View types (defined separately since they're views, not tables)
export interface LeaderboardEntry {
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  state: string
  total_xp: number
  weekly_xp: number
  current_league: string
  season_id: string
  rank: number | null
}

export interface FriendLeaderboard {
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  total_xp: number
  weekly_xp: number
  current_league: string
  rank: number | null
  is_friend: boolean
}

// League tier type
export type LeagueTier = "bronze" | "silver" | "gold" | "platinum" | "diamond"

// Friend status type
export type FriendStatus = "pending" | "accepted" | "blocked"
