import Link from "next/link";
import type { Game } from "@/data/games";

export default function GameCard({ game, featured }: { game: Game; featured?: boolean }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`group block bg-surface border border-border rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] ${
        featured ? "p-6 sm:p-7" : "p-5"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className={`${featured ? "text-3xl" : "text-2xl"} flex-shrink-0`}>
          {game.icon}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className={`font-semibold text-ink ${featured ? "text-lg" : ""}`}>
              {game.title}
            </h2>
            {game.isNew && (
              <span className="text-xs font-semibold text-accent bg-accent-light px-2 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </div>
          <p className={`text-ink-secondary mt-1 ${featured ? "text-base" : "text-sm"}`}>
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
