export type Game = {
  slug: string;
  title: string;
  description: string;
  image: string;
  isNew?: boolean;
};

export const games: Game[] = [
  {
    slug: "spend-a-billion",
    title: "Spend a Billion",
    description: "You have $1B. Buy things. See how far it goes.",
    image: "/games/spend-a-billion.svg",
    isNew: true,
  },
  {
    slug: "draw-this-shape",
    title: "Draw This Shape",
    description: "Trace shapes freehand. Get scored on accuracy.",
    image: "/games/draw-this-shape.svg",
    isNew: true,
  },
  {
    slug: "old-web-explorer",
    title: "Old Web Explorer",
    description: "Browse retro web pages from 1999. Nostalgia guaranteed.",
    image: "/games/old-web-explorer.svg",
    isNew: true,
  },
  {
    slug: "scale-shifter",
    title: "Scale Shifter",
    description: "Zoom from the smallest to the largest thing in the universe.",
    image: "/games/scale-shifter.svg",
  },
  {
    slug: "ranker",
    title: "Ranker",
    description: "Pick your favorites. Get a personality profile.",
    image: "/games/ranker.svg",
  },
];
