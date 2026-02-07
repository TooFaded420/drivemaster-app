"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLeaderboard, useLeagueChanges } from "@/hooks/use-leaderboard";
import { useUser } from "@/hooks/use-user";
import {
  LeaderboardTable,
  LeagueBadge,
  WeeklyProgress,
  PromotionModal,
  DemotionWarningModal,
} from "@/components/leaderboard";
import {
  Trophy,
  Users,
  Globe,
  MapPin,
  Clock,
  Info,
  Share2,
  Sparkles,
} from "lucide-react";
import { LEAGUES, LEAGUE_COLORS } from "@/lib/gamification/leagues";

export default function LeaderboardPage() {
  const { profile } = useUser();
  const {
    globalLeaderboard,
    friendsLeaderboard,
    leagueLeaderboard,
    stateLeaderboard,
    userLeague,
    leagueProgress,
    timeUntilReset,
    isLoading,
    refreshLeaderboard,
  } = useLeaderboard();

  const {
    showPromotionModal,
    showDemotionWarningModal,
    setShowPromotionModal,
    setShowDemotionWarningModal,
  } = useLeagueChanges();

  const [activeTab, setActiveTab] = useState("league");

  const currentLeague = userLeague?.current_league
    ? LEAGUES[userLeague.current_league as keyof typeof LEAGUES]
    : null;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Compete with other drivers and climb the ranks!
            </p>
          </div>

          {/* Current League Badge */}
          {currentLeague && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <LeagueBadge
                tier={userLeague!.current_league as keyof typeof LEAGUES}
                size="md"
                showName
              />
            </motion.div>
          )}
        </div>

        {/* Weekly Reset Timer */}
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Weekly competition ends in:</span>
          <Badge variant="secondary" className="font-mono">
            {timeUntilReset}
          </Badge>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="league" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">League</span>
              </TabsTrigger>
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Global</span>
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Friends</span>
              </TabsTrigger>
              <TabsTrigger value="state" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="hidden sm:inline">State</span>
              </TabsTrigger>
            </TabsList>

            {/* League Tab */}
            <TabsContent value="league" className="mt-6">
              <LeaderboardTable
                entries={leagueLeaderboard.entries}
                title={`${currentLeague?.name || "League"} Leaderboard`}
                description={`Compete with other ${currentLeague?.name || "league"} drivers`}
                isLoading={isLoading}
                currentUserId={profile?.id}
              />
            </TabsContent>

            {/* Global Tab */}
            <TabsContent value="global" className="mt-6">
              <LeaderboardTable
                entries={globalLeaderboard.entries}
                title="Global Leaderboard"
                description="Top drivers from around the world"
                isLoading={isLoading}
                currentUserId={profile?.id}
              />
            </TabsContent>

            {/* Friends Tab */}
            <TabsContent value="friends" className="mt-6">
              <LeaderboardTable
                entries={friendsLeaderboard.entries}
                title="Friends Leaderboard"
                description="Compete with your friends"
                isLoading={isLoading}
                currentUserId={profile?.id}
              />
            </TabsContent>

            {/* State Tab */}
            <TabsContent value="state" className="mt-6">
              <LeaderboardTable
                entries={stateLeaderboard.entries}
                title={`${profile?.state || "Illinois"} Leaderboard`}
                description={`Top drivers in ${profile?.state || "Illinois"}`}
                isLoading={isLoading}
                currentUserId={profile?.id}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Progress Card */}
          {leagueProgress && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <WeeklyProgress
                progress={leagueProgress}
                timeUntilReset={timeUntilReset}
              />
            </motion.div>
          )}

          {/* League Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                League System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Compete weekly to earn XP and climb leagues. Top performers get
                promoted, while bottom performers may be demoted.
              </p>

              {/* League Tiers */}
              <div className="space-y-2">
                {Object.entries(LEAGUES).map(([tier, league]) => (
                  <div
                    key={tier}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      userLeague?.current_league === tier
                        ? "bg-primary/10 ring-1 ring-primary/30"
                        : "hover:bg-muted"
                    )}
                  >
                    <span className="text-xl">{league.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{league.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {league.minXP.toLocaleString()}+
                        {league.maxXP ? ` - ${league.maxXP.toLocaleString()}` : "+"} XP
                      </p>
                    </div>
                    {userLeague?.current_league === tier && (
                      <Badge variant="default" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => refreshLeaderboard(activeTab as any)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Refresh Leaderboard
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Rank
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {userLeague && (
        <>
          <PromotionModal
            isOpen={showPromotionModal}
            onClose={() => setShowPromotionModal(false)}
            previousLeague={userLeague.last_week_league as keyof typeof LEAGUES || "bronze"}
            currentLeague={userLeague.current_league as keyof typeof LEAGUES}
            finalRank={userLeague.last_week_rank || 1}
            weeklyXP={userLeague.weekly_xp}
          />
          <DemotionWarningModal
            isOpen={showDemotionWarningModal}
            onClose={() => setShowDemotionWarningModal(false)}
            currentLeague={userLeague.current_league as keyof typeof LEAGUES}
            currentRank={leagueLeaderboard.userRank}
            totalParticipants={leagueLeaderboard.entries.length}
            xpNeeded={leagueProgress?.xpToDemotion || 0}
          />
        </>
      )}
    </div>
  );
}
