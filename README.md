# Chautari

**A culturally grounded digital safe space for mental-health awareness and community presence.**

Inspired by the *chautari* — the shaded resting stone beneath the pipal tree where people stop, share, and breathe — this app creates a gentle, anonymous environment for reflection, expression, and connection. It is not medical advice or therapy. It is a place to rest.

> **Disclaimer:** Chautari is for education and self-reflection only. It does not diagnose or treat any condition. If you or someone else is in immediate danger, contact local emergency services or the TPO Nepal helpline: **16600102005** (toll-free).

---

## Live routes

| URL | Page |
|-----|------|
| `/` | Cinematic landing — animated birds, fire, ambient audio, "Enter Chautari" |
| `/home` | Home hub — hero, "Sit under Chautari" CTA, privacy note |
| `/chautari` | Shared kite room — release messages, hug kites, anonymous chat |
| `/come-sit-with-yourself` | Guided reflection — voice/text → AI classification → video → resources |
| `/screening` | Bilingual screening questionnaire (English + Nepali fields) |
| `/screening/result` | Scored result with tier copy and next-step links |
| `/break-the-chain` | Scenario chain flow with per-choice reflections |
| `/break-the-chain/result` | Animated result — chain broken / bending / holding |
| `/research` | Curated research links sorted by mental-health bucket |

---

## Feature walkthrough

### 1. Landing (`/`)
Full-viewport hero: background image, procedurally animated bird flock (multi-depth, wing-flap), fire particle system over the bonfire, ambient lantern glows, muted background audio with a toggle. After clicking **Enter Chautari**, audio fades and the app navigates to `/home`.

### 2. Home (`/home`)
Blurred atmospheric background, Fraunces-display hero, "A Place to Rest and Express" section with an animated **Sit under Chautari** pill button. Clicking it opens `EnterChautariModal`.

### 3. Anonymous name modal
Before entering the kite room a short modal asks for an **anonymous display name** (1–48 chars, device-only, not a real name). The name is stored in `sessionStorage` as `chautari_uname`. Direct `/chautari` visits fall back to a randomly generated name via `generateAnonName()`.

### 4. Chautari room (`/chautari`)
- **Night-sky canvas:** deterministic stars, wind streaks, bidirectional bird flock (white + black silhouettes, 72 birds, wing-flap animation).
- **Floating kites:** each kite carries a message, a Nepali phrase, and an optional silencing phrase. Kites drift with physics-based motion from `kitePhysics`. Hover or tap shows `KiteHoverCard`.
- **Release a kite:** type a message in the bottom input and press Enter. A kite appears instantly (optimistic), then persists to Supabase if configured.
- **Hug a kite:** opens `HugOverlay` with the kite's message and an option to connect for anonymous chat.
- **Anonymous chat:** Supabase broadcast channel per user pair — ephemeral, no server-side storage.
- **Seed kites:** if Supabase is not configured (or no active room), deterministic seed kites populate the room so the experience is never empty.
- **Crisis bar:** fixed bottom bar on every page with the TPO Nepal helpline.
- **Global logo:** `SiteLogo` (top-left) links back to `/home` on all inner pages.

### 5. Come sit with yourself (`/come-sit-with-yourself`)
1. **Record or type** — browser microphone via Web Speech API (where supported), or typed free text.
2. **Transcribe** — audio fallback goes to `POST /api/come-sit/transcribe` (OpenAI Whisper).
3. **Classify** — text sent to `POST /api/come-sit/classify` → GPT-4o-mini returns a bucket (`depression` | `anxiety` | `psychosis`), title, and *how it affects you* copy.
4. **Video** — a short clip from `/clips/` matched to the bucket plays with warm context copy.
5. **Resources** — `POST /api/come-sit/resources` tries Gemini first, then OpenAI, then static fallback JSON. Returns structured "ways to help" + a summary.
6. **Curated research** — `CuratedResearchList` renders `COME_SIT_RESEARCH_SECTIONS` sorted by the detected bucket.

### 6. Screening & Break the Chain
- Bilingual question sets (`chainData.ts`): English text + Nepali-flavored fields.
- `QuestionCard` and `ProgressChain` animate answers.
- Screening answers encode into a URL query; result page scores them (`calculateScreeningScore`) and shows tiered copy.
- Chain answers extend the URL; result page runs `calculateChainScore` and shows one of three animated outcomes: **chain broken** (`ChainBreakAnimation` with confetti kites), **chain bending**, or **chain holding** (`KiteAnimation`).

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI library | **React 19** |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS 3**, custom CSS variables, grain texture |
| Animation | **Framer Motion 11** |
| Icons | **Lucide React** |
| Realtime / DB | **Supabase** (broadcast + Postgres, degrades gracefully without keys) |
| AI — transcription | **OpenAI Whisper** (`whisper-1`) |
| AI — classification | **OpenAI GPT-4o-mini** (JSON mode) |
| AI — resources | **Google Gemini** (primary) → **OpenAI** (fallback) → static JSON |
| Auth | bcryptjs + Supabase (`saathi_users` table), HTTP-only cookie |
| Fonts | Fraunces (display), Source Sans 3 (body), Noto Sans Devanagari (Nepali) |

---

## Project layout

```
Chautari/
├── public/
│   ├── images/
│   │   ├── Background.jpeg     # Landing + home atmosphere
│   │   ├── Background2.jpeg    # Alternate background
│   │   └── Logo.png            # Site logo (SiteLogo component)
│   ├── audio/
│   │   └── Sound.mpeg          # Ambient landing audio
│   └── clips/
│       ├── Depression.mp4
│       ├── Anxiety.mp4
│       └── Psychosis.mp4
│
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Landing
│   │   ├── layout.tsx                        # Root layout (fonts, SiteLogo, CrisisBar)
│   │   ├── globals.css                       # CSS variables, grain, typography
│   │   ├── home/page.tsx                     # Home hub
│   │   ├── chautari/page.tsx                 # Kite room
│   │   ├── come-sit-with-yourself/page.tsx   # Reflection flow
│   │   ├── research/page.tsx                 # Curated research
│   │   ├── screening/page.tsx                # Screening questionnaire
│   │   ├── screening/result/page.tsx         # Screening result
│   │   ├── break-the-chain/page.tsx          # Scenario chain flow
│   │   ├── break-the-chain/result/page.tsx   # Chain result
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/register/route.ts
│   │       ├── come-sit/transcribe/route.ts  # Whisper
│   │       ├── come-sit/classify/route.ts    # GPT-4o-mini
│   │       └── come-sit/resources/route.ts   # Gemini / OpenAI / static
│   │
│   ├── components/
│   │   ├── AnonymousChat.tsx          # Ephemeral pair chat (Supabase broadcast)
│   │   ├── ChainBreakAnimation.tsx    # Chain-break SVG + confetti
│   │   ├── ChautariSkyBirds.tsx       # Bird flock for kite room
│   │   ├── CrisisBar.tsx              # Fixed bottom helpline bar
│   │   ├── EnterChautariModal.tsx     # Anonymous name modal (portal)
│   │   ├── FloatingKite.tsx           # Draggable kite with hover card
│   │   ├── HugOverlay.tsx             # Post-hug overlay + connect prompt
│   │   ├── KiteAnimation.tsx          # Decorative kite SVG
│   │   ├── KiteHoverCard.tsx          # Hover card with phrases + actions
│   │   ├── KiteSVG.tsx                # Diamond kite SVG renderer
│   │   ├── ProgressChain.tsx          # Chain-link progress indicator
│   │   ├── QuestionCard.tsx           # Screening / scenario question UI
│   │   ├── SiteLogo.tsx               # Fixed top-left logo (inner pages only)
│   │   ├── come-sit/ComeSitFlow.tsx   # Full reflection UX flow
│   │   └── come-sit/CuratedResearchList.tsx
│   │
│   ├── data/
│   │   ├── chainData.ts               # Questions, scoring, category labels
│   │   ├── seedKites.ts               # Demo kites for offline/no-DB mode
│   │   ├── comeSitConfig.ts           # Buckets, video paths, warm copy
│   │   └── comeSitResearchCurated.ts  # Curated research URLs + sort helpers
│   │
│   ├── lib/
│   │   ├── supabase.ts                # Browser Supabase client
│   │   ├── supabaseServer.ts          # Service-role client (API routes only)
│   │   ├── apiRateLimit.ts            # In-memory IP rate limiting
│   │   ├── anonName.ts                # generateAnonName()
│   │   ├── authCookie.ts              # saathi_auth cookie helpers
│   │   ├── browserSpeech.ts           # Web Speech API wrapper
│   │   ├── comeSitResourcesAI.ts      # Gemini + OpenAI resource helpers
│   │   ├── llmJson.ts                 # parseJsonObject (strip fences)
│   │   ├── kitePhysics.ts             # generateKiteMotion, KITE_COLORS
│   │   ├── kiteFlySound.ts            # Procedural Web Audio on kite release
│   │   └── profileHelper.ts           # localStorage username helpers
│   │
│   ├── constants/
│   │   └── auth.ts                    # Cookie name + value constants
│   │
│   └── Assets/                        # Source asset copies (optional)
│       ├── Audio/Sound.mpeg
│       ├── Clips/
│       └── images/
│
├── next.config.ts                     # Turbopack, allowedDevOrigins for tunnels
├── tailwind.config.ts                 # Theme (colors, fonts)
├── tsconfig.json
├── package.json
└── .env.local                         # Secret keys — never commit
```

---

## Getting started

### Prerequisites

- **Node.js 20+**
- **npm** (or pnpm / yarn)

### Install and run

```bash
git clone https://github.com/Bijay-Thakur/Chautari.git
cd Chautari
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

---

## Environment variables

Create `.env.local` in the project root. **Never commit this file.**

```env
# ── Supabase ──────────────────────────────────────────────────────────────
# Required for realtime kite room, auth API routes
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only — needed only if login / register API routes are used
SUPABASE_SERVICE_ROLE_KEY=

# ── OpenAI ────────────────────────────────────────────────────────────────
# Required for /api/come-sit/transcribe (Whisper) and /api/come-sit/classify
OPENAI_API_KEY=

# ── Google Gemini ─────────────────────────────────────────────────────────
# Optional — resources API tries Gemini first when this is set
GEMINI_API_KEY=

# Optional model overrides
# GEMINI_MODEL=gemini-1.5-flash
# GEMINI_MODEL_FALLBACKS=gemini-2.0-flash,gemini-1.5-pro
# OPENAI_RESOURCES_MODEL=gpt-4o-mini
```

### Graceful degradation

| Missing key | Consequence |
|-------------|-------------|
| Supabase keys | Kite room uses seed kites only; no realtime, no auth API |
| `OPENAI_API_KEY` | Transcribe returns **503**; classify returns **503** |
| `GEMINI_API_KEY` | Resources skips Gemini, tries OpenAI, falls back to static copy |
| All AI keys | Resources returns static fallback JSON — app still functions |

---

## API reference

### `POST /api/come-sit/transcribe`
Accepts `multipart/form-data` with an `audio` field. Sends to **OpenAI Whisper** and returns `{ text: string }`.

### `POST /api/come-sit/classify`
Accepts `{ text: string }`. Returns `{ bucket, title, howItAffects }` from **GPT-4o-mini** (JSON mode).

### `POST /api/come-sit/resources`
Accepts `{ bucket, context? }`. Returns `{ ways: [...], summary }` — Gemini → OpenAI → static fallback.

### `POST /api/auth/register`
Accepts `{ username, password }`. Hashes password with **bcrypt**, inserts into `saathi_users`, sets `saathi_auth` cookie.

### `POST /api/auth/login`
Accepts `{ username, password }`. Validates against `saathi_users`, sets `saathi_auth` cookie.

### Rate limits (in-memory, per server instance)

| Route | Limit |
|-------|-------|
| `/api/come-sit/transcribe` | 12 req / 15 min |
| `/api/come-sit/classify` | 30 req / 15 min |
| `/api/come-sit/resources` | 20 req / 15 min |

For production, replace with a Redis/Upstash-backed store across instances.

---

## Sharing locally (dev tunnels)

Two terminals required:

**Terminal 1**
```bash
npm run dev
```

**Terminal 2** — pick one:

| Command | Tunnel service |
|---------|---------------|
| `npm run tunnel` | Tunnelmole (no install, free, pick the `http://` URL if HTTPS fails) |
| `npm run tunnel:cf` | Cloudflare Quick Tunnel — install [`cloudflared`](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) first via `winget install Cloudflare.cloudflared` |
| `npm run dev:lan` + LAN IP | Same Wi-Fi only — share `http://YOUR_IP:3000` with anyone on your network |

`next.config.ts` already allows `*.tunnelmole.net`, `*.trycloudflare.com`, `*.ngrok-free.app`, and `*.loca.lt` as dev origins.

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add all environment variables in **Project Settings → Environment Variables**.
4. Deploy. Every `git push` to `main` / `master` auto-deploys.

### Other hosts

Any host that supports **Node.js 20+** and server-side Next.js should work. Set the same env vars.

> **Note:** In-memory rate limits reset per serverless function cold start. Use Redis/Upstash for global limits across regions in production.

---

## Supabase schema (reference)

The kite room depends on these tables when Supabase is configured:

```sql
-- Active rooms
chautari_rooms (id uuid PK, is_active bool, created_at timestamptz)

-- Kites
kites (
  id uuid PK,
  room_id uuid FK → chautari_rooms,
  user_id uuid,
  anonymous_name text,
  message text,
  color text,
  position_x float,
  position_y float,
  hug_count int default 0,
  created_at timestamptz
)

-- Hug events (for realtime count updates)
kite_hugs (
  id uuid PK,
  kite_id uuid FK → kites,
  hugger_user_id uuid,
  hugger_name text,
  kite_owner_user_id uuid,
  created_at timestamptz
)

-- Auth (if using built-in auth API)
saathi_users (
  id uuid PK,
  username text UNIQUE,
  password_hash text,
  anonymous_name text,
  created_at timestamptz
)
```

---

## Safety & privacy

- User messages in the kite room are stored in Supabase only when configured and only for the duration of a session (kites are deleted on user disconnect / page close).
- Anonymous names are stored in `sessionStorage` only — they do not leave the device unless sent with a kite message.
- Audio from "Come sit" is sent to OpenAI Whisper; no recording is stored server-side.
- The `CrisisBar` is always visible and links to **TPO Nepal: 16600102005**.
- Review OpenAI and Google data-retention policies before enabling API keys in production.

---

## Scripts reference

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server (`localhost:3000`) |
| `npm run dev:lan` | Dev server bound to `0.0.0.0` — accessible on LAN |
| `npm run build` | Production build |
| `npm run start` | Start production server (requires `build` first) |
| `npm run lint` | ESLint |
| `npm run tunnel` | Tunnelmole — public URL for `localhost:3000` |
| `npm run tunnel:cf` | Cloudflare Quick Tunnel |
| `npm run tunnel:localtunnel` | LocalTunnel (fallback — often unstable) |

---

## Branches

| Branch | Purpose |
|--------|---------|
| `master` | Stable, mirrors `Bijay` (use for production / Vercel) |
| `Bijay` | Primary development branch — most up to date |
| `Rahul` | Contributor branch |

---

## Contributing

1. Branch off `Bijay` for new work.
2. Run `npm run lint` and `npm run build` before opening a pull request.
3. Keep `.env.local` out of commits — it is listed in `.gitignore`.
4. Test with Supabase keys disabled to confirm graceful degradation still works.

---

## Package note

The npm package name in `package.json` is `saathi-break-the-chain` (historical). The product brand is **Chautari**. Update `package.json` when aligning them.
