export type Game = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  isNew?: boolean;
};

export const games: Game[] = [
  {
    slug: "spend-a-billion",
    title: "Spend a Billion",
    description: "You have $1B. Buy things. See how far it goes.",
    icon: "💰",
    isNew: true,
  },
  {
    slug: "draw-this-shape",
    title: "Draw This Shape",
    description: "Trace shapes freehand. Get scored on accuracy.",
    icon: "✏️",
    isNew: true,
  },
  {
    slug: "old-web-explorer",
    title: "Old Web Explorer",
    description: "Browse retro web pages from 1999. Nostalgia guaranteed.",
    icon: "🕰️",
    isNew: true,
  },
  {
    slug: "scale-shifter",
    title: "Scale Shifter",
    description: "Zoom from the smallest to the largest thing in the universe.",
    icon: "🔬",
  },
  {
    slug: "ranker",
    title: "Ranker",
    description: "Pick your favorites. Get a personality profile.",
    icon: "⚖️",
  },
];
