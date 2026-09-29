# Trackly — Complete Rebuild

Trackly is a modern, production-ready student assignment and project tracking platform with separate **Student** and **Teacher** experiences, user-based authentication, progress tracking, file uploads, and an AI-ready architecture.

## 🚀 Features
- **Role-Based Authentication:** Real Supabase Auth (Teacher vs Student).
- **Data Isolation (RLS):** Strict Row Level Security policies to isolate classroom data.
- **Teacher Dashboard:** Create assignments, manage multi-phase projects, review submissions, and manage roster.
- **Student Dashboard:** Track progress (0-100%), submit work with attachments, complete project tasks, log daily activity.
- **AI Advisor Module:** Progress health analysis and completion delay prediction heuristics.
- **Modern SaaS UI:** Responsive Web Application (Vite + React) + Progressive mobile UI handling (Glassmorphism, Dark/Light modes, Micro-animations).
- **Cross-Platform Readiness:** Comes with complete Flutter `lib/` codebase setup for compiling Android/iOS native applications.

## 📂 Project Structure
```text
trackly/
├── database/                # Supabase SQL Migrations (IMPORTANT)
│   ├── schema.sql           # All tables and triggers
│   ├── rls.sql              # Row Level Security Policies
│   └── storage.sql          # Storage Bucket initialization
├── src/                     # React Vite Web Application
│   ├── components/          # Reusable UI components
│   ├── context/             # Supabase Auth state & Demo state manager
│   ├── pages/               # Student & Teacher route views
│   └── index.css            # Comprehensive CSS Design System
├── lib/                     # Flutter cross-platform mobile app source
│   ├── core/
│   ├── routing/
│   └── main.dart
├── .env.example             # Environment variables mapping
├── package.json             # Web App dependencies
├── pubspec.yaml             # Flutter dependencies
├── vercel.json              # Vercel deployment config
└── netlify.toml             # Netlify deployment config
```

## 🛠 Supabase Setup (Mandatory for Production)
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and execute the files in order:
   - `database/schema.sql`
   - `database/rls.sql`
   - `database/storage.sql`
3. Copy your `Project URL` and `anon public` keys from the Supabase Settings -> API dashboard.
4. Rename `.env.example` to `.env` and paste your keys:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

*Note: If `.env` is not configured, the web app will seamlessly run in **Interactive Demo Mode** allowing you to preview the UI and data logic instantly!*

## 🌐 Running Locally (Web App)
Ensure you have Node.js 18+ installed.
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

## 📦 Web Deployment
Trackly SPA is pre-configured for Vercel/Netlify zero-config deployment.
```bash
npm run build
```
Push the repository to GitHub and import it on Vercel/Netlify. `vercel.json` and `netlify.toml` will handle SPA history routing automatically.

## 📱 Mobile App (Flutter)
The repository includes the Flutter foundational layout in `lib/` and `pubspec.yaml`.
1. Ensure the Flutter SDK is installed.
2. Run:
   ```bash
   flutter pub get
   ```
3. To test the mobile responsive web build:
   ```bash
   flutter run -d chrome
   ```
4. To build Android APK:
   ```bash
   flutter build apk --release
   ```
5. To build Android AppBundle (Play Store):
   ```bash
   flutter build appbundle --release
   ```
*(iOS requires macOS/Xcode for final compilation: `flutter build ios --release`)*

## 🔐 Security
- No service keys are exposed to the client.
- `Supabase RLS` is strictly enforced to ensure students can NEVER see other students' assignments or submissions.
- Teachers can only access students that have joined via their unique `Classroom Code`.
