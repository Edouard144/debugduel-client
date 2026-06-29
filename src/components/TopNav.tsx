import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "./ThemeToggle";

export function TopNav() {
  const router = useRouter();
  const [user, setUser] = useState(auth.user);
  useEffect(() => { const u = auth.subscribe(() => setUser(auth.user)); return () => { u; }; }, []);

  return (
    <div className="sticky top-6 z-40 w-full px-6 lg:px-12 xl:px-24">
      <header className="mx-auto flex h-14 w-full items-center justify-between rounded-full bg-white dark:bg-zinc-900 px-6 shadow-xl dark:shadow-md dark:shadow-black/20 ring-1 ring-black/5 dark:ring-white/10 transition-all">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center text-black dark:text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[15px] font-bold uppercase tracking-wider text-black dark:text-white">DebugDuel</span>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden items-center gap-8 text-[13px] font-semibold text-zinc-500 dark:text-zinc-400 md:flex">
          <a href="/#features" className="text-zinc-900 dark:text-white transition-colors hover:text-black dark:hover:text-white">Features</a>
          <a href="/#how" className="transition-colors hover:text-black dark:hover:text-white">How it works</a>
          <Link to={auth.token ? "/dashboard" : "/login"} className="transition-colors hover:text-black dark:hover:text-white">Dashboard</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          <ThemeToggle />
          {auth.token ? (
            <>
              {user?.username && <span className="hidden text-xs font-medium text-zinc-400 dark:text-zinc-500 md:inline">@{user.username}</span>}
              <button
                onClick={() => { auth.clear(); router.navigate({ to: "/" }); }}
                className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 transition-colors hover:text-black dark:hover:text-white"
              >
                Log out
              </button>
              <Link to="/dashboard" className="rounded-full bg-black dark:bg-white px-5 py-2 text-[13px] font-semibold text-white dark:text-black shadow-sm transition-opacity hover:opacity-90">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 transition-colors hover:text-black dark:hover:text-white">Log in</Link>
              <Link to="/register" className="rounded-full bg-black dark:bg-white px-5 py-2 text-[13px] font-semibold text-white dark:text-black shadow-sm transition-opacity hover:opacity-90">
                Start Free
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
