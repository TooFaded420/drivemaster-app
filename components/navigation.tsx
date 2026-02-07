"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  Trophy, 
  User, 
  Settings,
  Car,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/quiz", label: "Quiz", icon: BookOpen },
  { href: "/leaderboard", label: "Rank", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

/**
 * Navigation - Legacy navigation component
 * 
 * NOTE: This component is being replaced by MobileNav and DesktopSidebar
 * for better separation of concerns and more responsive design.
 * 
 * @deprecated Use MobileNav and DesktopSidebar instead
 */
export function Navigation() {
  return null;
}

/**
 * MobileNavigation - Responsive mobile navigation with bottom bar and sheet menu
 */
export function MobileNavigation() {
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
      {/* Top Bar */}
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
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="font-semibold">Menu</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-40 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex flex-col items-center gap-1 h-14 touch-target-comfortable",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
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
 * DesktopNavigation - Sidebar navigation for desktop
 */
export function DesktopNavigation() {
  const pathname = usePathname();

  // Don't show navigation on landing page or auth pages
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
    <nav className="hidden md:flex flex-col w-64 h-screen bg-card border-r fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">DriveMaster</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  active && "bg-primary/10 text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
            <p className="text-xs text-muted-foreground">Level 1</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
