"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Profile type
interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  state: string;
  test_type: string;
  test_date: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  onboarding_data: unknown;
}

// UserStats type
interface UserStats {
  user_id: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_freezes: number;
  miles_currency: number;
}

interface UserData {
  profile: Profile | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: Error | null;
}

export function useUser() {
  const [data, setData] = useState<UserData>({
    profile: null,
    stats: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setData({
            profile: null,
            stats: null,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Load profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Load stats
        const { data: stats, error: statsError } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (statsError) throw statsError;

        setData({
          profile,
          stats,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setData({
          profile: null,
          stats: null,
          isLoading: false,
          error: error as Error,
        });
      }
    }

    loadUserData();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUserData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return data;
}
