# Website Architecture

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG, great SEO, React ecosystem |
| Language | **TypeScript** | Type safety, fewer bugs |
| Styling | **Tailwind CSS v4** | Rapid styling, consistent design |
| Hosting | **Vercel (Free Tier)** | Automatic deploys from GitHub, CDN, SSL |
| Domain | **yourname.fun or similar TBD** | ~$12/yr via Namecheap/Porkbun |
| Analytics | **Plausible** (self-host or $9/mo) | Privacy-first, no cookie banner needed |
| Newsletter | **Buttondown** (free up to 1k) | Simple, no ads |
| Merch | **Ko-fi Shop** embedded | No monthly fee |
| Icons | **Lucide React** | Open source SVG icons |

**Monthly cost at launch: ~$12/yr = $1/mo (domain only)**

---

## Project Structure (Next.js App Router)

```
/
├── public/                 # Static assets (images, favicon)
│   ├── games/              # Thumbnails for each game
│   └── general/            # Site-wide assets
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout (header, footer, fonts)
│   │   ├── page.tsx        # Landing page (grid of games)
│   │   ├── games/
│   │   │   ├── [slug]/     # Dynamic route for each game
│   │   │   │   ├── page.tsx
│   │   │   │   └── game.ts # Game logic (pure functions)
│   │   └── globals.css     # Tailwind imports + global styles
│   ├── components/
│   │   ├── GameCard.tsx    # Thumbnail card for landing page
│   │   ├── GameFrame.tsx   # Shared game wrapper (title, share btn)
│   │   ├── Newsletter.tsx  # Email signup form
│   │   ├── Footer.tsx
│   │   └── SupportButton.tsx
│   ├── data/
│   │   └── games.ts        # List of all games (metadata, slugs)
│   └── lib/
│       └── utils.ts        # Shared helpers
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## How It Works

1. **Landing page** reads `games.ts` and renders a grid of `GameCard` components
2. **Each game** is a subpage at `/games/[slug]` with its own URL, meta tags, and share card
3. **Games are self-contained** — no database, no API calls. All logic runs in the browser (React state, canvas, or WebGL)
4. **Static Generation** — Next.js pre-builds all game pages at deploy time for instant load
5. **Newsletter signup** appears on every page (subtle footer or end-of-game prompt)

---

## Performance Targets

- Lighthouse score: **95+** on all 4 categories
- First Contentful Paint: **<1s**
- Page weight: **<100KB** per game page (excluding game assets)
- All games must work **without JavaScript** for basic display (graceful fallback)

---

## Hosting & Deploy

- GitHub repo → Vercel auto-deploy on push to `main`
- Preview deployments on every PR/branch
- Custom domain with automatic SSL
- Edge Functions if needed later (e.g. leaderboards)
