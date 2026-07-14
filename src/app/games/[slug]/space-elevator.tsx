"use client";

import Link from "next/link";
import { useCallback, useRef, useEffect, useState } from "react";

type LineEntry = {
  top: number;
  label: string;
  icon: string;
  caption: string;
  side?: "left" | "right" | "center";
  heading?: boolean;
};

const LINES: LineEntry[] = [
  { top: 99850, label: "Fireworks", icon: "🎆", caption: "Firework displays reach 150 m", side: "right" },
  { top: 99750, label: "Peregrine Falcon", icon: "🦅", caption: "Highest recorded bird of prey", side: "left" },
  { top: 99600, label: "Pigeon", icon: "🕊️", caption: "Pigeons cruise at 65–130 m", side: "left" },
  { top: 99500, label: "Bumblebee", icon: "🐝", caption: "Highest recorded bumblebee flight", side: "left" },
  { top: 99300, label: "Skydiving", icon: "🪂", caption: "Skydivers jump at 3,500–4,500 m", side: "right" },
  { top: 99100, label: "Cumulus Clouds", icon: "☁️", caption: "Fair weather clouds at 200–2,000 m", side: "left" },
  { top: 98900, label: "Hang Gliding", icon: "🪁", caption: "Hang gliders reach 500–1,500 m", side: "right" },
  { top: 98700, label: "Stratus Clouds", icon: "🌥️", caption: "Low gray blanket clouds", side: "left" },
  { top: 98580, label: "Troposphere", icon: "🌡️", caption: "You are here — lowest layer of the atmosphere", side: "center", heading: true },
  { top: 98400, label: "White Stork", icon: "🕊️", caption: "Migrates up to 900 m", side: "right" },
  { top: 98200, label: "Lizard", icon: "🦎", caption: "Highest recorded lizard at 1,600 m", side: "right" },
  { top: 98000, label: "Box Kite", icon: "🪁", caption: "Record altitude 9,800 m", side: "right" },
  { top: 97800, label: "Light Aircraft", icon: "✈️", caption: "Cruises at 3,000–4,000 m", side: "right" },
  { top: 97500, label: "Alpine Chough", icon: "🐦", caption: "Nests at 6,500 m", side: "left" },
  { top: 97200, label: "Cessna", icon: "🛩️", caption: "Max altitude ~4,600 m", side: "right" },
  { top: 96900, label: "Andean Condor", icon: "🦅", caption: "Soars up to 7,000 m", side: "left" },
  { top: 96600, label: "Nimbostratus", icon: "☁️", caption: "Rain clouds reaching up to 3,000 m", side: "left" },
  { top: 96300, label: "Commercial Jet", icon: "🛫", caption: "Cruises at 9,000–12,000 m", side: "right" },
  { top: 96000, label: "Altocumulus", icon: "☁️", caption: "Mid-level clouds at 2,000–7,000 m", side: "left" },
  { top: 95600, label: "Cumulonimbus", icon: "⛈️", caption: "Storm clouds reaching 12,000 m", side: "right" },
  { top: 95200, label: "Bearded Vulture", icon: "🦅", caption: "Highest recorded at 7,300 m", side: "left" },
  { top: 94800, label: "Monarch Butterfly", icon: "🦋", caption: "Migrates up to 1,800 m", side: "left" },
  { top: 94400, label: "Mount Everest", icon: "🏔️", caption: "8,848 m — the highest point on Earth", side: "left" },
  { top: 94000, label: "Cirrus Clouds", icon: "🌤️", caption: "Wispy ice-crystal clouds above 8,000 m", side: "left" },
  { top: 93600, label: "Concorde", icon: "🛬", caption: "Cruised at 18,000 m at Mach 2", side: "right" },
  { top: 93200, label: "Rüppell's Vulture", icon: "🦅", caption: "Highest-flying bird at 11,300 m", side: "right" },
  { top: 92800, label: "Cirrostratus", icon: "☁️", caption: "Ice-crystal veil clouds", side: "left" },
  { top: 92300, label: "Water Vapor", icon: "💧", caption: "Most water vapor is in the troposphere", side: "center" },
  { top: 91800, label: "Mil Mi-8", icon: "🚁", caption: "Helicopter ceiling ~6,000 m", side: "left" },
  { top: 91300, label: "Jet Stream", icon: "🌊", caption: "Strong winds up to 370 km/h at 10 km", side: "center" },
  { top: 90800, label: "F-15 Eagle", icon: "✈️", caption: "Service ceiling 20,000 m", side: "left" },
  { top: 90300, label: "Hot Air Balloon", icon: "🎈", caption: "World record 21,027 m", side: "right" },
  { top: 89700, label: "Oxygen Level", icon: "🫁", caption: "Oxygen drops to 25% at 10,000 m", side: "center" },
  { top: 89000, label: "U-2 Spy Plane", icon: "🛬", caption: "The Dragon Lady — 21,000 m ceiling", side: "left" },
  { top: 88400, label: "Pressure", icon: "📊", caption: "Atmospheric pressure is 10% of sea level at 16 km", side: "center" },
  { top: 87800, label: "Stratosphere", icon: "🌡️", caption: "The stratosphere extends to 50 km", side: "center", heading: true },
  { top: 87100, label: "Weather Balloon", icon: "🎈", caption: "Reaches 35,000 m before bursting", side: "left" },
  { top: 86400, label: "Ozone Layer", icon: "🛡️", caption: "Absorbs 97% of harmful UV", side: "center" },
  { top: 85600, label: "Nacreous Clouds", icon: "🌈", caption: "Polar stratospheric clouds at 20 km", side: "left" },
  { top: 84800, label: "SR-71 Blackbird", icon: "🛬", caption: "Fastest jet — 3,530 km/h at 26 km", side: "right" },
  { top: 84000, label: "Bell X-2", icon: "✈️", caption: "First aircraft to reach Mach 3", side: "left" },
  { top: 83000, label: "Paper Airplane", icon: "✈️", caption: "Record flight 88 km from launch", side: "center" },
  { top: 82000, label: "Paratrooper", icon: "🪂", caption: "Highest parachute jump 38,969 m", side: "right" },
  { top: 80800, label: "Felix Baumgartner", icon: "🪂", caption: "Red Bull Stratos — 39,045 m jump", side: "left" },
  { top: 79500, label: "Space Shuttle", icon: "🚀", caption: "Solid rocket boosters separate at 45 km", side: "left" },
  { top: 78000, label: "Sound Barrier", icon: "💥", caption: "Speed of sound at sea level: 1,235 km/h", side: "center" },
  { top: 76500, label: "Mesosphere", icon: "🌌", caption: "The mesosphere — meteors burn up here", side: "center", heading: true },
  { top: 75000, label: "Noctilucent Clouds", icon: "☁️", caption: "Highest clouds at 80 km — polar mesospheric", side: "left" },
  { top: 73000, label: "Meteors", icon: "☄️", caption: "Most meteors vaporize at 50–80 km", side: "center" },
  { top: 71000, label: "Sounding Rocket", icon: "🚀", caption: "Scientific rockets reach 100+ km", side: "right" },
  { top: 68500, label: "Tsar Bomba", icon: "💥", caption: "Largest nuclear test — 57 megatons at 4 km", side: "center" },
  { top: 66000, label: "Soviet V-2", icon: "🚀", caption: "First rocket to reach 100 km (1946)", side: "left" },
  { top: 63000, label: "Red Sprites", icon: "⚡", caption: "Electrical discharges above thunderstorms", side: "left" },
  { top: 60000, label: "Blue Jets", icon: "⚡", caption: "Upper-atmospheric lightning", side: "center" },
  { top: 56500, label: "Aurora Borealis", icon: "🌟", caption: "Solar particles glow at 100–500 km", side: "left" },
  { top: 53000, label: "Thermosphere", icon: "🔥", caption: "Temperature reaches 1,500°C — but feels cold", side: "center", heading: true },
  { top: 49000, label: "ISS Orbit", icon: "🛰️", caption: "ISS orbits at ~400 km — 28,000 km/h", side: "center" },
  { top: 44500, label: "Vostok 1", icon: "🚀", caption: "Yuri Gagarin — first human in space, 1961", side: "right" },
  { top: 39500, label: "Space Shuttle Reentry", icon: "🛸", caption: "Reentry begins at 120 km", side: "left" },
  { top: 34000, label: "Kármán Line", icon: "🚀", caption: "The official boundary of space — 100 km", side: "center", heading: true },
  { top: 28000, label: "Satellite Deployment", icon: "🛰️", caption: "Most satellites orbit at 200–1,200 km", side: "center" },
  { top: 21000, label: "Van Allen Belts", icon: "🌀", caption: "Radiation belts trapped by Earth's magnetic field", side: "center" },
  { top: 13000, label: "Now Leaving Earth", icon: "🌍", caption: "You've left Earth's atmosphere", side: "center" },
  { top: 5000, label: "Deep Space", icon: "🌌", caption: "Welcome to the cosmos", side: "center" },
];

const COLORS = [
  { upTo: 500, bg: "linear-gradient(180deg, #4A90D9 0%, #7EC8E3 40%, #BEE0F0 70%, #F0F8FF 100%)" },
  { upTo: 2000, bg: "linear-gradient(180deg, #3A78C5 0%, #5DA0D8 30%, #87CEEB 60%, #D4EEFF 100%)" },
  { upTo: 5000, bg: "linear-gradient(180deg, #2E5EA0 0%, #4A88C0 25%, #6DB8E0 55%, #A8D8F0 100%)" },
  { upTo: 10000, bg: "linear-gradient(180deg, #1E4090 0%, #3868B0 20%, #5A9AD8 50%, #80C0E8 100%)" },
  { upTo: 20000, bg: "linear-gradient(180deg, #0F2070 0%, #2048A0 20%, #3880C0 50%, #5098C8 100%)" },
  { upTo: 35000, bg: "linear-gradient(180deg, #081050 0%, #102880 20%, #1A50A0 50%, #2060A0 100%)" },
  { upTo: 50000, bg: "linear-gradient(180deg, #040828 0%, #081448 20%, #0C2868 50%, #0E3870 100%)" },
  { upTo: 80000, bg: "linear-gradient(180deg, #020418 0%, #040828 20%, #061038 50%, #081840 100%)" },
  { upTo: 100000, bg: "linear-gradient(180deg, #010210 0%, #020418 20%, #030820 50%, #040C28 100%)" },
];

const LINES_TOP_OFFSET_FIX = 300;

const TMP_FIX = 200; 

export default function SpaceElevator() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState(0);
  const [totalHeight, setTotalHeight] = useState(100000);
  const [charState, setCharState] = useState<"normal" | "scarf" | "suit">("normal");

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onScroll = () => {
      const st = el.scrollTop;
      const sh = el.scrollHeight;
      const ch = el.clientHeight;
      setScroll(ch > 0 ? st / (sh - ch) : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const visibleTop = scroll;
  const show = (topPx: number) => {
    const normalized = 1 - topPx / totalHeight;
    return scroll > normalized - 0.005 && scroll < normalized + 0.03;
  };

  const getBg = useCallback(() => {
    const pct = scroll * 100;
    for (const c of COLORS) {
      if (pct <= ((c.upTo / 100000) * 100)) return c.bg;
    }
    return COLORS[COLORS.length - 1].bg;
  }, [scroll]);

  const isSpace = scroll > 0.96;
  const scrollPx = scroll * totalHeight;
  const displayAlt = Math.round(scrollPx);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 z-[1] transition-opacity duration-1000 pointer-events-none"
        style={{
          background: isSpace
            ? "radial-gradient(ellipse at 50% 20%, rgba(20,40,100,0.4) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(255,200,100,0.08) 0%, transparent 60%)",
        }}
      />
      {isSpace && (
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 10% 15%, white, transparent),
              radial-gradient(1px 1px at 25% 35%, white, transparent),
              radial-gradient(1.5px 1.5px at 40% 8%, white, transparent),
              radial-gradient(1px 1px at 55% 55%, white, transparent),
              radial-gradient(1.5px 1.5px at 70% 20%, white, transparent),
              radial-gradient(1px 1px at 85% 50%, white, transparent),
              radial-gradient(1px 1px at 15% 65%, white, transparent),
              radial-gradient(1.5px 1.5px at 35% 80%, white, transparent),
              radial-gradient(1px 1px at 60% 40%, white, transparent),
              radial-gradient(1px 1px at 80% 70%, white, transparent),
              radial-gradient(1.5px 1.5px at 90% 10%, white, transparent),
              radial-gradient(1px 1px at 5% 45%, white, transparent),
              radial-gradient(1px 1px at 45% 30%, white, transparent),
              radial-gradient(1.5px 1.5px at 75% 85%, white, transparent),
              radial-gradient(1px 1px at 95% 35%, white, transparent),
              radial-gradient(1px 1px at 20% 2%, white, transparent),
              radial-gradient(1.5px 1.5px at 50% 12%, white, transparent),
              radial-gradient(1px 1px at 65% 60%, white, transparent),
              radial-gradient(1px 1px at 30% 50%, white, transparent),
              radial-gradient(1.5px 1.5px at 88% 25%, white, transparent),
            `,
          }}
        />
      )}
      <div
        ref={wrapperRef}
        className="relative z-[2] w-full h-full overflow-y-auto overscroll-none"
        style={{
          background: getBg(),
          transition: "background 0.3s ease-out",
        }}
      >
        <div
          className="relative"
          style={{ height: `${totalHeight + TMP_FIX}px` }}
        >
          <Link
            href="/"
            className={`fixed top-3 left-3 z-50 flex items-center gap-1 text-xs sm:text-sm transition-colors ${
              isSpace ? "text-white/70 hover:text-white" : "text-white/60 hover:text-white/90"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </Link>

          <div
            className="fixed left-2 sm:left-4 z-40 pointer-events-none transition-all duration-300"
            style={{
              top: `${8 + (1 - scroll) * 60}%`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="h-12 w-0.5 bg-white/15 mb-0.5" />
              <div className="relative w-7 sm:w-9">
                <div
                  className={`w-7 sm:w-9 h-9 sm:h-11 rounded-lg flex items-center justify-center text-lg ${
                    isSpace ? "bg-white/5 border border-white/10" : "bg-white/10 backdrop-blur-sm border border-white/15"
                  }`}
                >
                  {charState === "suit" ? "🧑‍🚀" : charState === "scarf" ? "🧣" : "🧑"}
                </div>
                {charState === "scarf" && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">🧣</div>
                )}
              </div>
              <div className="h-20 w-0.5 bg-white/10 mt-0.5" />
            </div>
          </div>

          <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div
              className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-500"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                {String(displayAlt).padStart(6, "0").slice(0, 6).split("").map((d, i) => (
                  <span
                    key={i}
                    className="font-mono text-white font-bold text-base sm:text-lg tabular-nums"
                  >
                    {d}
                  </span>
                ))}
                <span className="text-white/50 text-[10px] sm:text-xs font-mono">m</span>
              </div>
            </div>
          </div>

          <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1">
            <div className="h-32 sm:h-48 w-0.5 bg-white/5 rounded-full relative">
              <div
                className="absolute bottom-0 w-full bg-white/30 rounded-full transition-all duration-200"
                style={{ height: `${scroll * 100}%` }}
              />
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-mono transition-colors ${
                isSpace ? "text-white/40" : "text-white/30"
              }`}
            >
              {displayAlt >= 1000 ? `${(displayAlt / 1000).toFixed(1)}k` : `${displayAlt}`}
            </span>
          </div>

          {LINES.map((line) => {
            const pos = (line.top + LINES_TOP_OFFSET_FIX) / (totalHeight + TMP_FIX);
            const visible =
              scroll >= pos - 0.02 && scroll <= pos + 0.03;
            if (!visible) return null;

            const xPos =
              line.side === "left"
                ? "5%"
                : line.side === "right"
                  ? "65%"
                  : "50%";
            const transform = line.side === "center" ? "translateX(-50%)" : "none";

            if (line.heading) {
              return (
                <div
                  key={line.top}
                  className="absolute z-20 pointer-events-none"
                  style={{
                    top: `${(1 - pos) * 100}%`,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-xl border text-center whitespace-nowrap ${
                      isSpace
                        ? "bg-black/20 backdrop-blur-md border-white/10"
                        : "bg-white/90 backdrop-blur-sm border-black/10"
                    }`}
                  >
                    <div
                      className={`text-xs sm:text-sm font-bold tracking-wider uppercase ${
                        isSpace ? "text-white" : "text-black"
                      }`}
                    >
                      {line.icon} {line.label}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={line.top}
                className="absolute z-20 pointer-events-none"
                style={{
                  top: `${(1 - pos) * 100}%`,
                  left: xPos,
                  transform,
                }}
              >
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full max-w-[180px] sm:max-w-[240px] ${
                    isSpace
                      ? "bg-black/20 backdrop-blur-sm border border-white/10"
                      : "bg-white/80 backdrop-blur-sm border border-black/5 shadow-sm"
                  }`}
                >
                  <span className="text-xs sm:text-sm shrink-0">{line.icon}</span>
                  <span
                    className={`text-[10px] sm:text-xs font-medium truncate ${
                      isSpace ? "text-white" : "text-black"
                    }`}
                  >
                    {line.label}
                  </span>
                  <span
                    className={`text-[8px] sm:text-[10px] truncate ${
                      isSpace ? "text-white/50" : "text-black/40"
                    }`}
                  >
                    {line.caption}
                  </span>
                </div>
              </div>
            );
          })}

          {scroll < 0.01 && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
              <div style={{ animation: "fade-up 0.6s ease-out" }} className="text-center px-4">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🛸</div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                  Space Elevator
                </h1>
                <p className="text-white/60 text-xs sm:text-sm max-w-xs">
                  Scroll down to ride from sea level to the edge of space
                </p>
                <div className="mt-4 animate-bounce text-white/40 text-lg">↓</div>
              </div>
            </div>
          )}

          {scroll > 0.95 && scroll < 0.97 && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
              <div style={{ animation: "fade-up 0.6s ease-out" }} className="text-center">
                <div className="text-5xl mb-3">🌍</div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-1">
                  You reached space!
                </h2>
                <p className="text-white/60 text-xs sm:text-sm">Kármán line — 100 km above sea level</p>
              </div>
            </div>
          )}

          {scroll > 0.99 && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
              <div style={{ animation: "fade-up 0.6s ease-out" }} className="text-center px-4">
                <div className="text-5xl mb-3">🌌</div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-white mb-1">
                  Journey Complete
                </h2>
                <p className="text-white/60 text-xs sm:text-sm max-w-xs mx-auto">
                  You traveled through Earth&apos;s atmosphere to the edge of space.
                </p>
                <button
                  onClick={() => wrapperRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                  className="mt-3 pointer-events-auto text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 transition-all cursor-pointer"
                >
                  Return to Earth ↓
                </button>
              </div>
            </div>
          )}

          <div className="fixed bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
            {charState === "normal" && (
              <button
                onClick={() => setCharState("scarf")}
                className="text-[10px] sm:text-xs bg-white/10 hover:bg-white/20 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 transition-all backdrop-blur-sm cursor-pointer"
              >
                Scarf 🧣
              </button>
            )}
            {charState === "scarf" && (
              <button
                onClick={() => setCharState("suit")}
                className="text-[10px] sm:text-xs bg-white/10 hover:bg-white/20 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 transition-all backdrop-blur-sm cursor-pointer"
              >
                Spacesuit 🧑‍🚀
              </button>
            )}
            {charState !== "normal" && (
              <button
                onClick={() => setCharState("normal")}
                className="text-[10px] sm:text-xs bg-white/5 hover:bg-white/15 text-white/70 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/10 transition-all backdrop-blur-sm cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="fixed right-2 sm:right-4 bottom-2 sm:bottom-3 z-50">
            <span
              className={`text-[10px] sm:text-xs font-mono transition-colors ${
                isSpace ? "text-white/40" : "text-white/30"
              }`}
            >
              {scroll < 0.5
                ? `${Math.round(-displayAlt * 0.006)}°C`
                : scroll < 0.7
                  ? `${Math.round(-displayAlt * 0.008 - 20)}°C`
                  : scroll < 0.9
                    ? `${Math.round(-displayAlt * 0.004 - 80)}°C`
                    : scroll < 0.96
                      ? `${Math.round(displayAlt * 0.008 - 200)}°C`
                      : "1,500°C"}
            </span>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          backgroundImage: `url(https://neal.fun/space-elevator/images/textures/noise.jpeg)`,
          backgroundSize: "400px 400px",
          mixBlendMode: "overlay",
          opacity: 0.12,
        }}
      />
    </div>
  );
}
