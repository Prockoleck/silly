import Link from "next/link";
import type { Game } from "@/data/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="block bg-[#e7e7e7] rounded-[15px] overflow-hidden transition-all duration-[70ms] ease-linear hover:scale-[1.023] hover:shadow-[3px_6px_6px_0_rgba(0,0,0,0.11)] active:scale-[1.011] active:shadow-[3px_6px_6px_0_rgba(0,0,0,0.15)]"
    >
      <img
        src={game.image}
        alt={game.title}
        className="w-full aspect-[43/24] block max-w-full border-[3px] border-black"
        loading="lazy"
      />
    </Link>
  );
}
