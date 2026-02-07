"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

/**
 * ThemeToggle - A button to toggle between light, dark, and system themes
 * 
 * Features:
 * - Dropdown menu with all theme options
 * - Visual indicators for current theme
 * - Keyboard accessible
 * - Respects system preference
 */
export function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const Icon = icons[theme === "system" ? resolvedTheme : theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "relative touch-target",
            showLabel && "gap-2 px-3",
            className
          )}
          aria-label="Toggle theme"
        >
          <Icon className="h-5 w-5 transition-all" />
          {showLabel && (
            <span className="capitalize">{theme}</span>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "gap-2 cursor-pointer",
            theme === "light" && "bg-accent"
          )}
        >
          <Sun className="h-4 w-4" />
          Light
          {theme === "light" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "gap-2 cursor-pointer",
            theme === "dark" && "bg-accent"
          )}
        >
          <Moon className="h-4 w-4" />
          Dark
          {theme === "dark" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "gap-2 cursor-pointer",
            theme === "system" && "bg-accent"
          )}
        >
          <Monitor className="h-4 w-4" />
          System
          {theme === "system" && (
            <span className="ml-auto text-xs text-muted-foreground">✓</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * SimpleThemeToggle - A simple toggle between light and dark (no system option)
 */
export function SimpleThemeToggle({
  className,
  variant = "ghost",
  size = "icon",
}: Omit<ThemeToggleProps, "showLabel">) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={cn("relative touch-target", className)}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
