import GameCard from "@/components/GameCard";
import { games } from "@/data/games";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-ink">MiniGames</h1>
        <p className="text-ink-secondary mt-2 max-w-md mx-auto">
          A collection of interactive experiments and mini-games.
          Free to play, no signup required.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}
