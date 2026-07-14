import Link from "next/link";
import type { Game } from "@/data/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block bg-surface border border-border rounded-xl p-5 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{game.icon}</span>
        <h2 className="font-semibold text-ink">{game.title}</h2>
        {game.isNew && (
          <span className="text-xs font-medium text-accent bg-accent-light px-2 py-0.5 rounded-full">
            NEW
          </span>
        )}
      </div>
      <p className="text-sm text-ink-secondary">{game.description}</p>
    </Link>
  );
}
