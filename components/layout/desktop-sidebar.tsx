"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  BookOpen,
  Trophy,
  User,
  Car,
  Settings,
  ChevronLeft,
  ChevronRight,
  Keyboard,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, shortcut: "D" },
  { href: "/quiz", label: "Practice Quiz", icon: BookOpen, shortcut: "Q" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, shortcut: "L" },
  { href: "/profile", label: "Profile", icon: User, shortcut: "P" },
];

interface DesktopSidebarProps {
  className?: string;
  defaultCollapsed?: boolean;
}

/**
 * DesktopSidebar - Collapsible sidebar for desktop navigation
 * 
 * Features:
 * - Collapsible to icon-only mode
 * - Keyboard shortcuts for navigation
 * - Tooltips for collapsed state
 * - Smooth transitions
 * - Persistent state in localStorage
 */
export function DesktopSidebar({
  className,
  defaultCollapsed = false,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  // Save collapsed state
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts with Alt/Cmd key
      if (!(e.altKey || e.metaKey)) return;

      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          toggleCollapsed();
          break;
        case "d":
          e.preventDefault();
          window.location.href = "/dashboard";
          break;
        case "q":
          e.preventDefault();
          window.location.href = "/quiz";
          break;
        case "l":
          e.preventDefault();
          window.location.href = "/leaderboard";
          break;
        case "p":
          e.preventDefault();
          window.location.href = "/profile";
          break;
        case "/":
          e.preventDefault();
          setShowShortcuts(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapsed]);

  // Hide on mobile
  if (isMobile) return null;

  // Don't show on landing page or auth pages
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/onboarding")
  ) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r z-40 transition-all duration-300 ease-in-out hidden md:flex flex-col",
          collapsed ? "w-[72px]" : "w-64",
          className
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 transition-all duration-300",
              collapsed && "justify-center w-full"
            )}
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Car className="w-6 h-6 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-bold text-xl whitespace-nowrap overflow-hidden">
                Ace Your Permit
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav aria-label="Main" className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            const NavButton = (
              <Button
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full transition-all duration-300",
                  collapsed ? "justify-center px-2" : "justify-start gap-3",
                  active && "bg-primary/10 text-primary",
                  "h-11"
                )}
                asChild
              >
                <Link href={item.href} aria-current={active ? "page" : undefined}>
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && (
                    <span className="whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                  {!collapsed && (
                    <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded hidden lg:inline-block">
                      ⌘{item.shortcut}
                    </kbd>
                  )}
                </Link>
              </Button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.label}
                    <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      ⌘{item.shortcut}
                    </kbd>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{NavButton}</div>;
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t space-y-1">
          {/* Settings */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-center px-2 h-11"
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="w-5 h-5" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11"
              asChild
            >
              <Link href="/settings">
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </Button>
          )}

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full h-11",
              collapsed ? "justify-center px-2" : "justify-start gap-3"
            )}
            onClick={toggleCollapsed}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm">Collapse</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded hidden lg:inline-block">
                  ⌘B
                </kbd>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Keyboard className="w-5 h-5" />
                Keyboard Shortcuts
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    {item.label}
                  </span>
                  <kbd className="text-xs bg-muted px-2 py-1 rounded">
                    ⌘{item.shortcut}
                  </kbd>
                </div>
              ))}
              <div className="flex items-center justify-between py-2 border-b">
                <span>Toggle Sidebar</span>
                <kbd className="text-xs bg-muted px-2 py-1 rounded">⌘B</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}

// Import X icon
import { X } from "lucide-react";

/**
 * DesktopContent - Wrapper that adds proper padding for desktop sidebar
 */
export function DesktopContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className="hidden md:block">{children}</div>;
  }

  return (
    <main
      className={cn(
        "hidden md:block min-h-screen transition-all duration-300",
        className
      )}
      style={{
        marginLeft: "var(--sidebar-width, 16rem)",
      }}
    >
      {children}
    </main>
  );
}
