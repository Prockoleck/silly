import Link from "next/link";
import type { Game } from "@/data/games";

export default function GameCard({ game, featured }: { game: Game; featured?: boolean }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className={`group block bg-surface border-2 border-ink/10 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(249,115,22,0.15)] hover:border-accent/30 active:scale-[0.98]`}
    >
      <div className="aspect-[16/9] bg-ink/5 overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className={featured ? "p-5 sm:p-6" : "p-4"}>
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className={`font-display text-ink ${featured ? "text-xl" : "text-base"}`}>
            {game.title}
          </h2>
          {game.isNew && (
            <span className="text-xs font-semibold text-accent bg-accent-light px-2.5 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
        <p className={`text-ink-secondary mt-1 leading-relaxed ${featured ? "text-sm" : "text-xs"}`}>
          {game.description}
        </p>
      </div>
    </Link>
  );
}
