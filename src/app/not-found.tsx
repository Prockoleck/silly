import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center" style={{ animation: "bounce-in 0.5s ease-out" }}>
      <div className="text-7xl mb-4">🤷</div>
      <h1 className="text-6xl font-bold tracking-tight text-ink mb-4 font-display">404</h1>
      <p className="text-lg text-ink-secondary mb-8 leading-relaxed">
        This page doesn&apos;t exist. Maybe it&apos;s a game that hasn&apos;t been invented yet.
      </p>
      <Link
        href="/"
        className="inline-block bg-accent text-white font-medium px-6 py-3 rounded-xl hover:bg-accent-hover transition-all duration-200 active:scale-95"
      >
        Go home
      </Link>
    </div>
  );
}
