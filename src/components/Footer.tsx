import Link from "next/link";
import SupportButton from "./SupportButton";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-12">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-ink-secondary">
        <p>&copy; {new Date().getFullYear()} MiniGames</p>
        <div className="flex items-center gap-4">
          <SupportButton />
          <Link href="/" className="hover:text-accent transition-colors">
            All games
          </Link>
        </div>
      </div>
    </footer>
  );
}
