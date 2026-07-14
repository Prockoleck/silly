import Link from "next/link";
import type { ReactNode } from "react";

type GameFrameProps = {
  title: string;
  children: ReactNode;
};

export default function GameFrame({ title, children }: GameFrameProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <nav className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="text-sm font-medium text-ink-secondary hover:text-accent transition-colors"
        >
          &larr; All games
        </Link>
        <span className="text-ink-muted">/</span>
        <span className="text-sm text-ink-muted">{title}</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-8 font-display">
        {title}
      </h1>

      <div
        className="relative bg-surface border-2 border-ink/10 rounded-2xl p-6 sm:p-8 min-h-[300px]"
        style={{ animation: "fade-up 0.4s ease-out" }}
      >
        {children}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-ink-secondary hover:text-accent transition-colors"
        >
          &larr; Back to all games
        </Link>
      </div>
    </div>
  );
}
