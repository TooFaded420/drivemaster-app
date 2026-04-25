"use client";

// AnalyticsConsentToggle
// User-facing toggle for opting in/out of anonymous analytics.
// Mounted in app/(dashboard)/settings/page.tsx under the Privacy card.
//
// Note: The "under 16" eligibility line was removed because COPPA-grade
// age-verification enforcement is not yet implemented. Showing it would
// create a false sense of protection. Revisit when age-gate lands.

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
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="analytics-consent"
          className="font-medium cursor-pointer"
        >
          Share anonymous usage data
        </Label>
        <p className="text-sm text-muted-foreground">
          Help us make Ace Your Permit better by sharing which screens work and
          which don&apos;t.
        </p>
        <p className="text-xs text-muted-foreground">
          No names, no answers — just clicks and timing.
        </p>
        <a
          href="/privacy"
          className="text-xs underline text-blue-600 w-fit"
        >
          See what we collect →
        </a>
      </div>
    </div>
  );
}
