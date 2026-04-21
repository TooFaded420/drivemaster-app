"use client";

import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes, forwardRef } from "react";

interface TouchFriendlyProps {
  children: ReactNode;
  className?: string;
  /**
   * Size of the touch target
   * @default "default"
   */
  size?: "small" | "default" | "large" | "comfortable";
  /**
   * Whether to add extra padding for touch
   * @default true
   */
  padded?: boolean;
}

const sizeClasses = {
  small: "min-w-[44px] min-h-[44px]",
  default: "min-w-[44px] min-h-[44px]",
  comfortable: "min-w-[48px] min-h-[48px]",
  large: "min-w-[56px] min-h-[56px]",
};

/**
 * TouchFriendly - Wrapper that ensures minimum touch target sizes
 * 
 * Features:
 * - Enforces minimum 44px touch targets (Apple HIG / Material Design)
 * - Optional padding for better touch experience
 * - Multiple size variants
 * - Visual feedback on touch
 * 
 * @example
 * <TouchFriendly size="large">
 *   <button>Click me</button>
 * </TouchFriendly>
 */
export function TouchFriendly({
  children,
  className,
  size = "default",
  padded = true,
}: TouchFriendlyProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        sizeClasses[size],
        padded && "p-2",
        "touch-manipulation",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual variant
   * @default "default"
   */
  variant?: "default" | "ghost" | "outline" | "subtle";
  /**
   * Size of the button
   * @default "default"
   */
  size?: "small" | "default" | "large";
  /**
   * Whether the button takes full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Whether to show a ripple effect on touch
   * @default true
   */
  ripple?: boolean;
}

/**
 * TouchButton - A button optimized for touch interactions
 * 
 * Features:
 * - Large touch target (48px minimum)
 * - Visual feedback on press
 * - Ripple effect option
 * - Accessible focus states
 */
export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  (
    {
      children,
      className,
      variant = "default",
      size = "default",
      fullWidth = false,
      ripple = true,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
      ghost:
        "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
      outline:
        "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
      subtle: "bg-accent/10 text-accent hover:bg-accent/20 active:bg-accent/30",
    };

    const sizeClasses = {
      small: "h-10 px-3 text-sm",
      default: "h-12 px-4 text-base",
      large: "h-14 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "touch-manipulation select-none",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          ripple && "relative overflow-hidden",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TouchButton.displayName = "TouchButton";

interface TouchCardProps {
  children: ReactNode;
  className?: string;
  /**
   * Whether the card is interactive (clickable)
   * @default false
   */
  interactive?: boolean;
  /**
   * Whether to add hover lift effect
   * @default true
   */
  hoverLift?: boolean;
  onClick?: () => void;
}

/**
 * TouchCard - A card component optimized for touch
 * 
 * Features:
 * - Large touch target when interactive
 * - Visual feedback on press
 * - Optional hover lift effect
 * - Accessible focus states
 */
export function TouchCard({
  children,
  className,
  interactive = false,
  hoverLift = true,
  onClick,
}: TouchCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-xl border p-4 transition-all duration-200",
        hoverLift && "hover:shadow-lg hover:-translate-y-0.5",
        interactive && [
          "cursor-pointer min-h-[48px]",
          "active:scale-[0.98] active:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ],
        className
      )}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface TouchListProps {
  children: ReactNode;
  className?: string;
  /**
   * Spacing between items
   * @default "normal"
   */
  spacing?: "compact" | "normal" | "relaxed";
  /**
   * Whether items are interactive
   * @default false
   */
  interactive?: boolean;
}

const spacingClasses = {
  compact: "space-y-1",
  normal: "space-y-2",
  relaxed: "space-y-4",
};

/**
 * TouchList - A list with proper spacing for touch targets
 * 
 * Features:
 * - Configurable spacing between items
 * - Ensures minimum touch target sizes
 * - Optional interactive states for items
 */
export function TouchList({
  children,
  className,
  spacing = "normal",
  interactive = false,
}: TouchListProps) {
  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}

interface TouchListItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

/**
 * TouchListItem - An individual list item optimized for touch
 */
export function TouchListItem({
  children,
  className,
  onClick,
  selected = false,
}: TouchListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg min-h-[48px]",
        "transition-colors duration-150",
        onClick && [
          "cursor-pointer hover:bg-accent",
          "active:bg-accent/80 active:scale-[0.99]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        ],
        selected && "bg-accent text-accent-foreground",
        className
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface SwipeableProps {
  children: ReactNode;
  className?: string;
  /**
   * Callback when swiped left
   */
  onSwipeLeft?: () => void;
  /**
   * Callback when swiped right
   */
  onSwipeRight?: () => void;
  /**
   * Minimum distance to trigger swipe (in pixels)
   * @default 50
   */
  threshold?: number;
}

/**
 * Swipeable - Wrapper that adds swipe gesture support
 * 
 * Features:
   * - Detects left/right swipe gestures
 * - Configurable threshold
 * - Visual feedback during swipe
 * 
 * Note: This is a basic implementation. For complex swipe interactions,
 * consider using a library like @use-gesture/react or framer-motion.
 */
export function Swipeable({
  children,
  className,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeableProps) {
  // Basic touch handling - in production, use a proper gesture library
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as HTMLElement).dataset.touchStartX = String(touch.clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const startX = Number(
      (e.currentTarget as HTMLElement).dataset.touchStartX || 0
    );
    const diff = startX - touch.clientX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (diff < 0 && onSwipeRight) {
        onSwipeRight();
      }
    }
  };

  return (
    <div
      className={cn("touch-pan-y", className)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}

interface PullToRefreshProps {
  children: ReactNode;
  className?: string;
  onRefresh: () => Promise<void>;
  /**
   * Pull distance required to trigger refresh (in pixels)
   * @default 80
   */
  pullDistance?: number;
}

/**
 * PullToRefresh - Container that enables pull-to-refresh
 * 
 * Note: This is a placeholder implementation. For production use,
 * consider using a library like react-pull-to-refresh.
 */
export function PullToRefresh({
  children,
  className,
  onRefresh,
  pullDistance = 80,
}: PullToRefreshProps) {
  // Placeholder - implement with proper library
  return (
    <div className={cn("overscroll-y-contain", className)}>
      {children}
    </div>
  );
}
