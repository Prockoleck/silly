export default function SupportButton({ className }: { className?: string }) {
  return (
    <a
      href="#"
      className={`inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-accent transition-colors ${className ?? ""}`}
      title="Support this project"
    >
      <span>☕</span>
      <span>Buy me a coffee</span>
    </a>
  );
}
