"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState, useRef, useCallback, useEffect } from "react";

interface SplitPaneProps {
  children: ReactNode;
  className?: string;
  /**
   * Initial split percentage (0-100)
   * @default 50
   */
  defaultSplit?: number;
  /**
   * Minimum size for left pane (in pixels)
   * @default 200
   */
  minLeft?: number;
  /**
   * Minimum size for right pane (in pixels)
   * @default 200
   */
  minRight?: number;
  /**
   * Callback when split changes
   */
  onSplitChange?: (split: number) => void;
}

/**
 * SplitPane - A resizable split pane layout for desktop
 * 
 * Features:
 * - Draggable divider to resize panes
 * - Minimum size constraints
 * - Smooth resizing
 * - Collapses to single column on mobile
 * 
 * @example
 * <SplitPane defaultSplit={60}>
 *   <SplitPaneLeft>
 *     <QuizQuestion />
 *   </SplitPaneLeft>
 *   <SplitPaneRight>
 *     <Explanation />
 *   </SplitPaneRight>
 * </SplitPane>
 */
export function SplitPane({
  children,
  className,
  defaultSplit = 50,
  minLeft = 200,
  minRight = 200,
  onSplitChange,
}: SplitPaneProps) {
  const [split, setSplit] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;

      // Calculate minimum percentages
      const minLeftPercent = (minLeft / rect.width) * 100;
      const minRightPercent = (minRight / rect.width) * 100;

      // Clamp the split
      const clampedSplit = Math.max(
        minLeftPercent,
        Math.min(100 - minRightPercent, percentage)
      );

      setSplit(clampedSplit);
      onSplitChange?.(clampedSplit);
    },
    [isDragging, minLeft, minRight, onSplitChange]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "hidden lg:flex h-full overflow-hidden",
        className
      )}
    >
      {/* Left Pane */}
      <div
        className="h-full overflow-auto"
        style={{ width: `${split}%` }}
      >
        {children && Array.isArray(children) ? children[0] : children}
      </div>

      {/* Divider */}
      <div
        className={cn(
          "w-1 bg-border hover:bg-primary cursor-col-resize transition-colors flex-shrink-0",
          isDragging && "bg-primary"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>

      {/* Right Pane */}
      <div
        className="h-full overflow-auto flex-1"
        style={{ width: `${100 - split}%` }}
      >
        {children && Array.isArray(children) ? children[1] : null}
      </div>
    </div>
  );
}

interface SplitPaneChildProps {
  children: ReactNode;
  className?: string;
}

/**
 * SplitPaneLeft - Left pane of the split layout
 */
export function SplitPaneLeft({ children, className }: SplitPaneChildProps) {
  return (
    <div className={cn("h-full", className)}>
      {children}
    </div>
  );
}

/**
 * SplitPaneRight - Right pane of the split layout
 */
export function SplitPaneRight({ children, className }: SplitPaneChildProps) {
  return (
    <div className={cn("h-full", className)}>
      {children}
    </div>
  );
}

/**
 * MobileSplitView - Shows panes as tabs on mobile, split on desktop
 */
interface MobileSplitViewProps {
  left: ReactNode;
  right: ReactNode;
  leftLabel: string;
  rightLabel: string;
  className?: string;
  defaultDesktopSplit?: number;
}

export function MobileSplitView({
  left,
  right,
  leftLabel,
  rightLabel,
  className,
  defaultDesktopSplit = 50,
}: MobileSplitViewProps) {
  const [activeTab, setActiveTab] = useState<"left" | "right">("left");

  return (
    <div className={cn("h-full", className)}>
      {/* Desktop: Split Pane */}
      <div className="hidden lg:block h-full">
        <SplitPane defaultSplit={defaultDesktopSplit}>
          <SplitPaneLeft>{left}</SplitPaneLeft>
          <SplitPaneRight>{right}</SplitPaneRight>
        </SplitPane>
      </div>

      {/* Mobile: Tabbed View */}
      <div className="lg:hidden h-full flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b bg-card">
          <button
            onClick={() => setActiveTab("left")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === "left"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {leftLabel}
          </button>
          <button
            onClick={() => setActiveTab("right")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeTab === "right"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {rightLabel}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === "left" ? left : right}
        </div>
      </div>
    </div>
  );
}
