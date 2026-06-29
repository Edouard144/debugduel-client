import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";

export function TopNav() {
  const router = useRouter();
  const [user, setUser] = useState(auth.user);
  useEffect(() => { const u = auth.subscribe(() => setUser(auth.user)); return () => { u; }; }, []);

  return (
    <div className="sticky top-6 z-40 w-full px-6 lg:px-12 xl:px-24">
      <header className="mx-auto flex h-14 w-full items-center justify-between rounded-full bg-white px-6 shadow-xl ring-1 ring-black/5 transition-all">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center text-black">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[15px] font-bold uppercase tracking-wider text-black">DebugDuel</span>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden items-center gap-8 text-[13px] font-semibold text-zinc-500 md:flex">
          <a href="/#features" className="text-zinc-900 transition-colors hover:text-black">Features</a>
          <a href="/#how" className="transition-colors hover:text-black">How it works</a>
          <Link to={auth.token ? "/dashboard" : "/login"} className="transition-colors hover:text-black">Dashboard</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          {auth.token ? (
            <>
              {user?.username && <span className="hidden text-xs font-medium text-zinc-400 md:inline">@{user.username}</span>}
              <button
                onClick={() => { auth.clear(); router.navigate({ to: "/" }); }}
                className="text-[13px] font-semibold text-zinc-600 transition-colors hover:text-black"
              >
                Log out
              </button>
              <Link to="/dashboard" className="rounded-full bg-black px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[13px] font-semibold text-zinc-600 transition-colors hover:text-black">Log in</Link>
              <Link to="/register" className="rounded-full bg-black px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
                Start Free
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
