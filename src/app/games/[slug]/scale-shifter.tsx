"use client";

import { useState, useCallback } from "react";

type ScaleLevel = {
  emoji: string;
  label: string;
  sizeMeters: number;
  sizeLabel: string;
  fact: string;
  color: string;
};

const LEVELS: ScaleLevel[] = [
  {
    emoji: "🟣",
    label: "Planck Length",
    sizeMeters: 1.6e-35,
    sizeLabel: "10⁻³⁵ m",
    fact: "The smallest possible length in physics. Space itself might be grainy at this scale.",
    color: "#8B5CF6",
  },
  {
    emoji: "⚛️",
    label: "Quark",
    sizeMeters: 1e-18,
    sizeLabel: "10⁻¹⁸ m",
    fact: "Quarks are the fundamental building blocks of protons and neutrons. They're never found alone.",
    color: "#6366F1",
  },
  {
    emoji: "💥",
    label: "Proton",
    sizeMeters: 8.8e-16,
    sizeLabel: "10⁻¹⁵ m",
    fact: "Protons are made of three quarks held together by the strong nuclear force. 99.9% of an atom's mass is in its nucleus.",
    color: "#4F46E5",
  },
  {
    emoji: "🔬",
    label: "Atom",
    sizeMeters: 1e-10,
    sizeLabel: "10⁻¹⁰ m",
    fact: "Atoms are 99.9999999999999% empty space. If an atom were a stadium, the nucleus would be a pea at the center.",
    color: "#3B82F6",
  },
  {
    emoji: "🧬",
    label: "DNA Helix",
    sizeMeters: 2e-9,
    sizeLabel: "2 nm",
    fact: "Your DNA, if stretched out, would reach from Earth to the Sun and back over 600 times.",
    color: "#0EA5E9",
  },
  {
    emoji: "🦠",
    label: "Virus",
    sizeMeters: 1e-7,
    sizeLabel: "100 nm",
    fact: "Viruses are so small that 500 million of them could fit on a pinhead.",
    color: "#06B6D4",
  },
  {
    emoji: "🧫",
    label: "Bacteria",
    sizeMeters: 2e-6,
    sizeLabel: "2 µm",
    fact: "There are more bacteria in your mouth than there are people on Earth.",
    color: "#10B981",
  },
  {
    emoji: "🧵",
    label: "Human Hair",
    sizeMeters: 7e-5,
    sizeLabel: "70 µm",
    fact: "A single human hair can support up to 100 grams of weight before breaking.",
    color: "#84CC16",
  },
  {
    emoji: "💎",
    label: "Grain of Salt",
    sizeMeters: 3e-4,
    sizeLabel: "0.3 mm",
    fact: "Salt crystals form perfect cubes at the molecular level.",
    color: "#EAB308",
  },
  {
    emoji: "🪙",
    label: "Coin",
    sizeMeters: 2e-2,
    sizeLabel: "2 cm",
    fact: "The first coins were minted in Lydia (modern Turkey) around 600 BC.",
    color: "#F97316",
  },
  {
    emoji: "📏",
    label: "Ruler",
    sizeMeters: 1,
    sizeLabel: "1 m",
    fact: "The meter was originally defined as one ten-millionth of the distance from the equator to the North Pole.",
    color: "#EF4444",
  },
  {
    emoji: "🏢",
    label: "Skyscraper",
    sizeMeters: 8e2,
    sizeLabel: "800 m",
    fact: "The Burj Khalifa is so tall you can see two sunsets on the same day from top and bottom.",
    color: "#DC2626",
  },
  {
    emoji: "⛰️",
    label: "Mount Everest",
    sizeMeters: 8.8e3,
    sizeLabel: "8.8 km",
    fact: "Everest grows about 4mm taller every year due to tectonic plate movement.",
    color: "#B91C1C",
  },
  {
    emoji: "🌊",
    label: "Mariana Trench",
    sizeMeters: 1.1e4,
    sizeLabel: "11 km",
    fact: "The deepest part of the ocean. The pressure is over 1,000 times atmospheric pressure.",
    color: "#1D4ED8",
  },
  {
    emoji: "🌍",
    label: "Earth",
    sizeMeters: 1.27e7,
    sizeLabel: "12,742 km",
    fact: "Earth is the densest planet in the solar system and the only known place with life.",
    color: "#3B82F6",
  },
  {
    emoji: "🪐",
    label: "Saturn's Rings",
    sizeMeters: 2.8e8,
    sizeLabel: "280,000 km",
    fact: "Saturn's rings are only about 10 meters thick despite being hundreds of thousands of km wide.",
    color: "#D97706",
  },
  {
    emoji: "☀️",
    label: "The Sun",
    sizeMeters: 1.39e9,
    sizeLabel: "1.39 million km",
    fact: "The Sun is so large that over 1.3 million Earths could fit inside it.",
    color: "#F59E0B",
  },
  {
    emoji: "🛸",
    label: "Solar System",
    sizeMeters: 2.87e12,
    sizeLabel: "19.2 AU",
    fact: "The solar system is so vast that light takes over 2.5 hours to reach from the Sun to Neptune.",
    color: "#A855F7",
  },
  {
    emoji: "⭐",
    label: "Solar Neighborhood",
    sizeMeters: 1e16,
    sizeLabel: "1.06 light-years",
    fact: "The nearest star to our Sun, Proxima Centauri, is 4.24 light-years away.",
    color: "#7C3AED",
  },
  {
    emoji: "🌌",
    label: "Milky Way",
    sizeMeters: 9.46e20,
    sizeLabel: "100,000 light-years",
    fact: "It would take 100,000 years traveling at the speed of light to cross the Milky Way.",
    color: "#4C1D95",
  },
  {
    emoji: "🌀",
    label: "Local Group",
    sizeMeters: 9.46e22,
    sizeLabel: "10 million light-years",
    fact: "The Local Group contains over 80 galaxies, with Andromeda heading for a collision with us.",
    color: "#3B0764",
  },
  {
    emoji: "🕸️",
    label: "Virgo Supercluster",
    sizeMeters: 1.1e24,
    sizeLabel: "110 million light-years",
    fact: "We're part of a cosmic web of galaxies stretching across billions of light-years.",
    color: "#2E1065",
  },
  {
    emoji: "🔮",
    label: "Observable Universe",
    sizeMeters: 8.8e26,
    sizeLabel: "93 billion light-years",
    fact: "The observable universe contains an estimated 2 trillion galaxies.",
    color: "#000",
  },
];

export default function Scale() {
  const [level, setLevel] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");

  const current = LEVELS[level];
  const isComplete = level >= LEVELS.length;
  const progress = (level / (LEVELS.length - 1)) * 100;

  const next = useCallback(() => {
    if (level < LEVELS.length - 1) {
      setDirection("up");
      setLevel((l) => l + 1);
    }
  }, [level]);

  const prev = useCallback(() => {
    if (level > 0) {
      setDirection("down");
      setLevel((l) => l - 1);
    }
  }, []);

  if (isComplete) {
    return (
      <div className="w-full text-center py-4" style={{ animation: "fade-up 0.4s ease-out" }}>
        <div className="text-6xl mb-4">🌌</div>
        <h2 className="text-2xl font-bold text-ink mb-2">Journey Complete</h2>
        <p className="text-ink-secondary mb-6">
          You traveled across 23 orders of magnitude — from the quantum foam to the edge of the cosmos.
        </p>
        <button
          onClick={() => { setLevel(0); setDirection("up"); }}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Start over
        </button>
      </div>
    );
  }

  const scaleFactor = level > 0 ? current.sizeMeters / LEVELS[level - 1].sizeMeters : 0;

  return (
    <div className="w-full" style={{ animation: "fade-up 0.4s ease-out" }}>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-ink-muted mb-1.5">
          <span>Planck Length</span>
          <span className="tabular-nums">{Math.round(progress)}%</span>
          <span>Observable Universe</span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%`, backgroundColor: current.color }}
          />
        </div>
      </div>

      <div key={level} style={{ animation: direction === "up" ? "fade-up 0.5s ease-out" : "fade-up 0.3s ease-out reverse" }}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{current.emoji}</div>
          <h2 className="text-2xl font-bold font-display text-ink mb-1">{current.label}</h2>
          <p className="text-sm text-ink-muted font-mono">{current.sizeLabel}</p>
        </div>

        <div className="bg-accent-light rounded-xl p-4 mb-6">
          <p className="text-sm text-ink-secondary leading-relaxed">{current.fact}</p>
        </div>

        {level > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-ink-muted mb-6">
            <span>{LEVELS[level - 1].emoji} {LEVELS[level - 1].label}</span>
            <span className="text-ink-secondary font-bold">×{scaleFactor < 1000 ? scaleFactor.toFixed(1) : scaleFactor.toExponential(1)}</span>
            <span>{current.emoji} {current.label}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prev}
          disabled={level === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium text-ink-secondary bg-surface border border-border hover:border-accent hover:text-accent transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ← Previous
        </button>
        <button
          onClick={next}
          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {level < LEVELS.length - 1 ? "Next →" : "Finish"}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1 mt-4">
        {LEVELS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > level ? "up" : "down"); setLevel(i); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === level ? "bg-accent scale-125" : i < level ? "bg-accent/40" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
