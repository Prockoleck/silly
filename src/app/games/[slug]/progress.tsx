"use client";

import { useState, useEffect, useRef } from "react";

const LUNAR_CYCLE_MS = 29.530588853 * 24 * 60 * 60 * 1000;
const NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14);

const PALINDROME_TIMES = [
  { h: 0, m: 0 }, { h: 1, m: 10 }, { h: 2, m: 20 }, { h: 3, m: 30 },
  { h: 4, m: 40 }, { h: 5, m: 50 }, { h: 10, m: 1 }, { h: 11, m: 11 },
  { h: 12, m: 21 }, { h: 13, m: 31 }, { h: 14, m: 41 }, { h: 15, m: 51 },
  { h: 20, m: 2 }, { h: 21, m: 12 }, { h: 22, m: 22 }, { h: 23, m: 32 },
];

const SEQUENTIAL_TIMES = [
  { h: 1, m: 23 }, { h: 2, m: 34 }, { h: 3, m: 45 }, { h: 12, m: 34 },
];

const DOUBLE_TIMES = [
  { h: 11, m: 11 }, { h: 22, m: 22 },
];

const SEASON_MONTHS = [
  { m: 2, d: 20 }, { m: 5, d: 21 }, { m: 8, d: 22 }, { m: 11, d: 21 },
];

type EventDef = {
  emoji: string;
  label: string;
  compute: (now: Date) => { progress: number; remaining: number };
};

function getSpecialTimeEvent(times: { h: number; m: number }[]) {
  return (now: Date): { progress: number; remaining: number } => {
    const todayEvents = times.map(t => {
      const d = new Date(now);
      d.setHours(t.h, t.m, 0, 0);
      return d;
    });

    let prevEvent: Date | null = null;
    let nextEvent: Date | null = null;

    for (const d of todayEvents) {
      if (d > now) { nextEvent = d; break; }
      prevEvent = d;
    }

    if (!nextEvent) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(times[0].h, times[0].m, 0, 0);
      nextEvent = tomorrow;
      if (!prevEvent) {
        prevEvent = new Date(now);
        prevEvent.setDate(prevEvent.getDate() - 1);
        prevEvent.setHours(times[times.length - 1].h, times[times.length - 1].m, 0, 0);
      }
    }

    if (!prevEvent) {
      prevEvent = new Date(now);
      prevEvent.setDate(prevEvent.getDate() - 1);
      prevEvent.setHours(times[times.length - 1].h, times[times.length - 1].m, 0, 0);
    }

    const total = nextEvent.getTime() - prevEvent.getTime();
    const elapsed = now.getTime() - prevEvent.getTime();
    return { progress: Math.min(1, elapsed / total), remaining: Math.max(0, nextEvent.getTime() - now.getTime()) };
  };
}

function getDailyEvent(hour: number) {
  return (now: Date): { progress: number; remaining: number } => {
    const todayEvent = new Date(now);
    todayEvent.setHours(hour, 0, 0, 0);

    const yesterdayEvent = new Date(todayEvent);
    yesterdayEvent.setDate(yesterdayEvent.getDate() - 1);

    const tomorrowEvent = new Date(todayEvent);
    tomorrowEvent.setDate(tomorrowEvent.getDate() + 1);

    const [lastEvent, nextEvent] = now < todayEvent
      ? [yesterdayEvent, todayEvent]
      : [todayEvent, tomorrowEvent];

    const total = nextEvent.getTime() - lastEvent.getTime();
    const elapsed = now.getTime() - lastEvent.getTime();
    return { progress: Math.min(1, elapsed / total), remaining: Math.max(0, nextEvent.getTime() - now.getTime()) };
  };
}

function getWeeklyEvent(targetDay: number) {
  return (now: Date): { progress: number; remaining: number } => {
    const currentDay = now.getDay();
    let daysUntil = (targetDay - currentDay + 7) % 7;
    if (daysUntil === 0) daysUntil = 7;

    const nextEvent = new Date(now);
    nextEvent.setHours(0, 0, 0, 0);
    nextEvent.setDate(nextEvent.getDate() + daysUntil);

    const prevEvent = new Date(nextEvent);
    prevEvent.setDate(prevEvent.getDate() - 7);

    const total = nextEvent.getTime() - prevEvent.getTime();
    const elapsed = now.getTime() - prevEvent.getTime();
    return { progress: Math.min(1, elapsed / total), remaining: Math.max(0, nextEvent.getTime() - now.getTime()) };
  };
}

function getMoonPhase(phase: "new" | "full") {
  return (now: Date): { progress: number; remaining: number } => {
    const offset = phase === "full" ? LUNAR_CYCLE_MS / 2 : 0;
    const targetRef = NEW_MOON_REF + offset;
    const diff = now.getTime() - targetRef;
    const cyclesSince = diff / LUNAR_CYCLE_MS;
    const nextCycle = Math.ceil(cyclesSince);

    const nextEventMs = targetRef + nextCycle * LUNAR_CYCLE_MS;
    const lastEventMs = targetRef + (nextCycle - 1) * LUNAR_CYCLE_MS;

    const total = nextEventMs - lastEventMs;
    const elapsed = now.getTime() - lastEventMs;
    return { progress: Math.min(1, elapsed / total), remaining: Math.max(0, nextEventMs - now.getTime()) };
  };
}

function getTwinDateProgress(now: Date): { progress: number; remaining: number } {
  const m = now.getMonth();
  const d = now.getDate();
  const m1 = m + 1;

  let lastEvent: Date;
  let nextEvent: Date;

  if (d >= m1) {
    lastEvent = new Date(now.getFullYear(), m, m1);
    let nm = m + 1;
    let ny = now.getFullYear();
    if (nm > 11) { nm = 0; ny++; }
    nextEvent = new Date(ny, nm, nm + 1);
  } else {
    let pm = m - 1;
    let py = now.getFullYear();
    if (pm < 0) { pm = 11; py--; }
    lastEvent = new Date(py, pm, pm + 1);
    nextEvent = new Date(now.getFullYear(), m, m1);
  }

  const total = nextEvent.getTime() - lastEvent.getTime();
  const elapsed = now.getTime() - lastEvent.getTime();
  return { progress: Math.min(1, elapsed / total), remaining: Math.max(0, nextEvent.getTime() - now.getTime()) };
}

function getFriday13Progress(now: Date): { progress: number; remaining: number } {
  let nextEvent: Date | null = null;
  for (let offset = 0; offset < 12; offset++) {
    const check = new Date(now.getFullYear(), now.getMonth() + offset, 13, 0, 0, 0, 0);
    if (check > now && check.getDay() === 5) { nextEvent = check; break; }
  }
  if (!nextEvent) return { progress: 0, remaining: 0 };

  let prevEvent: Date | null = null;
  for (let offset = -1; offset >= -12; offset--) {
    const check = new Date(now.getFullYear(), now.getMonth() + offset, 13, 0, 0, 0, 0);
    if (check <= now && check.getDay() === 5) { prevEvent = check; break; }
  }
  if (!prevEvent) {
    prevEvent = new Date(nextEvent);
    prevEvent.setFullYear(prevEvent.getFullYear() - 1);
  }

  const total = nextEvent.getTime() - prevEvent.getTime();
  const elapsed = now.getTime() - prevEvent.getTime();
  return { progress: Math.min(1, elapsed / total), remaining: Math.max(0, nextEvent.getTime() - now.getTime()) };
}

function getSeasonProgress(now: Date): { progress: number; remaining: number } {
  const y = now.getFullYear();
  const allSeasons: Date[] = [
    ...SEASON_MONTHS.map(s => new Date(y, s.m, s.d, 0, 0, 0, 0)),
    new Date(y + 1, 2, 20, 0, 0, 0, 0),
  ];

  let prevEvent: Date | null = null;
  let nextEvent: Date | null = null;
  for (const s of allSeasons) {
    if (s > now) { nextEvent = s; break; }
    prevEvent = s;
  }
  if (!nextEvent || !prevEvent) return { progress: 0, remaining: 0 };

  const total = nextEvent.getTime() - prevEvent.getTime();
  const elapsed = now.getTime() - prevEvent.getTime();
  return { progress: Math.min(1, elapsed / total), remaining: Math.max(0, nextEvent.getTime() - now.getTime()) };
}

const EVENTS: EventDef[] = [
  {
    emoji: "🕐", label: "Next minute",
    compute: (now) => {
      const elapsed = (now.getSeconds() * 1000 + now.getMilliseconds());
      return { progress: elapsed / 60000, remaining: 60000 - elapsed };
    },
  },
  {
    emoji: "⏰", label: "Next hour",
    compute: (now) => {
      const elapsed = (now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
      return { progress: elapsed / 3600000, remaining: 3600000 - elapsed };
    },
  },
  {
    emoji: "🌅", label: "Next day",
    compute: (now) => {
      const elapsed = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000 + now.getMilliseconds();
      return { progress: elapsed / 86400000, remaining: 86400000 - elapsed };
    },
  },
  {
    emoji: "🎯", label: "Palindrome time",
    compute: getSpecialTimeEvent(PALINDROME_TIMES),
  },
  {
    emoji: "🔢", label: "Sequential time",
    compute: getSpecialTimeEvent(SEQUENTIAL_TIMES),
  },
  {
    emoji: "🎲", label: "Double time",
    compute: getSpecialTimeEvent(DOUBLE_TIMES),
  },
  {
    emoji: "☀️", label: "Sunrise (6 AM)",
    compute: getDailyEvent(6),
  },
  {
    emoji: "🌇", label: "Sunset (8 PM)",
    compute: getDailyEvent(20),
  },
  {
    emoji: "💵", label: "Payday (Friday)",
    compute: getWeeklyEvent(5),
  },
  {
    emoji: "📅", label: "Weekend (Saturday)",
    compute: getWeeklyEvent(6),
  },
  {
    emoji: "🌕", label: "Full moon",
    compute: getMoonPhase("full"),
  },
  {
    emoji: "🌑", label: "New moon",
    compute: getMoonPhase("new"),
  },
  {
    emoji: "✌️", label: "Twin date (month = day)",
    compute: getTwinDateProgress,
  },
  {
    emoji: "🍀", label: "Friday the 13th",
    compute: getFriday13Progress,
  },
  {
    emoji: "🌿", label: "Season change",
    compute: getSeasonProgress,
  },
];

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Now!";
  const totalSeconds = Math.ceil(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (totalMinutes < 60) return `${totalMinutes}m ${seconds}s`;
  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (totalHours < 24) return `${totalHours}h ${minutes}m`;
  const totalDays = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return `${totalDays}d ${hours}h`;
}

function ProgressBar({ event }: { event: EventDef }) {
  const [now, setNow] = useState(new Date());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function tick() {
      setNow(new Date());
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const { progress, remaining } = event.compute(now);
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-[180px] shrink-0 text-[15px] leading-snug">
        {event.emoji} {event.label}
      </span>
      <div className="flex-1 h-[26px] bg-[#d1d5db] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2ecc71] rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-[110px] shrink-0 text-right text-sm text-ink-secondary tabular-nums">
        {formatRemaining(remaining)}
      </span>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <div>
      <div className="divide-y divide-ink/5">
        {EVENTS.map((ev, i) => (
          <ProgressBar key={i} event={ev} />
        ))}
      </div>
      <div className="mt-6 bg-white rounded-xl p-4 text-center border border-ink/10">
        <p className="text-sm text-ink-secondary">
          Each bar shows how far along we are until the next event.
        </p>
      </div>
    </div>
  );
}
