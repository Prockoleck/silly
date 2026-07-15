"use client";

import { useState, useMemo, useCallback } from "react";
import { Reorder } from "framer-motion";
import Link from "next/link";

type RankerItem = {
  name: string;
  emoji: string;
  value: number;
  valueLabel: string;
  fact: string;
};

type Category = {
  name: string;
  slug: string;
  emoji: string;
  metric: string;
  metricShort: string;
  items: RankerItem[];
};

const CATEGORIES: Category[] = [
  {
    name: "Animals",
    slug: "animals",
    emoji: "🐘",
    metric: "Weight",
    metricShort: "Weight",
    items: [
      { name: "Blue Whale", emoji: "🐋", value: 200, valueLabel: "200 tons", fact: "The largest animal to ever exist — heavier than 33 T-rexes." },
      { name: "African Elephant", emoji: "🐘", value: 6, valueLabel: "6 tons", fact: "The largest land animal. Its trunk has 40,000 muscles." },
      { name: "Grizzly Bear", emoji: "🐻", value: 0.6, valueLabel: "600 kg", fact: "Can run at 55 km/h — faster than a horse despite weighing 600 kg." },
      { name: "Lion", emoji: "🦁", value: 0.19, valueLabel: "190 kg", fact: "A lion's roar can be heard 8 km away." },
      { name: "Human", emoji: "🧑", value: 0.07, valueLabel: "70 kg", fact: "The only animal that ranks things for fun." },
      { name: "Golden Eagle", emoji: "🦅", value: 0.005, valueLabel: "5 kg", fact: "Can spot a rabbit from 3 km away." },
      { name: "House Cat", emoji: "🐱", value: 0.004, valueLabel: "4 kg", fact: "Sleeps 16 hours a day. Respect." },
      { name: "Hamster", emoji: "🐹", value: 0.00015, valueLabel: "150 g", fact: "Can stuff food worth 20% of its body weight in its cheeks." },
    ],
  },
  {
    name: "Countries",
    slug: "countries",
    emoji: "🌍",
    metric: "Population",
    metricShort: "Pop.",
    items: [
      { name: "India", emoji: "🇮🇳", value: 1440, valueLabel: "1.44B", fact: "Will soon be the most populous country ever recorded." },
      { name: "China", emoji: "🇨🇳", value: 1420, valueLabel: "1.42B", fact: "China's population is now declining for the first time since 1961." },
      { name: "USA", emoji: "🇺🇸", value: 340, valueLabel: "340M", fact: "The US has the most billionaires of any country." },
      { name: "Indonesia", emoji: "🇮🇩", value: 280, valueLabel: "280M", fact: "Made of 17,508 islands, 7,000 of which are uninhabited." },
      { name: "Pakistan", emoji: "🇵🇰", value: 245, valueLabel: "245M", fact: "Home to the world's largest irrigation system." },
      { name: "Nigeria", emoji: "🇳🇬", value: 230, valueLabel: "230M", fact: "By 2100, Nigeria could be the 3rd most populous country." },
      { name: "Brazil", emoji: "🇧🇷", value: 215, valueLabel: "215M", fact: "Brazil has 4 time zones, 26 states, and the Amazon rainforest." },
      { name: "Bangladesh", emoji: "🇧🇩", value: 175, valueLabel: "175M", fact: "One of the most densely populated countries on Earth." },
    ],
  },
  {
    name: "Foods",
    slug: "foods",
    emoji: "🍕",
    metric: "Calories (per 100g)",
    metricShort: "Cal/100g",
    items: [
      { name: "Butter", emoji: "🧈", value: 717, valueLabel: "717 cal", fact: "The calorie king — 80% fat. Delicious but deadly." },
      { name: "Milk Chocolate", emoji: "🍫", value: 546, valueLabel: "546 cal", fact: "The average Swiss person eats 11 kg of chocolate a year." },
      { name: "Pasta", emoji: "🍝", value: 131, valueLabel: "131 cal", fact: "There are over 350 shapes of pasta." },
      { name: "Banana", emoji: "🍌", value: 89, valueLabel: "89 cal", fact: "Bananas are technically berries. Strawberries are not." },
      { name: "Potato", emoji: "🥔", value: 77, valueLabel: "77 cal", fact: "The potato was the first vegetable grown in space." },
      { name: "Apple", emoji: "🍎", value: 52, valueLabel: "52 cal", fact: "Apple seeds contain trace amounts of cyanide. Don't eat a bowl." },
      { name: "Tomato", emoji: "🍅", value: 18, valueLabel: "18 cal", fact: "Botanically a fruit, legally a vegetable (Supreme Court, 1893)." },
      { name: "Cucumber", emoji: "🥒", value: 15, valueLabel: "15 cal", fact: "95% water. The least caloric food known to humanity." },
    ],
  },
  {
    name: "Inventions",
    slug: "inventions",
    emoji: "💡",
    metric: "Year Invented",
    metricShort: "Year",
    items: [
      { name: "Smartphone", emoji: "📱", value: 2007, valueLabel: "2007", fact: "The iPhone launched in 2007. Now 6.8B people have a smartphone." },
      { name: "Internet", emoji: "🌐", value: 1983, valueLabel: "1983", fact: "Born as ARPANET in 1969. The Web (WWW) came in 1991." },
      { name: "Television", emoji: "📺", value: 1927, valueLabel: "1927", fact: "First electronic TV was demonstrated by Philo Farnsworth at 21." },
      { name: "Airplane", emoji: "✈️", value: 1903, valueLabel: "1903", fact: "The Wright Flyer flew for 12 seconds. Now 100K flights take off daily." },
      { name: "Light Bulb", emoji: "💡", value: 1879, valueLabel: "1879", fact: "Edison made the first practical bulb. A competitor's bulb burned for 3 years." },
      { name: "Printing Press", emoji: "🖨️", value: 1440, valueLabel: "1440", fact: "Gutenberg's press made books affordable. Literacy exploded in 50 years." },
      { name: "Wheel", emoji: "⚙️", value: -3500, valueLabel: "~3500 BC", fact: "The first wheels were pottery wheels — then someone put them on a cart." },
      { name: "Fire Control", emoji: "🔥", value: -400000, valueLabel: "~400,000 BC", fact: "The first humans to control fire could cook, stay warm, and scare predators." },
    ],
  },
  {
    name: "Cosmos",
    slug: "cosmos",
    emoji: "🌌",
    metric: "Diameter",
    metricShort: "Diameter",
    items: [
      { name: "The Sun", emoji: "☀️", value: 1390000, valueLabel: "1.39M km", fact: "1.3M Earths could fit inside. It loses 4M tons of mass every second." },
      { name: "Jupiter", emoji: "🪐", value: 139820, valueLabel: "139,820 km", fact: "Jupiter's Great Red Spot is a storm larger than Earth." },
      { name: "Earth", emoji: "🌍", value: 12742, valueLabel: "12,742 km", fact: "Earth is the densest planet in the solar system." },
      { name: "Mars", emoji: "🔴", value: 6779, valueLabel: "6,779 km", fact: "Mars has the tallest mountain (Olympus Mons — 21.9 km) in the solar system." },
      { name: "Moon", emoji: "🌙", value: 3475, valueLabel: "3,475 km", fact: "The Moon is slowly drifting away at 3.8 cm per year." },
      { name: "Pluto", emoji: "🟤", value: 2377, valueLabel: "2,377 km", fact: "Pluto is smaller than Earth's moon." },
      { name: "Ceres", emoji: "⚪", value: 946, valueLabel: "946 km", fact: "Largest asteroid in the belt — 1/3 of all asteroid mass." },
      { name: "Rocket", emoji: "🚀", value: 110, valueLabel: "110 m", fact: "The Saturn V remains the tallest rocket ever flown at 110 m." },
    ],
  },
];

type Phase = "select" | "sort" | "pref" | "tier" | "result";

const TIERS = ["S", "A", "B", "C", "D", "F"] as const;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Ranker() {
  const [phase, setPhase] = useState<Phase>("select");
  const [category, setCategory] = useState<Category | null>(null);
  const [sortOrder, setSortOrder] = useState<RankerItem[]>([]);
  const [sortSubmitted, setSortSubmitted] = useState(false);
  const [sortScore, setSortScore] = useState(0);
  const [prefChoices, setPrefChoices] = useState<number[]>([]);
  const [prefRound, setPrefRound] = useState(0);
  const [prefPairs, setPrefPairs] = useState<[RankerItem, RankerItem][]>([]);
  const [tierIndex, setTierIndex] = useState(0);
  const [tierMap, setTierMap] = useState<Record<number, string>>({});
  const [animKey, setAnimKey] = useState(0);

  const startGame = useCallback((cat: Category) => {
    const shuffled = shuffle([...cat.items]);
    setCategory(cat);
    setSortOrder(shuffled);
    setSortSubmitted(false);
    setSortScore(0);
    setPrefChoices([]);
    setPrefRound(0);
    setTierIndex(0);
    setTierMap({});
    setAnimKey((k) => k + 1);
    setPhase("sort");
  }, []);

  const correctOrder = useMemo(() => {
    if (!category) return [];
    return [...category.items].sort((a, b) => b.value - a.value);
  }, [category]);

  const submitSort = useCallback(() => {
    if (!category) return;
    let correct = 0;
    for (let i = 0; i < sortOrder.length; i++) {
      if (sortOrder[i].name === correctOrder[i].name) correct++;
    }
    setSortScore(Math.round((correct / category.items.length) * 100));
    setSortSubmitted(true);
  }, [category, correctOrder, sortOrder]);

  const nextToPref = useCallback(() => {
    if (!category) return;
    const items = [...category.items];
    const pairs: [RankerItem, RankerItem][] = [
      [items[0], items[4]],
      [items[1], items[5]],
      [items[2], items[6]],
      [items[3], items[7]],
    ];
    setPrefPairs(pairs);
    setPrefRound(0);
    setPrefChoices([]);
    setPhase("pref");
    setAnimKey((k) => k + 1);
  }, [category]);

  const pickPref = useCallback((idx: number) => {
    const newChoices = [...prefChoices, idx];
    setPrefChoices(newChoices);
    if (prefRound < 3) {
      setPrefRound((r) => r + 1);
      setAnimKey((k) => k + 1);
    } else {
      setTierIndex(0);
      setTierMap({});
      setPhase("tier");
      setAnimKey((k) => k + 1);
    }
  }, [prefChoices, prefRound]);

  const assignTier = useCallback((tier: string) => {
    if (!category) return;
    const newMap = { ...tierMap, [tierIndex]: tier };
    setTierMap(newMap);
    if (tierIndex < category.items.length - 1) {
      setTierIndex((i) => i + 1);
      setAnimKey((k) => k + 1);
    } else {
      setTierMap(newMap);
      setPhase("result");
      setAnimKey((k) => k + 1);
    }
  }, [category, tierIndex, tierMap]);

  const restart = useCallback(() => {
    setPhase("select");
    setCategory(null);
  }, []);

  const getPersonality = useCallback(() => {
    if (!category) return { label: "", tagline: "", emoji: "" };
    const sTierItem = category.items[Object.entries(tierMap).find(([, t]) => t === "S")?.[0] as unknown as number ?? 0];
    const topPrefItem = prefPairs.map((p, i) => p[prefChoices[i]]);
    const topPref = prefChoices.length > 0 ? prefPairs[0][prefChoices[0]] : null;
    if (sortScore >= 75 && topPref?.name === sTierItem?.name) {
      return { label: "The Consistent Connoisseur", tagline: "You know what you like and you're usually right.", emoji: "👑" };
    }
    if (sortScore >= 75) {
      return { label: "The Savant", tagline: "Uncanny accuracy. You have a brain full of trivia.", emoji: "🧠" };
    }
    if (sortScore >= 50) {
      return { label: "The Enthusiast", tagline: "You're no expert but you've got solid instincts.", emoji: "👍" };
    }
    if (topPref && sTierItem && topPref.name === sTierItem.name) {
      return { label: "The Loyalist", tagline: "Once you pick a favorite, you stick with it.", emoji: "❤️" };
    }
    return { label: "The Free Spirit", tagline: "You go where the wind takes you. No rules.", emoji: "🌪️" };
  }, [category, sortScore, prefPairs, prefChoices, tierMap]);

  const restartCategory = useCallback(() => {
    if (!category) return;
    startGame(category);
  }, [category, startGame]);

  const personality = getPersonality();

  return (
    <div key={animKey} style={{ animation: "fade-up 0.35s ease-out" }}>
      {phase === "select" && (
        <div>
          <p className="text-ink-secondary text-sm mb-6 text-center">Pick a category to rank</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => startGame(cat)}
                className="flex items-center gap-3 p-4 rounded-xl bg-accent-light/50 border-2 border-border hover:border-accent/40 transition-all duration-200 active:scale-[0.98] text-left cursor-pointer"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <div className="font-display font-semibold text-ink">{cat.name}</div>
                  <div className="text-xs text-ink-secondary">Rank by {cat.metric}</div>
                </div>
              </button>
            ))}
          </div>
          <Link
            href="/"
            className="block text-center mt-6 text-sm text-ink-secondary hover:text-accent transition-colors"
          >
            &larr; All games
          </Link>
        </div>
      )}

      {phase === "sort" && category && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={restart} className="text-xs text-ink-secondary hover:text-accent transition-colors">
              &larr; Categories
            </button>
            <span className="text-xs text-ink-secondary">Sort items by <strong>{category.metric}</strong></span>
          </div>
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span className="text-lg">{category.emoji}</span>
            <span className="font-display font-semibold text-ink">{category.name}</span>
          </div>
          <p className="text-xs text-ink-secondary text-center mb-5">
            Drag to reorder from <strong>highest {category.metricShort}</strong> (top) to <strong>lowest</strong> (bottom)
          </p>

          {sortSubmitted ? (
            <div className="space-y-1.5 mb-5">
              {sortOrder.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 select-none ${
                    item.name === correctOrder[i].name
                      ? "bg-green-50 border-green-300"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <span className="text-sm font-mono font-bold w-5 text-center shrink-0">{i + 1}</span>
                  <span className="text-lg shrink-0">{item.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-ink truncate">{item.name}</span>
                  <span className="text-xs text-ink-secondary shrink-0">{item.valueLabel}</span>
                </div>
              ))}
            </div>
          ) : (
            <Reorder.Group axis="y" values={sortOrder} onReorder={setSortOrder} className="space-y-1.5 mb-5">
              {sortOrder.map((item, i) => (
                <Reorder.Item
                  key={item.name}
                  value={item}
                  whileDrag={{
                    scale: 1.05,
                    zIndex: 50,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl border-2 border-border bg-white cursor-grab active:cursor-grabbing select-none hover:border-accent/30 hover:bg-accent-light/10"
                >
                  <span className="text-sm text-ink-muted select-none shrink-0" title="Drag to reorder">☰</span>
                  <span className="text-sm font-mono font-bold w-5 text-center shrink-0 text-ink-muted">{i + 1}</span>
                  <span className="text-lg shrink-0">{item.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-ink truncate">{item.name}</span>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}

          {!sortSubmitted && (
            <button
              onClick={submitSort}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              Submit ranking
            </button>
          )}

          {sortSubmitted && (
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-ink mb-1">{sortScore}%</div>
              <p className="text-xs text-ink-secondary mb-4">
                You got {Math.round((sortScore / 100) * category.items.length)}/{category.items.length} exact
              </p>
              <button
                onClick={nextToPref}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Next: Pick your favorites &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "pref" && category && prefPairs.length > 0 && (
        <div className="max-w-sm mx-auto text-center">
          <div className="flex items-center justify-between mb-4">
            <button onClick={restart} className="text-xs text-ink-secondary hover:text-accent transition-colors">
              &larr; Categories
            </button>
            <span className="text-xs text-ink-secondary">Preference round {prefRound + 1}/4</span>
          </div>
          <p className="text-sm text-ink-secondary mb-6">Which do you prefer?</p>

          <div key={prefRound} style={{ animation: "fade-up 0.3s ease-out" }} className="space-y-3">
            {[0, 1].map((side) => {
              const item = prefPairs[prefRound][side];
              return (
                <button
                  key={`${item.name}-${side}`}
                  onClick={() => pickPref(side)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border bg-white hover:border-accent/40 hover:bg-accent-light/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="font-display font-semibold text-ink text-lg">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === "tier" && category && (
        <div className="max-w-sm mx-auto text-center">
          <div className="flex items-center justify-between mb-4">
            <button onClick={restart} className="text-xs text-ink-secondary hover:text-accent transition-colors">
              &larr; Categories
            </button>
            <span className="text-xs text-ink-secondary">Tier round {tierIndex + 1}/{category.items.length}</span>
          </div>
          <p className="text-sm text-ink-secondary mb-6">Assign to a tier</p>

          <div key={tierIndex} style={{ animation: "fade-up 0.3s ease-out" }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-4xl">{category.items[tierIndex].emoji}</span>
              <span className="font-display font-bold text-xl text-ink">{category.items[tierIndex].name}</span>
            </div>

            <div className="flex justify-center gap-2">
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => assignTier(tier)}
                  className="w-12 h-12 rounded-xl font-display font-bold text-lg text-white transition-all duration-200 active:scale-[0.9] cursor-pointer"
                  style={{
                    backgroundColor:
                      tier === "S" ? "#EF4444" :
                      tier === "A" ? "#F97316" :
                      tier === "B" ? "#EAB308" :
                      tier === "C" ? "#22C55E" :
                      tier === "D" ? "#3B82F6" :
                      "#6B7280",
                  }}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-0.5">
            {category.items.map((item, i) => (
              <span key={item.name} className="text-sm">
                {tierMap[i] ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white"
                    style={{
                      backgroundColor:
                        tierMap[i] === "S" ? "#EF4444" :
                        tierMap[i] === "A" ? "#F97316" :
                        tierMap[i] === "B" ? "#EAB308" :
                        tierMap[i] === "C" ? "#22C55E" :
                        tierMap[i] === "D" ? "#3B82F6" :
                        "#6B7280",
                    }}
                  >
                    {tierMap[i]}
                  </span>
                ) : (
                  <span className="text-ink-muted">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && category && (
        <div className="max-w-sm mx-auto text-center" style={{ animation: "bounce-in 0.5s ease-out" }}>
          <div className="text-5xl mb-3">{personality.emoji}</div>
          <h2 className="font-display font-bold text-xl text-ink mb-1">{personality.label}</h2>
          <p className="text-sm text-ink-secondary mb-6">{personality.tagline}</p>

          <div className="bg-accent-light/50 rounded-2xl border-2 border-border p-4 mb-6 text-left space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-secondary">Accuracy</span>
              <span className="font-bold font-display text-ink">{sortScore}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-secondary">Category</span>
              <span className="font-medium text-ink">{category.emoji} {category.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-secondary">Top pick</span>
              <span className="font-medium text-ink">
                {prefChoices.length > 0 ? `${prefPairs[0][prefChoices[0]].emoji} ${prefPairs[0][prefChoices[0]].name}` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-secondary">S-tier</span>
              <span className="font-medium text-ink">
                {(() => {
                  const sIdx = Object.entries(tierMap).find(([, t]) => t === "S")?.[0];
                  const sItem = sIdx !== undefined ? category.items[Number(sIdx)] : null;
                  return sItem ? `${sItem.emoji} ${sItem.name}` : "—";
                })()}
              </span>
            </div>
          </div>

          <div className="text-xs text-ink-muted mb-6 leading-relaxed italic">
            &ldquo;{category.items.find((_, i) => Object.entries(tierMap).find(([k]) => Number(k) === i)?.[1] === "S") ? category.items[
              Number(Object.entries(tierMap).find(([, t]) => t === "S")?.[0]) | 0
            ].fact : category.items[0].fact}&rdquo;
          </div>

          <div className="flex gap-3">
            <button
              onClick={restartCategory}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              Play again
            </button>
            <button
              onClick={restart}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium text-ink-secondary border-2 border-border hover:bg-surface-hover transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              New category
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
