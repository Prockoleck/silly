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
    slug: "old-web-explorer",
    title: "Old Web Explorer",
    description: "Browse retro web pages from 1999. Nostalgia guaranteed.",
    image: "/games/old-web-explorer.svg",
    isNew: true,
  },
  {
    slug: "scale-shifter",
    title: "Scale",
    description: "Scroll through the universe from the quantum foam to the cosmic web.",
    image: "/games/scale-shifter.svg",
    isNew: true,
  },
  {
    slug: "ranker",
    title: "Ranker",
    description: "Pick your favorites. Get a personality profile.",
    image: "/games/ranker.svg",
  },
];
