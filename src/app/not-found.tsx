import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-ink mb-4">404</h1>
      <p className="text-ink-secondary mb-8">
        This page doesn&apos;t exist. Maybe it&apos;s a game that hasn&apos;t been invented yet.
      </p>
      <Link
        href="/"
        className="inline-block bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-accent-hover transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
