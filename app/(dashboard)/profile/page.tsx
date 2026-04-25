import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import { Dash } from "@/components/mascot";
import { ArrowLeft, User } from "lucide-react";

export const metadata = {
  title: "Profile — Ace Your Permit",
};

export default function ProfilePage() {
  return (
    <MobileLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Your driver identity on Ace Your Permit.</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Profile coming soon</CardTitle>
            </div>
            <CardDescription>
              We&apos;re still building this page. Check back soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-6">
            <Dash emotion="thinking" size="lg" animate={true} />
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}
