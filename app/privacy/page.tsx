export const metadata = {
  title: "Privacy Policy — DriveMaster",
};

export default function PrivacyPage() {
  return (
    <main className="prose mx-auto p-8 max-w-2xl">
      <div className="bg-yellow-100 p-4 rounded mb-8 not-prose">
        <p className="text-sm font-medium text-yellow-900">
          Draft — replace before launch.
        </p>
      </div>

      <h1>Privacy Policy (draft)</h1>

      <h2>What we collect when you opt in</h2>
      <p>
        When you enable anonymous usage sharing, we collect page views, feature
        interactions, and session timing. No personally identifiable information
        is attached to these events.
      </p>

      <h2>What we never collect</h2>
      <ul>
        <li>Your name or email address in analytics events</li>
        <li>The specific answers you give to quiz questions</li>
        <li>Device identifiers or precise location</li>
      </ul>

      <h2>Sub-processors: PostHog, Microsoft Clarity</h2>
      <p>
        Anonymous usage data is processed by PostHog and Microsoft Clarity.
        Both operate under standard data processing agreements. No data is sold
        to third parties.
      </p>

      <h2>How to revoke consent</h2>
      <p>
        Go to{" "}
        <a href="/settings" className="text-blue-600 underline">
          Settings → Privacy
        </a>{" "}
        and toggle off &quot;Share anonymous usage data.&quot; Revocation takes
        effect immediately; previously collected data is not retroactively
        deleted.
      </p>
    </main>
  );
}
