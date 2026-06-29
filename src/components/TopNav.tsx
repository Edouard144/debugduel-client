import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";

export function TopNav() {
  const router = useRouter();
  const [user, setUser] = useState(auth.user);
  useEffect(() => { const u = auth.subscribe(() => setUser(auth.user)); return () => { u; }; }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-base font-bold tracking-tight">DebugDuel</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <Link to={auth.token ? "/dashboard" : "/login"} className="hover:text-foreground">Dashboard</Link>
        </nav>

        <div className="flex items-center gap-2">
          {auth.token ? (
            <>
              {user?.username && <span className="hidden text-xs text-muted-foreground md:inline">@{user.username}</span>}
              <button
                onClick={() => { auth.clear(); router.navigate({ to: "/" }); }}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
              <Link to="/dashboard" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Open dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">Login</Link>
              <Link to="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Start dueling
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
