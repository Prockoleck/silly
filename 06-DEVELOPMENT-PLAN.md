# Development & Maintenance Plan

## Phase 0: Foundation (Week 1)

### Setup
- [ ] Buy domain (TBD) — ~$12/yr
- [ ] Create GitHub repo (`minigames`)
- [ ] Initialize Next.js project with TypeScript + Tailwind
- [ ] Deploy to Vercel (empty page)
- [ ] Set up custom domain + SSL
- [ ] Install Plausible analytics (self-hosted free or $9/mo)
- [ ] Set up Buttondown newsletter account

### Deliverables
- GitHub repo with CI/CD
- Live site at `yourdomain.fun` with 404 page
- Analytics tracking

---

## Phase 1: MVP (Weeks 2–4)

### Build Order
1. Landing page (responsive grid of game cards)
2. Game framework (shared layout, share button, newsletter prompt)
3. Game 1: "Spend a Billion" — 3 days
4. Game 2: "Draw This Shape" — 4 days
5. Game 3: "Old Web Explorer" — 4 days

### Launch Checklist
- [ ] Mobile testing on 3 devices
- [ ] Lighthouse score ≥95 on all pages
- [ ] OG images generated for all 3 games
- [ ] Newsletter signup working
- [ ] Ko-fi link active
- [ ] Posted to r/InternetIsBeautiful (Game 1)
- [ ] Posted to r/SideProject

### Deliverables
- 3 working games on live domain
- Landing page with card grid
- Basic monetization (Ko-fi + newsletter)

---

## Phase 2: Expand (Weeks 5–8)

### Build
- Game 4: "Scale Shifter" — 5 days
- Game 5: "Ranker" — 3 days

### Growth
- Apply to Carbon Ads / EthicalAds (need traffic first)
- Hacker News "Show HN" submission
- Twitter thread: "I built 5 games in 2 months"

### Deliverables
- 5 games total
- First traffic milestone (1k visitors/day)

---

## Phase 3: Monetize (Weeks 9–12)

### Build
- Game 6: "Type Racer But Weird" — 2 days
- Merch store (Printful + Ko-fi integration)
- Leaderboard feature (optional — adds DB cost)

### Growth
- Ad network approval (if traffic qualifies)
- First sponsored newsletter issue
- Product Hunt launch

### Deliverables
- 6+ games
- 2 revenue streams active
- ~50k monthly visits target

---

## Ongoing (Month 4+)

### Monthly Cadence
| Week | Task |
|---|---|
| Week 1 | Build new game (2–5 days) + launch |
| Week 2 | Promote game on Reddit/Twitter, fix bugs |
| Week 3 | Refine older games, analytics review |
| Week 4 | Content (newsletter), outreach, planning next game |

### Maintenance Budget
| Task | Hours/Month |
|---|---|
| Bug fixes & updates | 2–4 |
| New game development | 8–15 |
| Promotion & community | 3–5 |
| Analytics & optimization | 1–2 |
| **Total** | **14–26 hrs/mo** |

---

## Cost Breakdown (Monthly)

| Item | Cost | Notes |
|---|---|---|
| Domain | $1 | Annual fee divided by 12 |
| Hosting (Vercel) | $0 | Free tier |
| Analytics (Plausible) | $0–9 | Self-host free or $9/mo hosted |
| Newsletter (Buttondown) | $0 | Free up to 1k subs |
| Ko-fi | $0 | Free tier |
| **Total at launch** | **$1/mo** | |
| **Total scaled** | **~$10–15/mo** | |

---

## Copyright & Legal Checklist (Per Game)

Before releasing any game, verify:

- [ ] Game name is not trademarked (check USPTO TESS)
- [ ] Game concept is not a direct copy of a specific existing game
- [ ] All code is original (no copied snippets from other games)
- [ ] All visual assets are original or CC0/mit licensed
- [ ] Fictional content (e.g. "Old Web Explorer") is entirely original writing
- [ ] No trademarked brands/logos used (unless parody/editorial)
- [ ] Privacy policy page exists and links to analytics privacy info

**When in doubt, rename or redesign. Do not ship content that feels lifted.**

---

## Tools & Resources

| Purpose | Tool |
|---|---|
| Code editor | VS Code |
| Prototyping | Figma (free tier) |
| Image editing | Photopea or GIMP |
| Icons | Lucide React |
| Color palette | Coolors |
| OG image generator | Vercel OG (Edge) or manual Canva |
| Sound effects (optional) | freesound.org (CC0) or zapsplat.com |
