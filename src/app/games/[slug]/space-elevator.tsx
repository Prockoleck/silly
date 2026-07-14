"use client";

import Link from "next/link";
import { useState, useCallback, useRef, useEffect } from "react";

type Marker = {
  altitude: number;
  label: string;
  emoji: string;
  note: string;
};

const MARKERS: Marker[] = [
  { altitude: 0, label: "Sea Level", emoji: "🌊", note: "The journey begins. 100 km to space." },
  { altitude: 10, label: "Bumblebee", emoji: "🐝", note: "Highest recorded bumblebee flight." },
  { altitude: 65, label: "Pigeon", emoji: "🕊️", note: "Pigeons fly at 65–130 m on average." },
  { altitude: 200, label: "Cumulus Clouds", emoji: "☁️", note: "Fluffy fair-weather clouds. Base: 200–2,000 m." },
  { altitude: 500, label: "Hang Gliding", emoji: "🪁", note: "Hang gliders soar between 500–1,500 m." },
  { altitude: 1000, label: "Stratus Clouds", emoji: "🌥️", note: "Low gray blanket clouds." },
  { altitude: 2000, label: "Griffon Vulture", emoji: "🦅", note: "The highest-flying bird at 11,300 m." },
  { altitude: 3000, label: "Light Aircraft", emoji: "✈️", note: "Small planes cruise at 3,000–4,000 m." },
  { altitude: 4000, label: "Alpine Chough", emoji: "🐦", note: "Nests at 6,500 m — the highest bird nest." },
  { altitude: 5000, label: "Altocumulus", emoji: "☁️", note: "Mid-level clouds at 2,000–7,000 m." },
  { altitude: 6000, label: "Commercial Jet", emoji: "🛩️", note: "Airliners cruise at 9,000–12,000 m." },
  { altitude: 7000, label: "Andean Condor", emoji: "🦅", note: "Soars up to 7,000 m on thermal currents." },
  { altitude: 8848, label: "Mount Everest", emoji: "🏔️", note: "The highest point on Earth — 8,848 m." },
  { altitude: 9000, label: "Cirrus Clouds", emoji: "🌤️", note: "Wispy ice-crystal clouds above 8,000 m." },
  { altitude: 10000, label: "Concorde", emoji: "🛫", note: "Cruised at 18,000 m at Mach 2." },
  { altitude: 11000, label: "Tropopause", emoji: "🌡️", note: "The boundary of the troposphere. −60°C here." },
  { altitude: 12000, label: "SR-71 Blackbird", emoji: "🛬", note: "Fastest jet — 3,530 km/h at 26,000 m." },
  { altitude: 15000, label: "Weather Balloon", emoji: "🎈", note: "Reaches 35,000 m before bursting." },
  { altitude: 18000, label: "Nacreous Clouds", emoji: "🌈", note: "Rainbow polar stratospheric clouds." },
  { altitude: 20000, label: "Ozone Layer", emoji: "🛡️", note: "Absorbs 97% of harmful UV radiation." },
  { altitude: 30000, label: "U-2 Spy Plane", emoji: "🛬", note: "The Dragon Lady flies at 21,000 m." },
  { altitude: 35000, label: "Stratopause", emoji: "🌡️", note: "Top of the stratosphere. ~0°C." },
  { altitude: 40000, label: "High-Altitude Balloon", emoji: "🎈", note: "Kitty Hawk III reached 32,000 m." },
  { altitude: 45000, label: "Red Sprites", emoji: "⚡", note: "Electrical discharges above thunderstorms." },
  { altitude: 50000, label: "Mesosphere", emoji: "🌌", note: "Meteors burn up here. −90°C." },
  { altitude: 55000, label: "Noctilucent Clouds", emoji: "☁️", note: "The highest clouds — polar mesospheric." },
  { altitude: 60000, label: "Meteors", emoji: "☄️", note: "Most meteors vaporize between 50–80 km." },
  { altitude: 70000, label: "Sounding Rocket", emoji: "🚀", note: "Reaches 100+ km for scientific data." },
  { altitude: 80000, label: "Mesopause", emoji: "🌡️", note: "The coldest place in Earth's atmosphere." },
  { altitude: 85000, label: "Aurora", emoji: "🌟", note: "Solar particles collide with the atmosphere." },
  { altitude: 90000, label: "Thermosphere", emoji: "🔥", note: "Temperature reaches 1,500°C up here." },
  { altitude: 100000, label: "Kármán Line", emoji: "🚀", note: "The official boundary of space! 100 km." },
  { altitude: 110000, label: "Von Kármán Vortices", emoji: "🌀", note: "Flow patterns behind spacecraft." },
  { altitude: 120000, label: "Space Shuttle Orbit", emoji: "🛸", note: "Min altitude for stable orbit." },
  { altitude: 200000, label: "Low Earth Orbit", emoji: "🛰️", note: "ISS orbits at ~400 km. 28,000 km/h." },
  { altitude: 400000, label: "International Space Station", emoji: "🌍", note: "The farthest humans live permanently." },
  { altitude: 1000000, label: "Deep Space", emoji: "🌌", note: "Welcome to the cosmos." },
];

function altitudeColor(m: number): string {
  if (m < 100) return "#4A90D9";
  if (m < 1000) return "#3A7BD5";
  if (m < 2000) return "#2E6CC4";
  if (m < 5000) return "#1E5EAD";
  if (m < 10000) return "#1A4A8A";
  if (m < 20000) return "#15356A";
  if (m < 35000) return "#102050";
  if (m < 50000) return "#0C1538";
  if (m < 80000) return "#080D25";
  if (m < 100000) return "#040715";
  return "#020312";
}

function altitudeGradient(m: number): string {
  const t = Math.min(m / 100000, 1);
  const r = Math.round(74 + (2 - 74) * t);
  const g = Math.round(144 + (3 - 144) * t);
  const b = Math.round(217 + (18 - 217) * t);
  return `rgb(${r},${g},${b})`;
}

const MAX_ALT = 400000;

export default function SpaceElevator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [showAltitude, setShowAltitude] = useState(false);
  const [scarf, setScarf] = useState<string | null>(null);
  const [suit, setSuit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowAltitude(true);
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
    setScrollProgress(progress);
    setAltitude(Math.round(progress * MAX_ALT));
  }, []);

  const markerPos = (alt: number) => (alt / MAX_ALT) * 100;

  const currentMarker = MARKERS.slice().reverse().find((m) => altitude >= m.altitude);

  const isInSpace = altitude >= 100000;

  const elevatorY = 95 - scrollProgress * 85;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto overscroll-none"
        style={{
          background: altitudeGradient(altitude),
          transition: "background 0.15s ease-out",
        }}
      >
        <div className="relative" style={{ height: "400000px" }}>
          <Link
            href="/"
            className="fixed top-4 left-4 z-50 flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All games
          </Link>

          <div className={`fixed left-3 sm:left-5 z-40 pointer-events-none transition-all duration-300`}
            style={{ top: `${elevatorY}%` }}
          >
            <div className="flex flex-col items-center">
              <div className="h-8 w-1 bg-white/20" />
              <div className="relative w-8 sm:w-10">
                <div className="w-8 sm:w-10 h-10 sm:h-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <span className="text-lg sm:text-xl">{suit ? "🧑‍🚀" : scarf ? "🧣" : "🧑"}</span>
                </div>
                {!suit && scarf && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">🧣</span>
                )}
              </div>
              <div className="h-[2px] w-0.5 bg-white/40" style={{ height: "40px" }} />
            </div>
          </div>

          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className={`bg-black/40 backdrop-blur-md rounded-xl border border-white/10 px-4 py-2 transition-all duration-500 ${showAltitude ? "opacity-100" : "opacity-0 translate-y-4"}`}>
              <div className="flex items-center gap-3">
                {String(altitude).padStart(6, "0").split("").map((d, i) => (
                  <span key={i} className="font-mono text-white font-bold text-lg sm:text-xl tabular-nums">{d}</span>
                ))}
                <span className="text-white/60 text-xs font-mono">m</span>
              </div>
            </div>
          </div>

          {MARKERS.map((marker) => {
            const pos = markerPos(marker.altitude);
            const isVisible = altitude >= marker.altitude - 500 && altitude <= marker.altitude + 5000;
            const show = scrollProgress > 0.001 && Math.abs(altitude - marker.altitude) < 20000;
            if (!show) return null;
            return (
              <div
                key={marker.altitude}
                className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                style={{ top: `calc(${100 - pos}% - 30px)` }}
              >
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                  <span className="text-base">{marker.emoji}</span>
                  <span className="text-white text-xs font-medium whitespace-nowrap">{marker.label}</span>
                  <span className="text-white/40 text-[10px] font-mono">{marker.altitude >= 1000 ? `${(marker.altitude / 1000).toFixed(marker.altitude >= 10000 ? 0 : 1)} km` : `${marker.altitude} m`}</span>
                </div>
              </div>
            );
          })}

          <div
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 h-2/3 w-0.5 z-40"
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-white/5 rounded-full" />
              <div
                className="absolute bottom-0 w-full bg-white/40 rounded-full transition-all duration-150"
                style={{ height: `${scrollProgress * 100}%` }}
              />
              <div
                className="absolute right-2 w-0 h-0 transition-all duration-150"
                style={{ bottom: `${scrollProgress * 100}%` }}
              >
                <span className="absolute right-2 text-[10px] text-white/60 font-mono whitespace-nowrap">
                  {altitude >= 1000 ? `${(altitude / 1000).toFixed(1)} km` : `${altitude} m`}
                </span>
              </div>
            </div>
          </div>

          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
            {!suit && !scarf && (
              <button
                onClick={() => setScarf("red")}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 transition-all backdrop-blur-sm cursor-pointer"
              >
                Wear a scarf 🧣
              </button>
            )}
            {!suit && scarf && (
              <button
                onClick={() => { setSuit(true); setScarf(null); }}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 transition-all backdrop-blur-sm cursor-pointer"
              >
                Put on spacesuit 🧑‍🚀
              </button>
            )}
            {suit && (
              <span className="text-xs text-white/60 px-3 py-1.5">Spacesuit on ✓</span>
            )}
          </div>

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            <div className="sticky top-0 w-full h-screen overflow-hidden">
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: isInSpace
                    ? "radial-gradient(ellipse at 50% 30%, rgba(10,20,60,0.3) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at 50% 0%, rgba(255,200,100,0.06) 0%, transparent 60%)",
                }}
              />
              {isInSpace && (
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      radial-gradient(1px 1px at 10% 20%, white, transparent),
                      radial-gradient(1px 1px at 25% 40%, white, transparent),
                      radial-gradient(1.5px 1.5px at 40% 10%, white, transparent),
                      radial-gradient(1px 1px at 55% 60%, white, transparent),
                      radial-gradient(1.5px 1.5px at 70% 25%, white, transparent),
                      radial-gradient(1px 1px at 85% 55%, white, transparent),
                      radial-gradient(1px 1px at 15% 70%, white, transparent),
                      radial-gradient(1.5px 1.5px at 35% 85%, white, transparent),
                      radial-gradient(1px 1px at 60% 45%, white, transparent),
                      radial-gradient(1px 1px at 80% 75%, white, transparent),
                      radial-gradient(1.5px 1.5px at 90% 15%, white, transparent),
                      radial-gradient(1px 1px at 5% 50%, white, transparent),
                      radial-gradient(1px 1px at 45% 35%, white, transparent),
                      radial-gradient(1.5px 1.5px at 75% 90%, white, transparent),
                      radial-gradient(1px 1px at 95% 40%, white, transparent),
                      radial-gradient(1px 1px at 20% 5%, white, transparent),
                      radial-gradient(1.5px 1.5px at 50% 15%, white, transparent),
                      radial-gradient(1px 1px at 65% 65%, white, transparent),
                      radial-gradient(1px 1px at 30% 55%, white, transparent),
                      radial-gradient(1.5px 1.5px at 88% 30%, white, transparent),
                    `,
                  }}
                />
              )}
            </div>
          </div>

          <div className="fixed left-4 bottom-4 z-50 hidden sm:block">
            <div className="text-white/40 text-[10px] font-mono leading-relaxed">
              <div>SCROLL TO RISE</div>
              <div className="animate-bounce mt-1">↑</div>
            </div>
          </div>

          <div className="absolute z-20" style={{ top: "0", left: "50%", transform: "translateX(-50%)" }}>
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
              {scrollProgress < 0.02 && (
                <div className="text-center animate-fade-in" style={{ animation: "fade-up 0.6s ease-out" }}>
                  <div className="text-6xl mb-4">🛸</div>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">Space Elevator</h1>
                  <p className="text-white/60 text-sm max-w-xs">Scroll up to ride from sea level to the edge of space</p>
                </div>
              )}
            </div>
          </div>

          <div className="absolute z-20" style={{ top: `${100 - markerPos(100000)}%`, left: "50%", transform: "translateX(-50%)" }}>
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none">
              {altitude >= 100000 && altitude < 110000 && (
                <div className="text-center" style={{ animation: "fade-up 0.6s ease-out" }}>
                  <div className="text-6xl mb-4">🌍</div>
                  <h2 className="font-display font-bold text-2xl text-white mb-2">You reached space!</h2>
                  <p className="text-white/60 text-sm">Kármán line — 100 km above sea level</p>
                </div>
              )}
            </div>
          </div>

          <div className="absolute z-20" style={{ top: `${100 - markerPos(400000)}%`, left: "50%", transform: "translateX(-50%)" }}>
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none">
              {altitude >= 380000 && (
                <div className="text-center" style={{ animation: "fade-up 0.6s ease-out" }}>
                  <div className="text-6xl mb-4">🌌</div>
                  <h2 className="font-display font-bold text-2xl text-white mb-2">Journey Complete</h2>
                  <p className="text-white/60 text-sm max-w-xs mx-auto">You traveled 400,000 meters from sea level to deep space.</p>
                  <button
                    onClick={() => { containerRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="mt-4 pointer-events-auto text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-all cursor-pointer"
                  >
                    Return to Earth ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
