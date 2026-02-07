"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeagueStanding } from "@/lib/gamification/leagues";
import { LeaderboardRow, CompactLeaderboardRow } from "./leaderboard-row";
import { TopThreePodium, CompactTopThree } from "./top-three-podium";
import { Search, ChevronDown, ChevronUp, Users, Globe, MapPin, Trophy } from "lucide-react";

interface LeaderboardTableProps {
  entries: LeagueStanding[];
  title: string;
  description?: string;
  showPodium?: boolean;
  showSearch?: boolean;
  compact?: boolean;
  className?: string;
  currentUserId?: string;
  isLoading?: boolean;
}

export function LeaderboardTable({
  entries,
  title,
  description,
  showPodium = true,
  showSearch = true,
  compact = false,
  className,
  currentUserId,
  isLoading = false,
}: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<"top" | "all">("top");

  // Filter entries based on search
  const filteredEntries = searchQuery
    ? entries.filter(
        (entry) =>
          entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  // Get top 3 and rest
  const topThree = filteredEntries.slice(0, 3);
  const restEntries = filteredEntries.slice(3);

  // Get current user entry
  const currentUserEntry = entries.find((e) => e.isCurrentUser);

  // Determine how many to show
  const displayEntries = showAll ? restEntries : restEntries.slice(0, 10);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Top 3 Compact */}
          <CompactTopThree entries={topThree} />

          {/* Current User Position */}
          {currentUserEntry && currentUserEntry.rank > 3 && (
            <div className="pt-2 border-t">
              <CompactLeaderboardRow
                entry={currentUserEntry}
                isCurrentUser={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {title}
            </CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>

          {/* View Toggle */}
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "top" | "all")}
          >
            <TabsList>
              <TabsTrigger value="top">Top 10</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Podium for Top 3 */}
        {showPodium && viewMode === "top" && !searchQuery && (
          <TopThreePodium entries={topThree} />
        )}

        {/* Rest of Leaderboard */}
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground border-b">
            <span className="w-10">Rank</span>
            <span className="w-8"></span>
            <span className="flex-1">User</span>
            <span className="text-right">Weekly XP</span>
          </div>

          {/* Entries */}
          <AnimatePresence>
            {displayEntries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <LeaderboardRow
                  entry={entry}
                  isCurrentUser={entry.userId === currentUserId}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Current User (if not in displayed entries) */}
          {currentUserEntry &&
            !displayEntries.some((e) => e.userId === currentUserEntry.userId) && (
              <>
                <div className="py-2 text-center">
                  <span className="text-muted-foreground">...</span>
                </div>
                <LeaderboardRow
                  entry={currentUserEntry}
                  isCurrentUser={true}
                />
              </>
            )}

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No users found</p>
            </div>
          )}
        </div>

        {/* Show More/Less */}
        {restEntries.length > 10 && viewMode === "top" && !searchQuery && (
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show {restEntries.length - 10} More
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface TabbedLeaderboardProps {
  globalEntries: LeagueStanding[];
  friendsEntries: LeagueStanding[];
  leagueEntries: LeagueStanding[];
  stateEntries: LeagueStanding[];
  currentUserId?: string;
  stateName?: string;
  className?: string;
}

export function TabbedLeaderboard({
  globalEntries,
  friendsEntries,
  leagueEntries,
  stateEntries,
  currentUserId,
  stateName = "Your State",
  className,
}: TabbedLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<"global" | "friends" | "league" | "state">("league");

  const tabs = [
    { id: "global" as const, label: "Global", icon: Globe, entries: globalEntries },
    { id: "friends" as const, label: "Friends", icon: Users, entries: friendsEntries },
    { id: "league" as const, label: "League", icon: Trophy, entries: leagueEntries },
    { id: "state" as const, label: stateName, icon: MapPin, entries: stateEntries },
  ];

  const activeEntries = tabs.find((t) => t.id === activeTab)?.entries || [];
  const ActiveIcon = tabs.find((t) => t.id === activeTab)?.icon || Trophy;

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Leaderboard Content */}
      <LeaderboardTable
        entries={activeEntries}
        title={tabs.find((t) => t.id === activeTab)?.label || "Leaderboard"}
        description={`Compete with ${activeTab === "global" ? "drivers worldwide" : activeTab === "friends" ? "your friends" : activeTab === "league" ? "your league" : `drivers in ${stateName}`}`}
        currentUserId={currentUserId}
      />
    </div>
  );
}
