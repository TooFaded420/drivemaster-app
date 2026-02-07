"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeaderboard } from "@/hooks/use-leaderboard";
// import { MiniLeagueBadge } from "./league-badge";
import {
  Users,
  UserPlus,
  UserMinus,
  Check,
  X,
  Search,
} from "lucide-react";
// Dropdown menu component - will be created if needed
// For now, using simple buttons

interface FriendsListProps {
  className?: string;
}

export function FriendsList({ className }: FriendsListProps) {
  const {
    friends,
    pendingRequests,
    addFriend,
    removeFriend,
    acceptFriendRequest,
  } = useLeaderboard();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends");

  // Filter friends based on search
  const filteredFriends = friends.filter(
    (friend) =>
      friend.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.friend_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Friends
          {pendingRequests.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingRequests.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="friends">
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({pendingRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Friends List */}
          <TabsContent value="friends" className="mt-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Friends */}
            <div className="space-y-2">
              <AnimatePresence>
                {filteredFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FriendCard
                      friend={friend}
                      onRemove={() => removeFriend(friend.friend_id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredFriends.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No friends yet</p>
                  <p className="text-sm">Add friends to compare progress!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Pending Requests */}
          <TabsContent value="requests" className="mt-4">
            <div className="space-y-2">
              <AnimatePresence>
                {pendingRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FriendRequestCard
                      request={request}
                      onAccept={() => acceptFriendRequest(request.user_id)}
                      onDecline={() => removeFriend(request.user_id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Check className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface FriendCardProps {
  friend: {
    id: string;
    user_id: string;
    friend_id: string;
    status: string;
  };
  onRemove: () => void;
}

function FriendCard({ friend, onRemove }: FriendCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <Avatar className="w-10 h-10">
        <AvatarImage />
        <AvatarFallback className="bg-primary/10 text-primary">
          {friend.friend_id[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{friend.friend_id}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Gold League</span>
          <span>•</span>
          <span>2,450 XP</span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={onRemove}
        title="Remove Friend"
      >
        <UserMinus className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface FriendRequestCardProps {
  request: {
    id: string;
    user_id: string;
    friend_id: string;
  };
  onAccept: () => void;
  onDecline: () => void;
}

function FriendRequestCard({ request, onAccept, onDecline }: FriendRequestCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
      <Avatar className="w-10 h-10">
        <AvatarImage />
        <AvatarFallback className="bg-primary/10 text-primary">
          {request.user_id[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{request.user_id}</p>
        <p className="text-xs text-muted-foreground">Wants to be your friend</p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={onAccept}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onDecline}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface AddFriendDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFriendDialog({ isOpen, onClose }: AddFriendDialogProps) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addFriend } = useLeaderboard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await addFriend(username);
      setUsername("");
      onClose();
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-lg p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Add Friend
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Username or Email
            </label>
            <Input
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!username.trim() || isLoading}
            >
              {isLoading ? "Adding..." : "Add Friend"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
