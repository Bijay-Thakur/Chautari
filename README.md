# Chautari

A **Next.js** web app for gentle mental-health awareness and community presence: a cinematic entry, a centered home hub, guided flows, shared space (“Chautari”), and optional AI-assisted reflection. The UI uses **Tailwind CSS**, **Framer Motion**, and **Radix** primitives where relevant.

> **Not medical advice.** This app is for education and self-reflection only. It does not diagnose or treat any condition. If you or someone else is in immediate danger, contact local emergency services or a crisis line.

---

## Experience overview

| Step | Route | What it does |
|------|--------|----------------|
| **Splash** | `/` | Full-viewport intro (birds, background, audio). **Enter** fades out and navigates to **`/home`**. |
| **Home hub** | `/home` | Centered hero (“Chautari”), “A Place to Rest and Express”, privacy note, and **Sit under Chautari** — opens a modal before the room. |
| **Chautari room** | `/chautari` | Shared kite field with realtime **Supabase** when configured; floating kites, hover cards, hugs, optional chat overlay, **CrisisBar** at bottom. |
| **Come sit with yourself** | `/come-sit-with-yourself` | Voice or typed reflection → transcription (browser speech or **OpenAI Whisper** fallback) → classification into themed buckets → short video → suggestions via **Google Gemini** with **OpenAI** fallback. |
| **Screening** | `/screening` | Questionnaire-style flow with results (`/screening/result`). |
| **Break the chain** | `/break-the-chain` | Interactive chain metaphor with result view. |
| **Research** | `/research` | Stub / placeholder for deeper reading links. |
| **Auth** | API routes | Register / login (bcrypt + Supabase where configured). |

### Home → Chautari: anonymous name

- Tapping **Sit under Chautari** opens **`EnterChautariModal`**: a single field for an **anonymous display name** (stays on this device; not your real name).
- On confirm, the name is stored in **`sessionStorage`** as **`chautari_uname`**, then the app navigates to **`/chautari`**.
- If someone opens **`/chautari`** directly without a stored name, the room still assigns one via **`generateAnonName()`** (see `src/lib/anonName.ts`).

### Global branding (inner pages)

- **`SiteLogo`** (root layout): fixed top-left logo using **`/images/Logo.png`**, linking to **`/home`**.
- Shown on all routes **except** **`/`** and **`/home`** so the splash and home hub stay uncluttered.

### Chautari room UI

- **No duplicate “Chautari” title** beside the logo — room branding is the global logo only.
- **Floating kites** (`FloatingKite`, `KiteSVG`, physics from `kitePhysics`), **`KiteHoverCard`** on hover, **`HugOverlay`**, **`AnonymousChat`** where enabled.
- Session: **`chautari_uid`** and **`chautari_uname`** in **`sessionStorage`** for this browser tab.

---

## Features (legacy table)

| Area | What it does |
|------|----------------|
| **Home (`/home`)** | Primary hub after splash; links into Chautari via modal + CTA. |
| **Chautari (`/chautari`)** | Real-time shared “kites” over **Supabase** (presence, reactions, crisis resources bar). |
| **Come sit with yourself (`/come-sit-with-yourself`)** | Voice or typed reflection → transcription → classification → video → suggestions (**Gemini** primary, **OpenAI** fallback). |
| **Screening (`/screening`)** | Questionnaire-style flow with results. |
| **Break the chain (`/break-the-chain`)** | Interactive chain metaphor with result view. |
| **Research (`/research`)** | Stub / placeholder for deeper reading links. |
| **Auth** | Register / login API routes (bcrypt + Supabase where configured). |

---

## Tech stack

- **Next.js** 16 (App Router), **React** 19, **TypeScript**
- **Tailwind CSS** 3, **Framer Motion**, **Lucide** icons
- **Supabase** (client + optional service role for server routes)
- **OpenAI** (Whisper transcription, JSON classification, resources fallback)
- **Google Gemini** (primary path for personalized resource suggestions when configured)

---

## Prerequisites

- **Node.js** 20+ (recommended; matches typical Next 16 setups)
- npm (or pnpm/yarn if you adapt commands)

---

## Getting started

```bash
git clone <your-repo-url>
cd Chautari
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you’ll land on the **splash** (`/`); after **Enter**, you’ll be sent to **`/home`**.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | ESLint |

---

## Environment variables

Create **`.env.local`** in the project root (never commit secrets). Example:

```env
# Supabase (Chautari realtime, optional auth / server features)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Server-only — only if your API routes use the service client
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI — required for Come sit: Whisper, classify, and resources fallback
OPENAI_API_KEY=

# Google Gemini — optional; resources API tries Gemini first when set
GEMINI_API_KEY=

# Optional model tuning (Come sit resources)
# GEMINI_MODEL=gemini-1.5-flash
# GEMINI_MODEL_FALLBACKS=gemini-2.0-flash,gemini-1.5-pro
# OPENAI_RESOURCES_MODEL=gpt-4o-mini
```

- Without **Supabase** URL + anon key, Chautari realtime features stay disconnected (the client is built to degrade gracefully).
- Without **`OPENAI_API_KEY`**, `/api/come-sit/transcribe` and `/api/come-sit/classify` return **503**; the resources route can still return **static** fallback copy when AI is unavailable.

---

## Come sit: how it works

1. **Transcription** — Prefer **Web Speech API** in supported browsers; otherwise recorded audio is sent to **`POST /api/come-sit/transcribe`** (Whisper).
2. **Classification** — Edited text is sent to **`POST /api/come-sit/classify`**; response includes a bucket (`depression` \| `anxiety` \| `psychosis`), title, and short explanatory copy.
3. **Resources** — After the video step, **`POST /api/come-sit/resources`** returns structured “ways to help” plus a short summary. It tries **Gemini** first, then **OpenAI**, then **static** fallback JSON.

### Rate limits (API)

Best-effort **in-memory** limits per server instance (keyed by `x-forwarded-for` / `x-real-ip`):

| Route | Limit |
|-------|--------|
| `/api/come-sit/transcribe` | 12 requests / 15 minutes |
| `/api/come-sit/classify` | 30 requests / 15 minutes |
| `/api/come-sit/resources` | 20 requests / 15 minutes |

On **429**, the client should back off. For strict global limits in production, swap this for **Redis / Upstash** (or similar) behind the same interface.

---

## Deployment

The repo includes a **`vercel.json`** with default Next.js-oriented commands. Typical flow:

1. Connect the Git repo to [Vercel](https://vercel.com).
2. Set the same environment variables in the project settings.
3. Deploy.

**Note:** In-memory rate limits reset per serverless instance and are not a global cap across regions. Plan accordingly for production traffic.

---

## Project layout (high level)

```
public/
  images/
    Background.jpeg    # Splash + home atmosphere
    Logo.png             # Site logo (SiteLogo)
src/
  app/                   # App Router pages + API routes
  components/            # Shared UI — e.g. EnterChautariModal, SiteLogo, FloatingKite,
                         # KiteHoverCard, CrisisBar, Come sit flow, overlays
  data/                  # Static config (e.g. seed kites, come-sit buckets, media)
  lib/                   # Supabase clients, rate limit, LLM helpers, kite physics, anon names
```

---

## Safety & privacy

- Treat user-submitted text and audio as sensitive; log minimally in production.
- Crisis UI in Chautari points users toward help; keep national/regional numbers accurate if you customize copy.
- Anonymous names for Chautari are stored in **`sessionStorage`** only for the current session context; review **OpenAI** and **Google** data policies before enabling keys in production.

---

## Package name

The npm `package.json` name is `saathi-break-the-chain`; the product surface is branded **Chautari**. Rename the package in `package.json` if you want them aligned.

---

## Contributing

Issues and PRs welcome. Please run `npm run lint` and `npm run build` before submitting changes.
