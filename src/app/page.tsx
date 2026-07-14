import GameCard from "@/components/GameCard";
import { games } from "@/data/games";

export default function Home() {
  return (
    <div className="max-w-[1430px] mx-auto px-[25px] py-12 sm:py-16">
      <header className="mb-10 text-center" style={{ animation: "bounce-in 0.6s ease-out" }}>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-ink font-display">
          Silly
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary mt-2 max-w-lg mx-auto leading-relaxed">
          A playful collection of interactive experiments and mini-games.
          Free, no signup, just fun.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
        {games.map((game, i) => (
          <div
            key={game.slug}
            style={{
              animation: `bounce-in 0.4s ease-out ${0.1 + i * 0.06}s both`,
            }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  );
}
