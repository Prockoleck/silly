import GameCard from "@/components/GameCard";
import { games } from "@/data/games";

export default function Home() {
  const [first, ...rest] = games;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <header className="mb-16" style={{ animation: "bounce-in 0.6s ease-out" }}>
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-ink font-display">
          Silly
        </h1>
        <p className="text-lg text-ink-secondary mt-3 max-w-lg leading-relaxed">
          A playful collection of interactive experiments and mini-games.
          Free, no signup, just fun.
        </p>
      </header>

      {first && (
        <div
          className="mb-6"
          style={{ animation: "bounce-in 0.5s ease-out 0.1s both" }}
        >
          <GameCard game={first} featured />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {rest.map((game, i) => (
          <div
            key={game.slug}
            style={{
              animation: `bounce-in 0.4s ease-out ${0.2 + i * 0.1}s both`,
            }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}
