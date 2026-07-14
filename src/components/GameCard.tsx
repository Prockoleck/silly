import Link from "next/link";
import type { Game } from "@/data/games";

export default function GameCard({ game, featured }: { game: Game; featured?: boolean }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`group block bg-surface border-2 border-ink/10 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(249,115,22,0.15)] hover:border-accent/30 active:scale-[0.98] ${
        featured ? "p-6 sm:p-7" : "p-5"
      }`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`${
            featured ? "text-3xl" : "text-2xl"
          } flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]`}
        >
          {game.icon}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className={`font-display text-ink ${featured ? "text-xl" : "text-lg"}`}>
              {game.title}
            </h2>
            {game.isNew && (
              <span className="text-xs font-semibold text-accent bg-accent-light px-2.5 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </div>
          <p className={`text-ink-secondary mt-1 leading-relaxed ${featured ? "text-base" : "text-sm"}`}>
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
