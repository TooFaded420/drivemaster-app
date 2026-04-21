"use client";

// ============================================
// AnalyticsConsentToggle
// User-facing toggle for opting in/out of anonymous analytics.
//
// TODO: Mount this component inside app/(settings)/settings/page.tsx
// once the settings route is created. Example:
//   import { AnalyticsConsentToggle } from "@/components/analytics-consent-toggle";
//   <AnalyticsConsentToggle />
// ============================================

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAnalyticsConsent } from "@/lib/providers/analytics-consent";

export function AnalyticsConsentToggle() {
  const { consent, grant, deny } = useAnalyticsConsent();

  const isChecked = consent === "granted";

  function handleChange(checked: boolean) {
    if (checked) {
      grant();
    } else {
      deny();
    }
  }

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-4">
      <Switch
        id="analytics-consent"
        checked={isChecked}
        onCheckedChange={handleChange}
        aria-label="Toggle anonymous analytics sharing"
      />
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="analytics-consent"
          className="font-medium cursor-pointer"
        >
          Share anonymous usage data
        </Label>
        <p className="text-sm text-muted-foreground">
          Help us improve DriveMaster — share anonymous usage data. Stays off
          for anyone under 16.
        </p>
      </div>
    </div>
  );
}
