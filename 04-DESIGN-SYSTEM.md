# Design System

## Theme: Light & Clean (White-Based)

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `bg-page` | `#FFFFFF` | Page background |
| `bg-card` | `#F8F9FA` | Card backgrounds, game areas |
| `bg-hover` | `#F0F1F3` | Hover state on cards |
| `text-primary` | `#1A1A2E` | Headings, main text |
| `text-secondary` | `#6B7280` | Body text, descriptions |
| `text-muted` | `#9CA3AF` | Captions, subtle labels |
| `accent` | `#6366F1` | Links, buttons, interactive elements |
| `accent-hover` | `#4F46E5` | Button hover |
| `accent-light` | `#EEF2FF` | Subtle accent backgrounds |
| `border` | `#E5E7EB` | Card borders, dividers |
| `success` | `#10B981` | Scores, completions |
| `error` | `#EF4444` | Mistakes, warnings |

---

### Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| Logo / Site title | Inter (display) | 700 | 1.5rem |
| Game title (card) | Inter | 600 | 1.125rem |
| Game description | Inter | 400 | 0.875rem |
| H1 (game page) | Inter | 700 | 2rem |
| Body text | Inter | 400 | 1rem |
| Buttons | Inter | 500 | 0.875rem |
| Score / Stats | Inter (mono w/ tabular nums) | 600 | 1.25rem |

**Font:** Inter from Google Fonts (subset, woff2)

---

### Spacing Scale

| Token | Rem | Px |
|---|---|---|
| `space-xs` | 0.25 | 4 |
| `space-sm` | 0.5 | 8 |
| `space-md` | 1 | 16 |
| `space-lg` | 1.5 | 24 |
| `space-xl` | 2 | 32 |
| `space-2xl` | 3 | 48 |
| `space-3xl` | 4 | 64 |

---

### Components

#### Game Card (Landing Page)
```
┌──────────────────────────┐
│         ┌──────┐         │
│         │ Icon │         │
│         └──────┘         │
│     Game Title           │
│     Short description    │
│     ████████████░░ 70%   │  ← play count bar (optional)
└──────────────────────────┘
```
- Width: ~280px
- Border: 1px solid `border`, rounded-xl
- Hover: subtle shadow + translateY(-2px)

#### Game Page Layout
```
┌──────────────────────────────────┐
│ ← All Games  │  [Share] [☕]    │
├──────────────────────────────────┤
│                                  │
│       ┌──────────────────┐       │
│       │                  │       │
│       │    GAME AREA     │       │
│       │                  │       │
│       └──────────────────┘       │
│                                  │
│     Score: 123  [Play Again]    │
│                                  │
│    ──────────────────────────    │
│    📧 Get new games by email     │
│    [email@...] [Subscribe]      │
└──────────────────────────────────┘
```

#### Buttons

| State | Style |
|---|---|
| Default | `bg-accent text-white px-4 py-2 rounded-lg` |
| Hover | `bg-accent-hover` |
| Ghost (share) | `text-accent bg-transparent hover:bg-accent-light` |
| Disabled | `opacity-50 cursor-not-allowed` |

---

### Shadows

| Level | Value |
|---|---|
| Card | `0 1px 3px rgba(0,0,0,0.08)` |
| Card hover | `0 4px 12px rgba(0,0,0,0.12)` |
| Modal | `0 8px 32px rgba(0,0,0,0.16)` |

---

### Micro-Interactions

- Card hover: lift + shadow change, 200ms ease-out
- Button click: scale(0.97) for 100ms
- Score change: number animates up (use `useSpring` or similar)
- Page transitions: subtle fade (200ms)

---

### Mobile Responsiveness

| Breakpoint | Layout |
|---|---|
| < 640px | Single column cards, full-width game area |
| 640–1024px | 2-column card grid |
| > 1024px | 3+ column card grid |

All games must work at 320px width minimum.
