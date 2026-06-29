import { createFileRoute, Link } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DebugDuel — Debug. Duel. Dominate." },
      { name: "description", content: "Real-time competitive coding duels, judged by AI." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 dot-bg opacity-30" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 0%, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%), linear-gradient(to bottom, transparent 60%, var(--background))",
          }}
        />

        <div className="relative grid gap-12 px-6 pt-20 pb-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-12 xl:px-24">
          {/* Left */}
          <div className="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
              Live duels happening now
            </span>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Debug. Duel.<br />
              <span className="italic text-primary">Dominate.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              DebugDuel pits two developers against the same broken function. Fix the bug
              faster — and cleaner — than your opponent. Judged in seconds by AI, not by opinion.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Start a duel <span aria-hidden>→</span>
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground hover:border-primary/50"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Right — featured duel card */}
          <div className="fade-up relative">
            {/* Floating verdict pill */}
            <div className="absolute -left-4 top-8 z-10 hidden rounded-xl border border-border bg-surface-elevated px-4 py-3 shadow-2xl sm:block">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Verdict in</div>
              <div className="font-mono text-2xl font-bold text-primary">0.8s</div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
              {/* gold top stripe */}
              <div className="h-1 w-full bg-primary" />

              <div className="grid grid-cols-2 gap-px bg-border">
                {/* Player A */}
                <PlayerPane
                  name="@alex"
                  status="submitted"
                  lang="python"
                  code={`def solve(arr):
    total = 0
    for i in range(len(arr)):
        total += arr[i]
    return total`}
                  winning
                />
                {/* Player B */}
                <PlayerPane
                  name="@nova"
                  status="typing…"
                  lang="python"
                  code={`def solve(arr):
    total = 0
    for i in range(len(arr) + 1):
        total += arr[i]
    return total`}
                />
              </div>

              <div className="grid grid-cols-4 gap-px border-t border-border bg-border">
                {[
                  ["Correctness", 98],
                  ["Cleanliness", 92],
                  ["Efficiency", 95],
                  ["Security", 90],
                ].map(([k, v]) => (
                  <div key={k as string} className="bg-surface p-3">
                    <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">{k}</div>
                    <div className="mt-1 font-mono text-lg font-bold text-foreground">{v}</div>
                    <div className="mt-1 h-0.5 w-full rounded-full bg-border">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — features */}
      <section id="features" className="bg-surface text-foreground">
        <div className="px-6 py-24 lg:px-12 xl:px-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why DebugDuel</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Skill, judged by code — not by opinion.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            Every duel is scored on four objective dimensions by an AI judge that reviews
            both submissions side-by-side. No favoritism, no rubric arguments.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FeatureCard
              tag="Real-time"
              title="Live opponent presence"
              body="WebSocket-backed lobbies show when your opponent joins, types, and submits. No refresh, no guesswork."
              icon={
                <path d="M4 12h4l2-6 4 12 2-6h4" strokeLinecap="round" strokeLinejoin="round" />
              }
            />
            <FeatureCard
              tag="AI judge"
              title="Four-dimension scoring"
              body="Correctness, cleanliness, efficiency, and security — each scored independently with written feedback."
              icon={
                <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" strokeLinejoin="round" />
              }
            />
            <FeatureCard
              tag="Pro editor"
              title="Monaco in the browser"
              body="The same editor that powers VS Code, tuned with JetBrains Mono and a focused dark theme."
              icon={
                <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              }
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — back on dark */}
      <section id="how" className="relative">
        <div aria-hidden className="absolute inset-0 dot-bg opacity-20" />
        <div className="relative px-6 py-24 lg:px-12 xl:px-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">The process</p>
          <h2 className="mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            From challenge to verdict in four steps.
          </h2>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {[
              ["Create", "Pick a language and difficulty. We spin up a private room with a unique code."],
              ["Invite", "Share the room code. Your opponent joins instantly over WebSocket."],
              ["Duel", "Both players see the same buggy function. The timer starts. Fix it — fast."],
              ["Verdict", "AI scores both submissions across four dimensions. Winner is announced."],
            ].map(([t, b], i) => (
              <div key={t} className="bg-background p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/40 bg-primary/10 font-mono text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div className="mt-4 text-base font-semibold">{t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-surface p-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Ready to settle it in code?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create a room in seconds. No setup, no install.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/register" className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Create account
              </Link>
              <Link to="/login" className="rounded-lg border border-border bg-background px-5 py-3 text-sm font-medium hover:border-primary/50">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground lg:px-12 xl:px-24">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-md bg-primary" />
            <span>DebugDuel</span>
          </div>
          <span>© {new Date().getFullYear()} DebugDuel. Built for developers who like to win.</span>
        </div>
      </footer>
    </div>
  );
}

function PlayerPane({
  name, status, lang, code, winning,
}: { name: string; status: string; lang: string; code: string; winning?: boolean }) {
  return (
    <div className={`bg-surface p-4 ${winning ? "relative" : ""}`}>
      <div className="mb-2 flex items-center justify-between">
        <div className="font-mono text-xs font-semibold">{name}</div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {status === "submitted" ? (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-primary">submitted</span>
          ) : (
            <>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
              {status}
            </>
          )}
        </div>
      </div>
      <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">{lang}</div>
      <pre className="overflow-hidden whitespace-pre rounded-md border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground/90">{code}</pre>
      {winning && (
        <div className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
          winner
        </div>
      )}
    </div>
  );
}

function FeatureCard({ tag, title, body, icon }: { tag: string; title: string; body: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{tag}</p>
      <div className="mt-4 flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {icon}
          </svg>
        </span>
        <div>
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}
