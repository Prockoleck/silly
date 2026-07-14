"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

type ScaleLevel = {
  label: string;
  sizeMeters: number;
  sizeLabel: string;
  fact: string;
  category: string;
  image: string;
};

const HUMAN_HEIGHT = 1.7;

const LEVELS: ScaleLevel[] = [
  {
    label: "Planck Length",
    sizeMeters: 1.6e-35,
    sizeLabel: "1.6 × 10⁻³⁵ m",
    fact: "The smallest possible length in physics. At this scale, spacetime itself may be grainy, like pixels on a cosmic screen.",
    category: "QUANTUM",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/22/Spacetime_curvature.png",
  },
  {
    label: "Quark",
    sizeMeters: 1e-18,
    sizeLabel: "1 × 10⁻¹⁸ m",
    fact: "Quarks are fundamental particles that make up protons and neutrons. They're never found alone — only in groups.",
    category: "SUBATOMIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Proton_Quark_Structure.png",
  },
  {
    label: "Proton",
    sizeMeters: 8.8e-16,
    sizeLabel: "8.8 × 10⁻¹⁶ m",
    fact: "Protons are made of three quarks. 99.9% of an atom's mass lives in its impossibly tiny nucleus.",
    category: "SUBATOMIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Proton_diagram.png",
  },
  {
    label: "Atom",
    sizeMeters: 1e-10,
    sizeLabel: "1 × 10⁻¹⁰ m",
    fact: "Atoms are 99.9999999999999% empty space. If an atom were a stadium, the nucleus would be a pea at center field.",
    category: "ATOMIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Atom_diagram.png",
  },
  {
    label: "DNA Helix",
    sizeMeters: 2e-9,
    sizeLabel: "2 nanometers",
    fact: "Your DNA, if unraveled and laid end-to-end, would stretch from Earth to the Sun and back 600 times.",
    category: "MOLECULAR",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/97/DNA_Double_Helix.png",
  },
  {
    label: "Virus",
    sizeMeters: 1e-7,
    sizeLabel: "100 nanometers",
    fact: "Viruses are so small that 500 million of them could dance on a pinhead. They blur the line between life and chemistry.",
    category: "MICROSCOPIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/82/SARS-CoV-2_without_background.png",
  },
  {
    label: "Bacteria",
    sizeMeters: 2e-6,
    sizeLabel: "2 micrometers",
    fact: "There are more bacteria living in your mouth right now than there are humans who have ever lived on Earth.",
    category: "MICROSCOPIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Prokaryote_cell_%28temp_PNG%29.png",
  },
  {
    label: "Human Hair",
    sizeMeters: 7e-5,
    sizeLabel: "70 micrometers",
    fact: "A single strand of hair can support up to 100 grams of weight. Your hair grows about 15 km in a lifetime.",
    category: "MICROSCOPIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Human_Hair_Partly_Bleached.png",
  },
  {
    label: "Grain of Salt",
    sizeMeters: 3e-4,
    sizeLabel: "0.3 millimeters",
    fact: "Table salt forms perfect cubes at the molecular level. Each grain contains about 10¹⁸ atoms.",
    category: "TINY",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Sodium_chloride_crystal.png",
  },
  {
    label: "Coin",
    sizeMeters: 2e-2,
    sizeLabel: "2 centimeters",
    fact: "The first coins were minted around 600 BC in Lydia. Before that, people traded grain, cattle, and seashells.",
    category: "HUMAN_SCALE",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2005-Penny-Uncirculated-Obverse-cropped.png",
  },
  {
    label: "Human",
    sizeMeters: 1.7,
    sizeLabel: "1.7 meters",
    fact: "You are here. Right in the middle of the cosmic size spectrum — larger than 99.9% of matter, smaller than 99.9% of space.",
    category: "HUMAN_SCALE",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Human-man.png",
  },
  {
    label: "Skyscraper",
    sizeMeters: 8e2,
    sizeLabel: "800 meters",
    fact: "The Burj Khalifa is so tall you can watch two sunsets in one day — one at the base, then ride up and see it again.",
    category: "MEGASTRUCTURE",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/03/Empire_State_Building.png",
  },
  {
    label: "Mount Everest",
    sizeMeters: 8.8e3,
    sizeLabel: "8.8 kilometers",
    fact: "Everest grows 4mm taller every year as India pushes into Asia. Its summit is ancient seafloor.",
    category: "GEOGRAPHIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/00/Mt_Everest_north_face_marked01.png",
  },
  {
    label: "Mariana Trench",
    sizeMeters: 1.1e4,
    sizeLabel: "11 kilometers",
    fact: "The deepest point on Earth. The pressure is 1,086 times atmospheric — enough to crush steel like paper.",
    category: "GEOGRAPHIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Cross_section_of_mariana_trench.svg",
  },
  {
    label: "Earth",
    sizeMeters: 1.27e7,
    sizeLabel: "12,742 kilometers",
    fact: "Earth is the densest planet in the solar system and the only known world with liquid water on its surface.",
    category: "PLANETARY",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/43/The_Earth_seen_from_Apollo_17_with_transparent_background.png",
  },
  {
    label: "Saturn's Rings",
    sizeMeters: 2.8e8,
    sizeLabel: "280,000 kilometers",
    fact: "Saturn's rings span 280,000 km but are only about 10 meters thick — thinner than a sheet of paper scaled up.",
    category: "PLANETARY",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Saturn_transparent.png",
  },
  {
    label: "The Sun",
    sizeMeters: 1.39e9,
    sizeLabel: "1.39 million km",
    fact: "Over 1.3 million Earths could fit inside the Sun. It converts 600 million tons of hydrogen into helium every second.",
    category: "STELLAR",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/81/Transparent_Sun.png",
  },
  {
    label: "Solar System",
    sizeMeters: 2.87e12,
    sizeLabel: "19.2 AU",
    fact: "The solar system is so vast that light takes 2.5 hours to reach Neptune from the Sun. Voyager 1 took 35 years to leave it.",
    category: "SOLAR_SYSTEM",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/df/The_Solar_Sistem.png",
  },
  {
    label: "Solar Neighborhood",
    sizeMeters: 1e16,
    sizeLabel: "1.06 light-years",
    fact: "The nearest star, Proxima Centauri, is 4.24 light-years away. A message sent today would reach it in 2030.",
    category: "INTERSTELLAR",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Star_background.png",
  },
  {
    label: "Milky Way",
    sizeMeters: 9.46e20,
    sizeLabel: "100,000 light-years",
    fact: "Crossing the Milky Way at light speed would take 100,000 years. It contains 100 to 400 billion stars.",
    category: "GALACTIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Milky_Way_Galaxy_%28transparent_background%29.png",
  },
  {
    label: "Local Group",
    sizeMeters: 9.46e22,
    sizeLabel: "10 million light-years",
    fact: "Our Local Group contains 80+ galaxies. Andromeda is hurtling toward us at 110 km/s — collision in 4.5 billion years.",
    category: "GALACTIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/80/06-Local_Group_%28LofE06256%29.png",
  },
  {
    label: "Virgo Supercluster",
    sizeMeters: 1.1e24,
    sizeLabel: "110 million light-years",
    fact: "We're part of a cosmic web — a vast network of galaxy filaments stretching across the observable universe.",
    category: "COSMIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/6_Virgo_Supercluster_%28ELitU%29.png",
  },
  {
    label: "Observable Universe",
    sizeMeters: 8.8e26,
    sizeLabel: "93 billion light-years",
    fact: "The observable universe contains 2 trillion galaxies. Beyond it lies either more universe or the edge of reality itself.",
    category: "COSMIC",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Observable_universe_logarithmic_illustration.png",
  },
];

export default function Scale() {
  const [level, setLevel] = useState(0);
  const [imgError, setImgError] = useState(false);

  const current = LEVELS[level];
  const isComplete = level >= LEVELS.length;
  const progress = ((level + 1) / LEVELS.length) * 100;

  const next = useCallback(() => {
    if (level < LEVELS.length - 1) { setLevel((l) => l + 1); setImgError(false); }
  }, [level]);

  const prev = useCallback(() => {
    if (level > 0) { setLevel((l) => l - 1); setImgError(false); }
  }, [level]);

  const jumpTo = useCallback((i: number) => {
    setLevel(i);
    setImgError(false);
  }, []);

  const scaleFactor = current.sizeMeters / HUMAN_HEIGHT;
  const isHumanLevel = current.label === "Human";

  let comparisonText = "";
  if (isHumanLevel) {
    comparisonText = "You are here";
  } else if (scaleFactor < 0.00001) {
    comparisonText = `${Math.abs(Math.log10(scaleFactor)).toFixed(0)} orders of magnitude smaller`;
  } else if (scaleFactor < 1) {
    const factor = 1 / scaleFactor;
    comparisonText = factor >= 1000 ? `${(factor / 1000).toFixed(1)} thousand times smaller` : `${factor.toFixed(0)} times smaller`;
  } else if (scaleFactor < 1000) {
    comparisonText = `${scaleFactor.toFixed(1)} times larger`;
  } else if (scaleFactor < 1000000) {
    comparisonText = `${(scaleFactor / 1000).toFixed(1)} thousand times larger`;
  } else if (scaleFactor < 1000000000) {
    comparisonText = `${(scaleFactor / 1000000).toFixed(1)} million times larger`;
  } else {
    comparisonText = `${scaleFactor.toExponential(1)} times larger`;
  }

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-50 bg-[#fffaec] flex items-center justify-center" style={{ animation: "fade-up 0.4s ease-out" }}>
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-2xl font-bold text-[#2e2307] mb-2">Journey Complete</h2>
          <p className="text-[#2e2307]/70 mb-6 max-w-sm mx-auto">
            You traveled across 27 orders of magnitude — from the quantum foam to the edge of the cosmos.
          </p>
          <button
            onClick={() => { setLevel(0); setImgError(false); }}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-95"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#fffaec]">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 0, transparent 30px)" }} />
      <div className="absolute inset-[8px] sm:inset-[16px] pointer-events-none border-2 border-black/15" style={{ zIndex: 3 }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle, transparent 0%, rgba(255,89,0,0.03) 60%, rgba(106,37,0,0.05) 80%)" }} />

      <Link
        href="/"
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 flex items-center gap-1.5 text-sm text-black/40 hover:text-black/70 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        All games
      </Link>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 text-xs text-black/30 font-mono tabular-nums">
        {level + 1} / {LEVELS.length}
      </div>

      <div className="flex flex-col items-center justify-center h-full px-6 sm:px-10 pb-12 sm:pb-16">
        <div className="w-full max-w-lg mx-auto" style={{ animation: "fade-up 0.4s ease-out" }} key={level}>
          <div className="text-center mb-3">
            <span
              className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#2e2307] uppercase px-2"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {current.label}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="bg-[#fff8ef] border border-[rgba(121,32,32,0.25)] rounded px-2.5 py-1 text-[11px] text-[#5d1616] tracking-wide">
              {current.category}
            </span>
            <span className="text-[11px] text-black/40 font-mono">{current.sizeLabel}</span>
          </div>

          <div className="flex justify-center items-center mb-4" style={{ minHeight: "200px" }}>
            <div className="relative flex items-center justify-center w-full max-w-[400px] mx-auto">
              <img
                key={level}
                src={current.image}
                alt={current.label}
                className={`max-w-full max-h-[220px] object-contain ${imgError ? "hidden" : ""}`}
                style={{ animation: "fade-up 0.5s ease-out" }}
                onError={() => setImgError(true)}
                loading="lazy"
              />
              {imgError && <div className="text-6xl opacity-60">🔬</div>}
              {!isHumanLevel && !imgError && (
                <div className="absolute -bottom-2 right-0 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm border border-black/5">
                  <svg width="12" height="18" viewBox="0 0 14 20" className="opacity-30">
                    <circle cx="7" cy="4" r="3" fill="currentColor" />
                    <path d="M3 9h8l-2 8H5z" fill="currentColor" />
                  </svg>
                  <span className="text-[10px] text-black/50 whitespace-nowrap">{comparisonText}</span>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-md mx-auto text-center px-2 mb-5">
            <p className="text-sm sm:text-base text-[#2e2307]/80 leading-relaxed font-light">{current.fact}</p>
          </div>
        </div>

        <div className="w-full max-w-xs mx-auto" style={{ animation: "fade-up 0.5s ease-out" }} key={`nav-${level}`}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <button
              onClick={prev}
              disabled={level === 0}
              className="w-12 h-12 rounded-full bg-[#fff6e6] border-none shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#fffcf0] disabled:opacity-25 disabled:cursor-not-allowed"
              style={{ outline: "1px solid rgba(79,34,34,0.4)", outlineOffset: "-3px" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="rotate-180">
                <path d="M6 3L12 9L6 15" stroke="#2e2307" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5">
              {LEVELS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => jumpTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === level ? "w-2.5 h-2.5 bg-[#2e2307]" : i < level ? "w-2 h-2 bg-[#2e2307]/30" : "w-2 h-2 bg-black/10"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-[#fff6e6] border-none shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[#fffcf0]"
              style={{ outline: "1px solid rgba(79,34,34,0.4)", outlineOffset: "-3px" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 3L12 9L6 15" stroke="#2e2307" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="h-1 bg-black/8 rounded-full overflow-hidden">
            <div className="h-full bg-[#2e2307]/40 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
