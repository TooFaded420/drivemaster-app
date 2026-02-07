"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "small" | "large" | "full";
  padding?: "none" | "xs" | "sm" | "md" | "lg";
}

const sizeClasses = {
  default: "max-w-7xl",
  small: "max-w-4xl",
  large: "max-w-[1600px]",
  full: "max-w-none",
};

const paddingClasses = {
  none: "px-0",
  xs: "px-3 sm:px-4",
  sm: "px-4 sm:px-6",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-4 sm:px-8 lg:px-12 xl:px-16",
};

/**
 * ResponsiveContainer - A container that adapts to different screen sizes
 * 
 * Features:
 * - Fluid width with max-width constraints
 * - Responsive padding that adjusts per breakpoint
 * - Multiple size variants for different content types
 * - Mobile-first design with progressive enhancement
 */
export function ResponsiveContainer({
  children,
  className,
  size = "default",
  padding = "md",
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveSectionProps {
  children: ReactNode;
  className?: string;
  spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

const spacingClasses = {
  none: "py-0",
  xs: "py-3 sm:py-4",
  sm: "py-4 sm:py-6",
  md: "py-6 sm:py-8 lg:py-12",
  lg: "py-8 sm:py-12 lg:py-16 xl:py-20",
  xl: "py-12 sm:py-16 lg:py-24 xl:py-32",
};

/**
 * ResponsiveSection - A section wrapper with responsive vertical spacing
 */
export function ResponsiveSection({
  children,
  className,
  spacing = "md",
}: ResponsiveSectionProps) {
  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg";
}

const gapClasses = {
  none: "gap-0",
  xs: "gap-2 sm:gap-3",
  sm: "gap-3 sm:gap-4",
  md: "gap-4 sm:gap-5 lg:gap-6",
  lg: "gap-5 sm:gap-6 lg:gap-8",
};

/**
 * ResponsiveGrid - A grid that adapts columns based on screen size
 */
export function ResponsiveGrid({
  children,
  className,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  gap = "md",
}: ResponsiveGridProps) {
  const gridCols = [
    columns.xs && `grid-cols-${columns.xs}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("grid", gridCols, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: ReactNode;
  className?: string;
  direction?: {
    default?: "row" | "col";
    sm?: "row" | "col";
    md?: "row" | "col";
    lg?: "row" | "col";
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
}

/**
 * ResponsiveStack - A flex container that changes direction responsively
 */
export function ResponsiveStack({
  children,
  className,
  direction = { default: "col", md: "row" },
  gap = "md",
  align = "stretch",
  justify = "start",
}: ResponsiveStackProps) {
  const directionClasses = [
    direction.default === "row" ? "flex-row" : "flex-col",
    direction.sm && (direction.sm === "row" ? "sm:flex-row" : "sm:flex-col"),
    direction.md && (direction.md === "row" ? "md:flex-row" : "md:flex-col"),
    direction.lg && (direction.lg === "row" ? "lg:flex-row" : "lg:flex-col"),
  ]
    .filter(Boolean)
    .join(" ");

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };

  return (
    <div
      className={cn(
        "flex",
        directionClasses,
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}
