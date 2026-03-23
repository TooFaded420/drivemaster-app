import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <DesktopSidebar />
      <MobileNav />
      <div className="md:pl-16 lg:pl-64">
        {children}
      </div>
    </>
  );
}
