"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LeagueTier,
  LeaderboardEntry,
  FriendLeaderboard,
  UserLeague,
  LeagueSeason,
  Friend,
} from "@/types/database";
import {
  LEAGUE_ORDER,
  LeagueStanding,
  LeagueProgress,
  calculateLeagueProgress,
  atRiskOfDemotion,
  formatTimeUntilReset,
  generateMockLeaderboard,
} from "@/lib/gamification/leagues";

export type LeaderboardType = "global" | "friends" | "league" | "state";

interface LeaderboardState {
  entries: LeagueStanding[];
  userRank: number;
  userEntry: LeagueStanding | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseLeaderboardReturn {
  // Leaderboard data
  globalLeaderboard: LeaderboardState;
  friendsLeaderboard: LeaderboardState;
  leagueLeaderboard: LeaderboardState;
  stateLeaderboard: LeaderboardState;
  
  // User league data
  userLeague: UserLeague | null;
  currentSeason: LeagueSeason | null;
  leagueProgress: LeagueProgress | null;
  
  // Friends data
  friends: Friend[];
  pendingRequests: Friend[];
  
  // Actions
  refreshLeaderboard: (type: LeaderboardType) => Promise<void>;
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  acceptFriendRequest: (friendId: string) => Promise<void>;
  
  // League actions
  markPromotionShown: () => Promise<void>;
  markDemotionWarningShown: () => Promise<void>;
  
  // Utility
  timeUntilReset: string;
  isLoading: boolean;
}

/**
 * Hook for managing leaderboard data and league system
 */
export function useLeaderboard(): UseLeaderboardReturn {
  const supabase = createClient();
  const subscriptionsRef = useRef<(() => void)[]>([]);
  
  // Leaderboard states
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardState>({
    entries: [],
    userRank: 0,
    userEntry: null,
    isLoading: true,
    error: null,
  });
  
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardState>({
    entries: [],
    userRank: 0,
    userEntry: null,
    isLoading: true,
    error: null,
  });
  
  const [leagueLeaderboard, setLeagueLeaderboard] = useState<LeaderboardState>({
    entries: [],
    userRank: 0,
    userEntry: null,
    isLoading: true,
    error: null,
  });
  
  const [stateLeaderboard, setStateLeaderboard] = useState<LeaderboardState>({
    entries: [],
    userRank: 0,
    userEntry: null,
    isLoading: true,
    error: null,
  });
  
  // User league data
  const [userLeague, setUserLeague] = useState<UserLeague | null>(null);
  const [currentSeason, setCurrentSeason] = useState<LeagueSeason | null>(null);
  const [userState, setUserState] = useState<string>("Illinois");
  
  // Friends data
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  
  // Time tracking
  const [timeUntilReset, setTimeUntilReset] = useState<string>(formatTimeUntilReset());
  
  // Get current user
  const getCurrentUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }, [supabase]);
  
  // Fetch current season
  const fetchCurrentSeason = useCallback(async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("league_seasons")
      .select("*")
      .lte("week_start", now)
      .gte("week_end", now)
      .eq("is_active", true)
      .single();
    
    if (error) {
      console.error("Error fetching current season:", error);
      return null;
    }
    
    return data as LeagueSeason;
  }, [supabase]);
  
  // Fetch user's league data
  const fetchUserLeague = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_leagues")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      // If no record exists, create one
      if (error.code === "PGRST116") {
        const season = await fetchCurrentSeason();
        if (season) {
          const { data: newData, error: insertError } = await supabase
            .from("user_leagues")
            .insert({
              user_id: userId,
              current_league: "bronze",
              weekly_xp: 0,
              season_id: season.id,
            })
            .select()
            .single();
          
          if (insertError) {
            console.error("Error creating user league:", insertError);
            return null;
          }
          
          return newData as UserLeague;
        }
      }
      console.error("Error fetching user league:", error);
      return null;
    }
    
    return data as UserLeague;
  }, [supabase, fetchCurrentSeason]);
  
  // Fetch global leaderboard
  const fetchGlobalLeaderboard = useCallback(async (userId: string) => {
    try {
      setGlobalLeaderboard(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase
        .from("leaderboard_entries")
        .select("*")
        .order("weekly_xp", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      const entries = ((data as unknown as LeaderboardEntry[]) || []).map((entry, index) => ({
        userId: entry.user_id,
        username: entry.username,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        weeklyXP: entry.weekly_xp,
        totalXP: entry.total_xp,
        rank: entry.rank || index + 1,
        previousRank: null,
        isCurrentUser: entry.user_id === userId,
      }));
      
      const userEntry = entries.find(e => e.isCurrentUser) || null;
      const userRank = userEntry?.rank || 0;
      
      setGlobalLeaderboard({
        entries,
        userRank,
        userEntry,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setGlobalLeaderboard(prev => ({
        ...prev,
        isLoading: false,
        error: err as Error,
      }));
    }
  }, [supabase]);
  
  // Fetch friends leaderboard
  const fetchFriendsLeaderboard = useCallback(async (userId: string) => {
    try {
      setFriendsLeaderboard(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase
        .from("friend_leaderboard")
        .select("*")
        .eq("is_friend", true)
        .order("weekly_xp", { ascending: false });
      
      if (error) throw error;
      
      const entries = (data as FriendLeaderboard[] || []).map((entry, index) => ({
        userId: entry.user_id,
        username: entry.username,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        weeklyXP: entry.weekly_xp,
        totalXP: entry.total_xp,
        rank: entry.rank || index + 1,
        previousRank: null,
        isCurrentUser: entry.user_id === userId,
      }));
      
      const userEntry = entries.find(e => e.isCurrentUser) || null;
      const userRank = userEntry?.rank || 0;
      
      setFriendsLeaderboard({
        entries,
        userRank,
        userEntry,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setFriendsLeaderboard(prev => ({
        ...prev,
        isLoading: false,
        error: err as Error,
      }));
    }
  }, [supabase]);
  
  // Fetch league leaderboard
  const fetchLeagueLeaderboard = useCallback(async (userId: string, leagueTier: LeagueTier) => {
    try {
      setLeagueLeaderboard(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase
        .from("leaderboard_entries")
        .select("*")
        .eq("current_league", leagueTier)
        .order("weekly_xp", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      const entries = ((data as unknown as LeaderboardEntry[]) || []).map((entry, index) => ({
        userId: entry.user_id,
        username: entry.username,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        weeklyXP: entry.weekly_xp,
        totalXP: entry.total_xp,
        rank: entry.rank || index + 1,
        previousRank: null,
        isCurrentUser: entry.user_id === userId,
      }));
      
      const userEntry = entries.find(e => e.isCurrentUser) || null;
      const userRank = userEntry?.rank || 0;
      
      setLeagueLeaderboard({
        entries,
        userRank,
        userEntry,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setLeagueLeaderboard(prev => ({
        ...prev,
        isLoading: false,
        error: err as Error,
      }));
    }
  }, [supabase]);
  
  // Fetch state leaderboard
  const fetchStateLeaderboard = useCallback(async (userId: string, state: string) => {
    try {
      setStateLeaderboard(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase
        .from("leaderboard_entries")
        .select("*")
        .eq("state", state)
        .order("weekly_xp", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      const entries = ((data as unknown as LeaderboardEntry[]) || []).map((entry, index) => ({
        userId: entry.user_id,
        username: entry.username,
        displayName: entry.display_name,
        avatarUrl: entry.avatar_url,
        weeklyXP: entry.weekly_xp,
        totalXP: entry.total_xp,
        rank: entry.rank || index + 1,
        previousRank: null,
        isCurrentUser: entry.user_id === userId,
      }));
      
      const userEntry = entries.find(e => e.isCurrentUser) || null;
      const userRank = userEntry?.rank || 0;
      
      setStateLeaderboard({
        entries,
        userRank,
        userEntry,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setStateLeaderboard(prev => ({
        ...prev,
        isLoading: false,
        error: err as Error,
      }));
    }
  }, [supabase]);
  
  // Fetch friends list
  const fetchFriends = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq("status", "accepted");
    
    if (error) {
      console.error("Error fetching friends:", error);
      return;
    }
    
    setFriends(data as Friend[] || []);
  }, [supabase]);
  
  // Fetch pending friend requests
  const fetchPendingRequests = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .eq("friend_id", userId)
      .eq("status", "pending");
    
    if (error) {
      console.error("Error fetching pending requests:", error);
      return;
    }
    
    setPendingRequests(data as Friend[] || []);
  }, [supabase]);
  
  // Add friend
  const addFriend = useCallback(async (friendId: string) => {
    const user = await getCurrentUser();
    if (!user) return;
    
    const { error } = await supabase
      .from("friends")
      .insert({
        user_id: user.id,
        friend_id: friendId,
        status: "pending",
      });
    
    if (error) {
      console.error("Error adding friend:", error);
      throw error;
    }
    
    await fetchPendingRequests(user.id);
  }, [supabase, getCurrentUser, fetchPendingRequests]);
  
  // Remove friend
  const removeFriend = useCallback(async (friendId: string) => {
    const user = await getCurrentUser();
    if (!user) return;
    
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);
    
    if (error) {
      console.error("Error removing friend:", error);
      throw error;
    }
    
    await fetchFriends(user.id);
  }, [supabase, getCurrentUser, fetchFriends]);
  
  // Accept friend request
  const acceptFriendRequest = useCallback(async (friendId: string) => {
    const user = await getCurrentUser();
    if (!user) return;
    
    const { error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("user_id", friendId)
      .eq("friend_id", user.id);
    
    if (error) {
      console.error("Error accepting friend request:", error);
      throw error;
    }
    
    await fetchFriends(user.id);
    await fetchPendingRequests(user.id);
  }, [supabase, getCurrentUser, fetchFriends, fetchPendingRequests]);
  
  // Mark promotion as shown
  const markPromotionShown = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user || !userLeague) return;
    
    const { error } = await supabase
      .from("user_leagues")
      .update({ promotion_shown_at: new Date().toISOString() })
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error marking promotion shown:", error);
    }
  }, [supabase, getCurrentUser, userLeague]);
  
  // Mark demotion warning as shown
  const markDemotionWarningShown = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user || !userLeague) return;
    
    const { error } = await supabase
      .from("user_leagues")
      .update({ demotion_warning_shown_at: new Date().toISOString() })
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error marking demotion warning shown:", error);
    }
  }, [supabase, getCurrentUser, userLeague]);
  
  // Refresh specific leaderboard
  const refreshLeaderboard = useCallback(async (type: LeaderboardType) => {
    const user = await getCurrentUser();
    if (!user) return;
    
    switch (type) {
      case "global":
        await fetchGlobalLeaderboard(user.id);
        break;
      case "friends":
        await fetchFriendsLeaderboard(user.id);
        break;
      case "league":
        if (userLeague) {
          await fetchLeagueLeaderboard(user.id, userLeague.current_league as LeagueTier);
        }
        break;
      case "state":
        await fetchStateLeaderboard(user.id, userState);
        break;
    }
  }, [getCurrentUser, userLeague, userState, fetchGlobalLeaderboard, fetchFriendsLeaderboard, fetchLeagueLeaderboard, fetchStateLeaderboard]);
  
  // Calculate league progress
  const leagueProgress = userLeague && leagueLeaderboard.entries.length > 0
    ? calculateLeagueProgress(
        userLeague.current_league as LeagueTier,
        userLeague.weekly_xp,
        leagueLeaderboard.userRank,
        leagueLeaderboard.entries.length
      )
    : null;
  
  // Initialize data
  useEffect(() => {
    let isMounted = true;
    
    async function initialize() {
      const user = await getCurrentUser();
      if (!user || !isMounted) return;
      
      // Fetch user profile for state
      const { data: profile } = await supabase
        .from("profiles")
        .select("state")
        .eq("id", user.id)
        .single();
      
      if (profile?.state) {
        setUserState(profile.state);
      }
      
      // Fetch all data
      const season = await fetchCurrentSeason();
      if (isMounted) setCurrentSeason(season);
      
      const league = await fetchUserLeague(user.id);
      if (isMounted) setUserLeague(league);
      
      await Promise.all([
        fetchGlobalLeaderboard(user.id),
        fetchFriendsLeaderboard(user.id),
        league ? fetchLeagueLeaderboard(user.id, league.current_league as LeagueTier) : Promise.resolve(),
        fetchStateLeaderboard(user.id, profile?.state || "Illinois"),
        fetchFriends(user.id),
        fetchPendingRequests(user.id),
      ]);
    }
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Set up real-time subscriptions
  useEffect(() => {
    async function setupSubscriptions() {
      const user = await getCurrentUser();
      if (!user) return;
      
      // Subscribe to user_leagues changes
      const leagueSubscription = supabase
        .channel("user_leagues_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "user_leagues",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setUserLeague(payload.new as UserLeague);
          }
        )
        .subscribe();
      
      // Subscribe to friends changes
      const friendsSubscription = supabase
        .channel("friends_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "friends",
            filter: `or(user_id.eq.${user.id},friend_id.eq.${user.id})`,
          },
          () => {
            fetchFriends(user.id);
            fetchPendingRequests(user.id);
          }
        )
        .subscribe();
      
      subscriptionsRef.current.push(() => leagueSubscription.unsubscribe());
      subscriptionsRef.current.push(() => friendsSubscription.unsubscribe());
    }
    
    setupSubscriptions();
    
    return () => {
      subscriptionsRef.current.forEach(unsubscribe => unsubscribe());
      subscriptionsRef.current = [];
    };
  }, [supabase, getCurrentUser, fetchFriends, fetchPendingRequests]);
  
  // Update time until reset every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUntilReset(formatTimeUntilReset());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const isLoading = 
    globalLeaderboard.isLoading ||
    friendsLeaderboard.isLoading ||
    leagueLeaderboard.isLoading ||
    stateLeaderboard.isLoading;
  
  return {
    globalLeaderboard,
    friendsLeaderboard,
    leagueLeaderboard,
    stateLeaderboard,
    userLeague,
    currentSeason,
    leagueProgress,
    friends,
    pendingRequests,
    refreshLeaderboard,
    addFriend,
    removeFriend,
    acceptFriendRequest,
    markPromotionShown,
    markDemotionWarningShown,
    timeUntilReset,
    isLoading,
  };
}

/**
 * Hook for checking if user has pending promotion/demotion
 */
export function useLeagueChanges() {
  const supabase = createClient();
  const [hasPromotion, setHasPromotion] = useState(false);
  const [hasDemotionWarning, setHasDemotionWarning] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showDemotionWarningModal, setShowDemotionWarningModal] = useState(false);
  
  useEffect(() => {
    async function checkLeagueChanges() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: userLeague } = await supabase
        .from("user_leagues")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (!userLeague) return;
      
      // Check if promotion needs to be shown
      if (userLeague.last_week_rank && userLeague.last_week_league) {
        const currentLeague = userLeague.current_league;
        const lastWeekLeague = userLeague.last_week_league;
        
        if (LEAGUE_ORDER.indexOf(currentLeague as LeagueTier) > LEAGUE_ORDER.indexOf(lastWeekLeague as LeagueTier)) {
          if (!userLeague.promotion_shown_at) {
            setHasPromotion(true);
            setShowPromotionModal(true);
          }
        }
      }
      
      // Check for demotion warning
      const { data: season } = await supabase
        .from("league_seasons")
        .select("*")
        .eq("id", userLeague.season_id)
        .single();
      
      if (season) {
        const weekEnd = new Date(season.week_end);
        const now = new Date();
        const hoursUntilReset = (weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        // Show warning if less than 24 hours and at risk
        if (hoursUntilReset < 24 && hoursUntilReset > 0) {
          const { data: entries } = await supabase
            .from("leaderboard_entries")
            .select("*")
            .eq("current_league", userLeague.current_league)
            .order("weekly_xp", { ascending: false });
          
          if (entries) {
            const userEntry = entries.find(e => e.user_id === user.id);
            if (userEntry) {
              const rank = userEntry.rank || entries.findIndex(e => e.user_id === user.id) + 1;
              const isAtRisk = atRiskOfDemotion(
                userLeague.current_league as LeagueTier,
                userLeague.weekly_xp,
                rank,
                entries.length
              );
              
              if (isAtRisk && !userLeague.demotion_warning_shown_at) {
                setHasDemotionWarning(true);
                setShowDemotionWarningModal(true);
              }
            }
          }
        }
      }
    }
    
    checkLeagueChanges();
  }, [supabase]);
  
  return {
    hasPromotion,
    hasDemotionWarning,
    showPromotionModal,
    showDemotionWarningModal,
    setShowPromotionModal,
    setShowDemotionWarningModal,
  };
}

/**
 * Hook for mock leaderboard data (for testing/development)
 */
export function useMockLeaderboard(leagueTier: LeagueTier = "gold") {
  const [entries, setEntries] = useState<LeagueStanding[]>([]);
  
  useEffect(() => {
    // Generate mock data
    const mockData = generateMockLeaderboard(leagueTier, "current_user", 50);
    setEntries(mockData);
  }, [leagueTier]);
  
  return {
    entries,
    userRank: entries.find(e => e.isCurrentUser)?.rank || 0,
    userEntry: entries.find(e => e.isCurrentUser) || null,
  };
}
