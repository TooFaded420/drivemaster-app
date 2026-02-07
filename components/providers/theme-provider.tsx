"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
  systemTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
  systemTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "drivemaster-theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage or default
  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    const initialTheme = savedTheme || defaultTheme;

    setThemeState(initialTheme);

    // Get system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const systemPrefersDark = mediaQuery.matches;
    setSystemTheme(systemPrefersDark ? "dark" : "light");

    // Determine resolved theme
    const resolved =
      initialTheme === "system"
        ? systemPrefersDark
          ? "dark"
          : "light"
        : initialTheme;

    setResolvedTheme(resolved);

    // Apply theme to document
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
    } else {
      root.setAttribute(attribute, resolved);
    }

    // Handle transition disabling
    if (disableTransitionOnChange) {
      const css = document.createElement("style");
      css.textContent =
        "*, *::before, *::after { transition: none !important; }";
      document.head.appendChild(css);

      requestAnimationFrame(() => {
        document.head.removeChild(css);
      });
    }

    setMounted(true);

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);

      if (theme === "system") {
        setResolvedTheme(newSystemTheme);
        if (attribute === "class") {
          root.classList.remove("light", "dark");
          root.classList.add(newSystemTheme);
        } else {
          root.setAttribute(attribute, newSystemTheme);
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [defaultTheme, storageKey, attribute, disableTransitionOnChange, theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);

    const root = window.document.documentElement;
    const resolved =
      newTheme === "system"
        ? systemTheme
        : newTheme;

    setResolvedTheme(resolved);

    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
    } else {
      root.setAttribute(attribute, resolved);
    }

    // Handle transition disabling
    if (disableTransitionOnChange) {
      const css = document.createElement("style");
      css.textContent =
        "*, *::before, *::after { transition: none !important; }";
      document.head.appendChild(css);

      requestAnimationFrame(() => {
        document.head.removeChild(css);
      });
    }
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('${storageKey}') || '${defaultTheme}';
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
                document.documentElement.classList.add(resolved);
              })();
            `,
          }}
        />
        <div style={{ visibility: "hidden" }}>{children}</div>
      </>
    );
  }

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme,
        resolvedTheme,
        systemTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
