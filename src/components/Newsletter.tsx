export default function Newsletter() {
  return (
    <div className="border-t border-border mt-8 pt-8 text-center">
      <p className="text-sm text-ink-secondary mb-3">
        Get new games by email. One every couple of weeks.
      </p>
      <form
        className="flex gap-2 max-w-sm mx-auto"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
