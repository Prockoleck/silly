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
    image: "/games/spend-a-billion.jpg",
    isNew: true,
  },
  {
    slug: "old-web-explorer",
    title: "Old Web Explorer",
    description: "Browse retro web pages from 1999. Nostalgia guaranteed.",
    image: "/games/old-web-explorer.jpg",
    isNew: true,
  },
  {
    slug: "scale-shifter",
    title: "Scale",
    description: "Scroll through the universe from the quantum foam to the cosmic web.",
    image: "/games/scale-shifter.jpg",
    isNew: true,
  },
  {
    slug: "ranker",
    title: "Ranker",
    description: "Pick your favorites. Get a personality profile.",
    image: "/games/ranker.jpg",
  },
  {
    slug: "sandboxels",
    title: "Sandboxels",
    description: "Play with elements — sand, water, fire, acid, lava, and more.",
    image: "/sandboxels-thumb.jpeg",
    isNew: true,
  },
  {
    slug: "life-checklist",
    title: "Life Checklist",
    description: "A checklist for the average human life. How many items have you completed?",
    image: "/games/life-checklist.jpeg",
    isNew: true,
  },
  {
    slug: "baby-map",
    title: "Baby Map",
    description: "Watch the world's population grow in real-time on an interactive birth map.",
    image: "/games/baby-map.jpeg",
    isNew: true,
  },
  {
    slug: "progress",
    title: "Progress",
    description: "See how much time is left until the next minute, hour, day, and 15 other fun events.",
    image: "/games/progress.jpg",
    isNew: true,
  },
];
