import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground lg:px-12 xl:px-24">
        <Link to="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">BugCombat</span>
        </Link>
        <span>&copy; {new Date().getFullYear()} BugCombat. Built for developers who like to win.</span>
      </div>
    </footer>
  );
}
