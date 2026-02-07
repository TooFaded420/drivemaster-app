# 🚗 DriveMaster

> A Duolingo-style driving test prep app for Illinois

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Features

- 🎮 **Gamified Learning** - XP, levels, streaks, and achievements
- 📊 **Progress Tracking** - Category mastery and test readiness scores
- 🏆 **Leaderboards** - Weekly competitions with Bronze to Diamond leagues
- 🚗 **Dash Mascot** - Friendly animated car character guides your journey
- 📱 **Mobile-First PWA** - Install on your phone, works offline
- 🎯 **Illinois-Specific** - Content from official IL Rules of the Road

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, Database, Real-time)
- **Animations:** Framer Motion
- **Deployment:** Vercel

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
driving-test-app/
├── app/
│   ├── (auth)/         # Login, signup pages
│   ├── (dashboard)/    # Main dashboard
│   ├── (onboarding)/   # New user flow
│   ├── (quiz)/         # Quiz interface
│   └── api/            # API routes
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and Supabase client
├── public/             # Static assets
├── supabase/           # Database migrations
└── types/              # TypeScript definitions
```

## 📖 Documentation

See [architecture.md](./architecture.md) for detailed technical documentation including:
- Database schema
- API endpoints
- Gamification mechanics
- Content strategy

## 📄 License

MIT

---

Built with ❤️ for Illinois drivers
