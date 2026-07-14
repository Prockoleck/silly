import Link from "next/link";
import type { ReactNode } from "react";

type GameFrameProps = {
  title: string;
  children: ReactNode;
};

export default function GameFrame({ title, children }: GameFrameProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-ink-secondary hover:text-accent transition-colors"
        >
          &larr; All games
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-ink mb-6">{title}</h1>

      <div className="relative bg-surface border border-border rounded-xl p-6 min-h-[300px]">
        {children}
      </div>
    </div>
  );
}
