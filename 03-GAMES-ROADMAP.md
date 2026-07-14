# Games Roadmap

## Copyright & Originality Policy

Every game on this site must pass the **originality test**:
- **Concept** may share a genre with existing games (e.g. "spending simulator", "drawing challenge") — genres cannot be copyrighted
- **Implementation** must be built from scratch — no copied code, assets, or logic
- **Design** must be visually distinct — different layout, colors, UI patterns
- **Name** must not be trademarked or confusingly similar
- **If unsure**, rename or redesign until it's clearly distinct

---

## Launch Pack (5 games — build first)

### Game 1: "Spend a Billion"
*Genre: Spending simulator*

**Concept:** You have $1 billion. Buy items from a categorized store. Watch your money deplete in real-time. See what fraction of a billion each purchase is.

| Aspect | Detail |
|---|---|
| Unique twist | Items show "time worked to afford" at minimum wage as perspective |
| Original vs. similar | Different item catalog, different UI layout, perspective twist |
| Implementation | React state, animations with Framer Motion |
| Difficulty | 2–3 days |

---

### Game 2: "Draw This Shape"
*Genre: Drawing challenge*

**Concept:** You're shown a geometric shape. Draw it freehand. Get scored on accuracy. Progressively harder shapes.

| Aspect | Detail |
|---|---|
| Unique twist | Multiple shapes per round, cumulative scoring, leaderboard potential |
| Original vs. similar | Not just a circle — triangles, stars, spirals with increasing difficulty |
| Implementation | HTML5 Canvas + pointer events |
| Difficulty | 3–4 days |

---

### Game 3: "Old Web Explorer"
*Genre: Internet nostalgia*

**Concept:** Browse a simulated retro web page from 1999. Each refresh shows a different "artifact" — old ads, GeoCities pages, early YouTube, etc. Built from original fictional content (not ripped from real sites).

| Aspect | Detail |
|---|---|
| Unique twist | Curated fictional retro pages with hidden easter eggs |
| Original vs. similar | All content is originally written and designed in retro style, not copied |
| Implementation | CSS retro styling, JSON data files |
| Difficulty | 3–4 days |

---

### Game 4: "Scale Shifter"
*Genre: Size comparison*

**Concept:** A zoomable slider from quantum foam to observable universe. Each stop shows a familiar object at that scale with a fun fact.

| Aspect | Detail |
|---|---|
| Unique twist | Gamified — find hidden objects at each scale level, collect them |
| Original vs. similar | Different data, collection mechanic, visual style |
| Implementation | Canvas zoom with smooth transitions |
| Difficulty | 4–5 days |

---

### Game 5: "Ranker"
*Genre: Rating game*

**Concept:** Two things appear. Pick which one you prefer. After 20 rounds, see your "personality profile" based on your choices.

| Aspect | Detail |
|---|---|
| Unique twist | Generates a shareable "personality card" at the end |
| Original vs. similar | Different question pool, result visualization, share mechanic |
| Implementation | React state, canvas for result card |
| Difficulty | 2–3 days |

---

## Expansion Ideas (for later)

| # | Name | Description | Est. Days |
|---|---|---|---|
| 6 | Type Racer But Weird | Typing test with nonsense words and increasing speed | 2 |
| 7 | Color Match | Identify if two colors are the same (harder than it sounds) | 1–2 |
| 8 | Probability Lab | Visualize probability with interactive simulations | 3 |
| 9 | Daily Puzzle | One puzzle per day, streak tracking (needs lightweight DB) | 4 |
| 10 | AI Guessing Game | Player writes a prompt, AI tries to guess what it is (wraps an API) | 3 |

---

## New Game Checklist

- [ ] Idea is original enough (run through copyright check)
- [ ] Works on mobile (touch)
- [ ] Has a shareable result/score
- [ ] Loads under 100KB (not counting game assets)
- [ ] Has proper meta tags for SEO
- [ ] Includes newsletter prompt at end
