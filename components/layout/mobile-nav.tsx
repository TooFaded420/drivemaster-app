"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Trophy, User, Car, Menu, X, Settings } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home, shortcut: "1" },
  { href: "/quiz", label: "Quiz", icon: BookOpen, shortcut: "2" },
  { href: "/leaderboard", label: "Rank", icon: Trophy, shortcut: "3" },
  { href: "/profile", label: "Profile", icon: User, shortcut: "4" },
];

/**
 * MobileNav - Bottom navigation bar for mobile devices
 * 
 * Features:
 * - Fixed bottom position with safe area insets
 * - Touch-optimized buttons (min 44px)
 * - Active state indication
 * - Sheet menu for additional options
 * - Haptic feedback support
 */
export function MobileNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't show navigation on landing page or auth pages
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/onboarding")) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar - Fixed on mobile */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-background/95 backdrop-blur-md border-b z-40 md:hidden safe-area-top">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">DriveMaster</span>
          </Link>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="touch-target">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Access navigation links and settings
              </SheetDescription>
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="font-semibold">Menu</span>
                </div>

                {/* Menu Items */}
                <nav aria-label="Main" className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                      >
                        <Button
                          variant={active ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start gap-3 h-12 touch-target-comfortable",
                            active && "bg-primary/10 text-primary"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                          <kbd className="ml-auto text-xs bg-muted px-2 py-1 rounded">
                            ⌘{item.shortcut}
                          </kbd>
                        </Button>
                      </Link>
                    );
                  })}

                  <div className="my-4 border-t" />

                  <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 touch-target-comfortable"
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </Button>
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Bottom Navigation - Fixed on mobile */}
      <nav aria-label="Main" className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-40 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1"
                aria-current={active ? "page" : undefined}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex flex-col items-center gap-1 h-14 touch-target-comfortable",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

/**
 * MobileContent - Wrapper that adds proper padding for mobile nav
 */
export function MobileContent({
  children,
  className,
  fullScreen = false,
}: {
  children: React.ReactNode;
  className?: string;
  fullScreen?: boolean;
}) {
  if (fullScreen) {
    return (
      <div className={cn("md:hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <main
      className={cn(
        "md:hidden pt-14 pb-20 min-h-screen",
        className
      )}
    >
      {children}
    </main>
  );
}
