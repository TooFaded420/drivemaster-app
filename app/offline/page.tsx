import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline | Ace Your Permit",
  description: "You are offline. Ace Your Permit will reconnect when you are back online.",
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-5xl">📡</span>
        <h1 className="text-3xl font-semibold">You're offline</h1>
        <p className="mt-3 text-base text-slate-300">
          Ace Your Permit needs a connection to sync your progress. Check your network
          and try again.
        </p>
        <div className="mt-6 rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200">
          Your latest answers are saved locally and will sync automatically.
        </div>
      </div>
    </main>
  );
}
