export const metadata = {
  title: "Privacy Policy — DriveMaster",
  description: "How DriveMaster collects, uses, and protects your data. Written for teens and parents.",
};

const LAST_UPDATED = "2026-04-21";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display tracking-tight">
            Privacy Policy
          </h1>
          {/* Friendly summary — Dash tone */}
          <p className="text-lg text-orange-600 font-semibold mb-3">
            Short version: we track your quiz progress to help you pass the test. That&apos;s it. Analytics are off unless you turn them on.
          </p>
          <p className="text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-gray-700 leading-relaxed">

        {/* 1 — Who we are */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            1. Who we are
          </h2>
          <p>
            DriveMaster is a free Illinois driving-test prep app built for teens aged 15–17.
            We help you study for the Illinois Secretary of State permit and license tests through practice
            questions, gamified learning, and a study buddy named Dash.
          </p>
          <p className="mt-2">
            This policy covers what data we collect, why, and how you can control it.
            If you have questions, email us at{" "}
            <a href="mailto:privacy@drivemaster.app" className="text-blue-600 underline hover:text-blue-700">
              privacy@drivemaster.app
            </a>
            .
          </p>
        </section>

        {/* 2 — Account data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            2. What we collect when you sign up
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Your <strong>email address</strong> — used for login and optional progress emails.</li>
            <li>Your <strong>password</strong> — hashed and stored securely by Supabase. We never see the plain-text version.</li>
            <li><strong>Optional:</strong> display name, username, and target test date — only if you choose to add them.</li>
          </ul>
        </section>

        {/* 3 — Quiz data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            3. What we collect when you take quizzes
          </h2>
          <p>
            To power your progress tracking, we store:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
            <li>Which questions you answered and whether each was correct or not.</li>
            <li>Timestamps of your quiz sessions.</li>
            <li>Your XP, streak, and league stats.</li>
          </ul>
          <p className="mt-3">
            All of this is stored in a Postgres database hosted by Supabase in the United States.
            It is tied to your account — it is not anonymous.
          </p>
        </section>

        {/* 4 — Analytics */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            4. Analytics — opt-in only
          </h2>
          <p>
            We use two optional analytics tools. Both are <strong>off by default</strong>. You must turn them on in{" "}
            <a href="/settings" className="text-blue-600 underline hover:text-blue-700">Settings → Privacy</a>.
          </p>
          <ul className="list-disc list-inside space-y-3 ml-2 mt-3">
            <li>
              <strong>PostHog</strong> — product analytics. If enabled, we collect page views and feature interactions
              (e.g., which quiz modes you use). No quiz answers are included in analytics events.
            </li>
            <li>
              <strong>Microsoft Clarity</strong> — heatmaps and session replays. Clarity automatically masks all
              form fields (passwords, email inputs) so they never appear in recordings. If enabled, Clarity may
              record your scroll and click patterns to help us improve the UI.
            </li>
          </ul>
          <p className="mt-3">
            You can opt out at any time — go to{" "}
            <a href="/settings" className="text-blue-600 underline hover:text-blue-700">Settings → Privacy</a>{" "}
            and toggle off the analytics options. Opt-out takes effect immediately.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Honest note: we currently rely on copy (not a technical age gate) to discourage users under 13.
            If you are a parent and believe your child under 13 has created an account, please email{" "}
            <a href="mailto:privacy@drivemaster.app" className="text-blue-600 underline">privacy@drivemaster.app</a>{" "}
            and we will delete it promptly.
          </p>
        </section>

        {/* 5 — What we never collect */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            5. What we never collect
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Your precise location or GPS data.</li>
            <li>Your contacts, camera, or microphone.</li>
            <li>Biometric data of any kind.</li>
            <li>Payment information (DriveMaster is free).</li>
          </ul>
          <p className="mt-3">
            We do <strong>not</strong> sell your data to third parties — ever.
          </p>
        </section>

        {/* 6 — Parental link */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            6. Parental progress link
          </h2>
          <p>
            Parents or guardians can receive a weekly progress email showing your streak, XP, and quiz completion.
            This link is only activated <strong>after the teen explicitly approves it</strong> inside the app.
            Teens can revoke the parental link at any time from their account settings — no explanation needed.
          </p>
        </section>

        {/* 7 — Sub-processors */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            7. Sub-processors
          </h2>
          <p>We share your data with the following services to operate DriveMaster:</p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Purpose</th>
                  <th className="px-4 py-3 font-semibold">Data shared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 font-medium">Supabase</td>
                  <td className="px-4 py-3">Database &amp; authentication</td>
                  <td className="px-4 py-3">Account + quiz data</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Vercel</td>
                  <td className="px-4 py-3">Hosting &amp; edge functions</td>
                  <td className="px-4 py-3">IP address, request metadata</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Resend</td>
                  <td className="px-4 py-3">Transactional email</td>
                  <td className="px-4 py-3">Email address</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">synthetic.new</td>
                  <td className="px-4 py-3">AI wrong-answer explanations</td>
                  <td className="px-4 py-3">The question and your answer (no account ID)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">PostHog</td>
                  <td className="px-4 py-3">Product analytics (opt-in)</td>
                  <td className="px-4 py-3">Page views, feature events</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Microsoft Clarity</td>
                  <td className="px-4 py-3">Heatmaps &amp; session replay (opt-in)</td>
                  <td className="px-4 py-3">Clicks, scrolls (form fields masked)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 8 — Retention */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            8. How long we keep your data
          </h2>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>Account and quiz data</strong> — kept until you delete your account.
              To request deletion, email{" "}
              <a href="mailto:privacy@drivemaster.app" className="text-blue-600 underline hover:text-blue-700">
                privacy@drivemaster.app
              </a>
              .
            </li>
            <li>
              <strong>Analytics data</strong> (PostHog / Clarity, if opted in) — retained for 90 days, then deleted automatically.
            </li>
          </ul>
        </section>

        {/* 9 — COPPA + IL BIPA */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            9. COPPA &amp; Illinois BIPA posture
          </h2>
          <p>
            DriveMaster is designed for users aged 15–17. <strong>If you are under 13, do not use DriveMaster.</strong>{" "}
            We do not knowingly collect personal information from children under 13. If we learn that a user is under 13,
            we will delete the account and all associated data within 30 days.
          </p>
          <p className="mt-3">
            We do not collect biometric identifiers or biometric information as defined by the Illinois Biometric
            Information Privacy Act (BIPA).
          </p>
        </section>

        {/* 10 — Your rights */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            10. Your rights
          </h2>
          <p>You can do any of the following by emailing{" "}
            <a href="mailto:privacy@drivemaster.app" className="text-blue-600 underline hover:text-blue-700">
              privacy@drivemaster.app
            </a>
            :
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2 mt-2">
            <li><strong>Request a data export</strong> — get a copy of everything we have about you.</li>
            <li><strong>Request deletion</strong> — we will delete your account and all associated data.</li>
            <li><strong>Correct errors</strong> — if something is wrong in your profile, we will fix it.</li>
          </ul>
          <p className="mt-3">
            We will respond to all requests within 30 days.
          </p>
        </section>

        {/* 11 — Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display tracking-tight">
            11. Contact us
          </h2>
          <p>
            Privacy questions, data requests, or parental concerns:{" "}
            <a href="mailto:privacy@drivemaster.app" className="text-blue-600 underline hover:text-blue-700">
              privacy@drivemaster.app
            </a>
          </p>
          <p className="mt-2">
            General questions:{" "}
            <a href="mailto:hello@drivemaster.app" className="text-blue-600 underline hover:text-blue-700">
              hello@drivemaster.app
            </a>
          </p>
        </section>

      </div>

      {/* Footer spacer */}
      <div className="h-16 bg-gray-50 border-t border-gray-100 flex items-center justify-center text-sm text-gray-400">
        © 2026 DriveMaster. Not affiliated with the Illinois Secretary of State.
      </div>
    </main>
  );
}
