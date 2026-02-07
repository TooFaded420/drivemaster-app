"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AdaptiveGridProps {
  children: ReactNode;
  className?: string;
  /**
   * Minimum width for each item before wrapping
   * @default "250px"
   */
  minItemWidth?: string;
  /**
   * Gap between items
   * @default "gap-4"
   */
  gap?: "gap-2" | "gap-3" | "gap-4" | "gap-5" | "gap-6" | "gap-8";
  /**
   * Maximum number of columns
   * @default unlimited
   */
  maxColumns?: number;
}

/**
 * AdaptiveGrid - A grid that automatically adjusts columns based on available space
 * 
 * Features:
 * - Uses CSS Grid with auto-fit and minmax for responsive behavior
 * - No media queries needed - automatically adapts
 * - Configurable minimum item width
 * - Consistent gap spacing
 * 
 * @example
 * <AdaptiveGrid minItemWidth="300px" gap="gap-6">
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </AdaptiveGrid>
 */
export function AdaptiveGrid({
  children,
  className,
  minItemWidth = "250px",
  gap = "gap-4",
  maxColumns,
}: AdaptiveGridProps) {
  return (
    <div
      className={cn("grid", gap, className)}
      style={{
        gridTemplateColumns: maxColumns
          ? `repeat(${maxColumns}, minmax(${minItemWidth}, 1fr))`
          : `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "gap-2" | "gap-3" | "gap-4" | "gap-5" | "gap-6";
}

/**
 * MasonryGrid - A masonry-style grid layout
 * 
 * Uses CSS columns for true masonry effect where items can have different heights
 */
export function MasonryGrid({
  children,
  className,
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = "gap-4",
}: MasonryGridProps) {
  const columnClasses = [
    columns.default && `columns-${columns.default}`,
    columns.sm && `sm:columns-${columns.sm}`,
    columns.md && `md:columns-${columns.md}`,
    columns.lg && `lg:columns-${columns.lg}`,
    columns.xl && `xl:columns-${columns.xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cn(
        columnClasses,
        gap.replace("gap", "space-y"),
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

/**
 * BentoGrid - A bento box style grid layout
 * 
 * Features:
 * - Predefined grid areas for featured content
 * - Responsive layout that adapts to screen size
 * - Perfect for dashboards and feature showcases
 */
export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide" | "tall" | "large";
}

/**
 * BentoItem - An item within a BentoGrid
 * 
 * @param size - Controls how many grid cells the item spans
 * - default: 1x1
 * - wide: 2x1
 * - tall: 1x2
 * - large: 2x2
 */
export function BentoItem({
  children,
  className,
  size = "default",
}: BentoItemProps) {
  const sizeClasses = {
    default: "",
    wide: "md:col-span-2",
    tall: "md:row-span-2",
    large: "md:col-span-2 md:row-span-2",
  };

  return (
    <div
      className={cn(
        "bg-card rounded-xl border p-4 overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ListGridProps {
  children: ReactNode;
  className?: string;
  /**
   * View mode - switches between list and grid
   */
  view?: "list" | "grid";
  /**
   * Number of columns in grid mode
   */
  gridColumns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

/**
 * ListGrid - A component that can switch between list and grid views
 * 
 * Useful for user-toggleable view modes
 */
export function ListGrid({
  children,
  className,
  view = "grid",
  gridColumns = { sm: 2, md: 3, lg: 4 },
}: ListGridProps) {
  if (view === "list") {
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {children}
      </div>
    );
  }

  const gridCols = [
    gridColumns.sm && `sm:grid-cols-${gridColumns.sm}`,
    gridColumns.md && `md:grid-cols-${gridColumns.md}`,
    gridColumns.lg && `lg:grid-cols-${gridColumns.lg}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("grid grid-cols-1", gridCols, "gap-4", className)}>
      {children}
    </div>
  );
}
