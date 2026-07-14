"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";

type Item = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: string;
  description: string;
};

const MIN_WAGE = 7.25;

function hoursAtMinWage(price: number): string {
  const hours = price / MIN_WAGE;
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} hrs`;
  const days = hours / 8;
  if (days < 365) return `${Math.round(days)} work days`;
  return `${(days / 365).toFixed(1)} years`;
}

const CATEGORIES = [
  { id: "food", label: "Food", emoji: "🍔" },
  { id: "housing", label: "Housing", emoji: "🏠" },
  { id: "transport", label: "Rides", emoji: "🚗" },
  { id: "luxury", label: "Luxury", emoji: "💎" },
  { id: "tech", label: "Tech", emoji: "🖥️" },
  { id: "experiences", label: "Experiences", emoji: "🎪" },
  { id: "absurd", label: "Absurd", emoji: "🤪" },
];

const ITEMS: Item[] = [
  { id: "coffee", name: "Cup of Coffee", emoji: "☕", price: 5, category: "food", description: "Just a regular morning brew" },
  { id: "avocado-toast", name: "Avocado Toast", emoji: "🥑", price: 18, category: "food", description: "The millennial classic" },
  { id: "pizza", name: "Large Pizza", emoji: "🍕", price: 20, category: "food", description: "Pepperoni, obviously" },
  { id: "sushi", name: "Omakase Sushi", emoji: "🍣", price: 300, category: "food", description: "Top-tier chef's choice" },
  { id: "gold-pizza", name: "Gold Leaf Pizza", emoji: "🥩", price: 2000, category: "food", description: "24k gold flakes on pizza" },
  { id: "diamond-water", name: "Diamond Water", emoji: "💧", price: 50000, category: "food", description: "Fancy water in a diamond bottle" },

  { id: "motel", name: "Night in a Motel", emoji: "🛏️", price: 80, category: "housing", description: "One night, basic room" },
  { id: "month-rent", name: "Month of Rent", emoji: "🏢", price: 1500, category: "housing", description: "Average US monthly rent" },
  { id: "tiny-house", name: "Tiny House", emoji: "🏡", price: 80000, category: "housing", description: "Cute little house on wheels" },
  { id: "average-house", name: "Average US House", emoji: "🏠", price: 350000, category: "housing", description: "3 bed, 2 bath suburban home" },
  { id: "mansion", name: "Beverly Hills Mansion", emoji: "🏰", price: 20000000, category: "housing", description: "Pool, tennis court, 8 bedrooms" },

  { id: "bicycle", name: "Bicycle", emoji: "🚲", price: 500, category: "transport", description: "Two wheels, no engine" },
  { id: "scooter", name: "Electric Scooter", emoji: "🛴", price: 800, category: "transport", description: "Last mile champion" },
  { id: "used-car", name: "Used Honda Civic", emoji: "🚗", price: 25000, category: "transport", description: "Reliable, 60k miles" },
  { id: "tesla", name: "Tesla Model S", emoji: "⚡", price: 80000, category: "transport", description: "Electric, autopilot, fast" },
  { id: "private-jet", name: "Private Jet", emoji: "✈️", price: 5000000, category: "transport", description: "Fly anywhere, anytime" },
  { id: "yacht", name: "Luxury Yacht", emoji: "🛥️", price: 10000000, category: "transport", description: "80ft with a jacuzzi" },

  { id: "watch", name: "Designer Watch", emoji: "⌚", price: 5000, category: "luxury", description: "Tells time + flexes hard" },
  { id: "diamond-ring", name: "Diamond Ring", emoji: "💍", price: 50000, category: "luxury", description: "2 carat, flawless cut" },
  { id: "lambo", name: "Lamborghini", emoji: "🏎️", price: 400000, category: "luxury", description: "Huracán, bright orange" },
  { id: "gold-toilet", name: "Solid Gold Toilet", emoji: "🚽", price: 1200000, category: "luxury", description: "18 karat, fully functional" },
  { id: "private-island", name: "Private Island", emoji: "🏝️", price: 50000000, category: "luxury", description: "Your own tropical paradise" },

  { id: "iphone", name: "iPhone Pro Max", emoji: "📱", price: 1200, category: "tech", description: "The latest, max storage" },
  { id: "gaming-pc", name: "Gaming PC", emoji: "🖥️", price: 4000, category: "tech", description: "RTX 5090, 64GB RAM" },
  { id: "home-theater", name: "Home Theater", emoji: "🎬", price: 25000, category: "tech", description: "8K projector, Dolby Atmos" },
  { id: "robot", name: "Robot Dog", emoji: "🤖", price: 75000, category: "tech", description: "Walks, dances, fetches beer" },

  { id: "movie-ticket", name: "Movie Ticket", emoji: "🎟️", price: 15, category: "experiences", description: "IMAX, big popcorn included" },
  { id: "concert", name: "Concert Ticket", emoji: "🎫", price: 200, category: "experiences", description: "Front row, VIP passes" },
  { id: "balloon", name: "Hot Air Balloon", emoji: "🎈", price: 500, category: "experiences", description: "Sunrise over the valley" },
  { id: "space-trip", name: "Space Tourism", emoji: "🚀", price: 250000, category: "experiences", description: "See Earth from orbit" },
  { id: "submarine", name: "Submarine Trip", emoji: "🛸", price: 1000000, category: "experiences", description: "Titanic wreck tour" },

  { id: "dinosaur", name: "Buy a Dinosaur Skeleton", emoji: "🦕", price: 8000000, category: "absurd", description: "T-Rex replica, museum quality" },
  { id: "nft", name: "One Pixel NFT", emoji: "🟦", price: 2000000, category: "absurd", description: "A blue pixel. You own it." },
  { id: "tv-ads", name: "Super Bowl Ad (1 sec)", emoji: "📺", price: 200000, category: "absurd", description: "One second of airtime" },
  { id: "pigeon", name: "Trained Pigeon Army", emoji: "🐦", price: 500000, category: "absurd", description: "100 pigeons, perfectly trained" },
];

function formatMoney(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function formatMoneyFull(n: number): string {
  return `$${n.toLocaleString()}`;
}

function useAnimatedValue(target: number, duration = 500) {
  const [displayed, setDisplayed] = useState(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const startVal = displayed;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return displayed;
}

type Purchase = {
  itemId: string;
  itemName: string;
  price: number;
  emoji: string;
  timestamp: number;
};

export default function SpendABillion() {
  const STARTING = 1_000_000_000;
  const [money, setMoney] = useState(STARTING);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [showReceipt, setShowReceipt] = useState(false);
  const [toast, setToast] = useState<{ name: string; price: number } | null>(null);

  const spent = STARTING - money;
  const percentSpent = (spent / STARTING) * 100;
  const animatedMoney = useAnimatedValue(money, 400);
  const receiptRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(
    () => ITEMS.filter((i) => i.category === selectedCategory),
    [selectedCategory]
  );

  const buy = useCallback(
    (item: Item) => {
      if (money < item.price) return;
      setMoney((m) => m - item.price);
      setPurchases((p) => [
        { itemId: item.id, itemName: item.name, price: item.price, emoji: item.emoji, timestamp: Date.now() },
        ...p,
      ]);
      setToast({ name: item.name, price: item.price });
      setTimeout(() => setToast(null), 2000);
    },
    [money]
  );

  const reset = useCallback(() => {
    setMoney(STARTING);
    setPurchases([]);
    setShowReceipt(false);
    setSelectedCategory("food");
  }, []);

  const spentCategories = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of purchases) {
      const item = ITEMS.find((i) => i.id === p.itemId);
      if (item) map.set(item.category, (map.get(item.category) || 0) + p.price);
    }
    return map;
  }, [purchases]);

  const spentItems = purchases.length;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div
          className="text-4xl sm:text-5xl font-bold tracking-tight text-ink tabular-nums"
          aria-live="polite"
          aria-label={`${animatedMoney.toLocaleString()} dollars remaining`}
        >
          {formatMoneyFull(animatedMoney)}
        </div>
        <p className="text-sm text-ink-muted mt-1">
          remaining of {formatMoneyFull(STARTING)}
        </p>

        <div
          className="mt-4 h-2.5 bg-border rounded-full overflow-hidden max-w-sm mx-auto"
          role="progressbar"
          aria-valuenow={Math.round(percentSpent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${Math.round(percentSpent)}% spent`}
        >
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(percentSpent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-ink-muted mt-1">
          {Math.round(percentSpent)}% spent &middot; {spentItems} item{spentItems !== 1 ? "s" : ""}
        </p>
      </div>

      <div
        className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none"
        role="tablist"
        aria-label="Categories"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              selectedCategory === cat.id
                ? "bg-accent text-white shadow-sm"
                : "bg-surface border border-border text-ink-secondary hover:border-accent hover:text-accent"
            }`}
          >
            <span className="text-base">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div
        className="mt-4 grid gap-3 sm:grid-cols-2"
        key={selectedCategory}
        style={{ animation: "fade-up 0.3s ease-out" }}
      >
        {filteredItems.map((item) => {
          const canAfford = money >= item.price;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4"
            >
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-ink text-sm">{item.name}</div>
                <div className="text-xs text-ink-muted mt-0.5">
                  {formatMoney(item.price)} &middot; {hoursAtMinWage(item.price)} at min wage
                </div>
              </div>
              <button
                onClick={() => buy(item)}
                disabled={!canAfford}
                className={`flex-shrink-0 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  canAfford
                    ? "bg-accent text-white hover:bg-accent-hover active:scale-95"
                    : "bg-border text-ink-muted cursor-not-allowed"
                }`}
                aria-label={`Buy ${item.name} for ${formatMoney(item.price)}`}
              >
                {canAfford ? "Buy" : "Nope"}
              </button>
            </div>
          );
        })}
      </div>

      {purchases.length > 0 && (
        <div className="mt-6" ref={receiptRef}>
          <button
            onClick={() => setShowReceipt(!showReceipt)}
            className="flex items-center justify-between w-full bg-surface border border-border rounded-xl p-4 text-sm font-medium text-ink hover:border-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span>Receipt ({spentItems} item{spentItems !== 1 ? "s" : ""})</span>
            <span className="text-ink-muted">{showReceipt ? "▲" : "▼"}</span>
          </button>

          {showReceipt && (
            <div
              className="mt-2 bg-surface border border-border rounded-xl p-4 text-sm"
              style={{ animation: "fade-up 0.2s ease-out" }}
            >
              {purchases.slice(0, 50).map((p, i) => (
                <div
                  key={`${p.itemId}-${p.timestamp}`}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                  style={{ animation: `fade-up 0.2s ease-out ${i * 0.02}s both` }}
                >
                  <span className="text-ink truncate mr-2">
                    {p.emoji} {p.itemName}
                  </span>
                  <span className="text-ink-muted tabular-nums flex-shrink-0">
                    {formatMoney(p.price)}
                  </span>
                </div>
              ))}
              {purchases.length > 50 && (
                <p className="text-ink-muted text-xs text-center mt-2">
                  ...and {purchases.length - 50} more
                </p>
              )}

              <div className="flex items-center justify-between pt-3 font-semibold text-ink">
                <span>Total spent</span>
                <span className="tabular-nums">{formatMoneyFull(spent)}</span>
              </div>

              {spentCategories.size > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-ink-muted mb-2">By category</p>
                  <div className="space-y-1.5">
                    {CATEGORIES.filter((c) => spentCategories.has(c.id)).map((cat) => {
                      const catTotal = spentCategories.get(cat.id) || 0;
                      return (
                        <div key={cat.id} className="flex items-center gap-2 text-xs">
                          <span className="text-base">{cat.emoji}</span>
                          <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent/60 rounded-full"
                              style={{ width: `${Math.min((catTotal / spent) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-ink-muted tabular-nums w-16 text-right">
                            {formatMoney(catTotal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg text-sm font-medium text-ink-secondary bg-surface border border-border hover:border-accent hover:text-accent transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Start over
        </button>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg z-50 pointer-events-none"
          style={{ animation: "fade-up 0.25s ease-out" }}
          role="status"
          aria-live="polite"
        >
          Bought {toast.name} for {formatMoney(toast.price)}
        </div>
      )}
    </div>
  );
}
