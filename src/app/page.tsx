import GameCard from "@/components/GameCard";
import { games } from "@/data/games";

export default function Home() {
  const [first, ...rest] = games;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <header className="mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-ink">
          Silly
        </h1>
        <p className="text-lg text-ink-secondary mt-3 max-w-md">
          A collection of interactive experiments and mini-games.
          Free, no signup, just fun.
        </p>
      </header>

      {first && (
        <div className="mb-6" style={{ animation: "fade-up 0.4s ease-out" }}>
          <GameCard game={first} featured />
        </div>
      )}

      <div
        className="grid gap-4 sm:grid-cols-2"
        style={{ animation: "fade-up 0.4s ease-out 0.15s both" }}
      >
        {rest.map((game, i) => (
          <div
            key={game.slug}
            style={{
              animation: `stagger-in 0.35s ease-out ${0.2 + i * 0.08}s both`,
            }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}
