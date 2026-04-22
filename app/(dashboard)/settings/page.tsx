import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsConsentToggle } from "@/components/analytics-consent-toggle";
import { Shield, Bell, User } from "lucide-react";

export const metadata = {
  title: "Settings — DriveMaster",
};

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Account */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Account</CardTitle>
          </div>
          <CardDescription>Your profile and account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Profile management coming soon.</p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
          <CardDescription>Control streak reminders and study nudges.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Notification preferences coming soon.</p>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Privacy</CardTitle>
          </div>
          <CardDescription>Control what data you share with us.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsConsentToggle />
        </CardContent>
      </Card>
    </div>
  );
}
