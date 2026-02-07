"use client";

import { Navigation } from "./navigation";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main content area */}
      <main className="md:ml-64 min-h-screen">
        {/* Mobile padding for top and bottom nav */}
        <div className="pt-16 md:pt-0 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
