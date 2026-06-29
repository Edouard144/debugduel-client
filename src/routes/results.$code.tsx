import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { api, auth } from "@/lib/auth";

export const Route = createFileRoute("/results/$code")({
  head: () => ({ meta: [{ title: "Results — DebugDuel" }] }),
  component: ResultsPage,
});

type Scores = { correctness: number; cleanliness: number; efficiency: number; security: number };
type PlayerResult = { username: string; scores: Scores; total: number; feedback?: string };

function ResultsPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<PlayerResult[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.token) { navigate({ to: "/login" }); return; }
    (async () => {
      try {
        const data = await api<any>(`/api/duels/${code}/submissions/`);
        const subs: any[] = data.submissions ?? data.results ?? data ?? [];
        const parsed: PlayerResult[] = subs.map((s) => {
          const sc = s.scores ?? s.score ?? {};
          const scores: Scores = {
            correctness: num(sc.correctness),
            cleanliness: num(sc.cleanliness),
            efficiency: num(sc.efficiency),
            security: num(sc.security),
          };
          const total = Math.round((scores.correctness + scores.cleanliness + scores.efficiency + scores.security) / 4);
          return {
            username: s.username ?? s.user?.username ?? s.player ?? "player",
            scores,
            total,
            feedback: s.feedback ?? s.ai_feedback,
          };
        });
        parsed.sort((a, b) => b.total - a.total);
        setPlayers(parsed);
        setWinner(data.winner ?? parsed[0]?.username ?? null);
        setFeedback(data.feedback ?? data.ai_feedback ?? parsed[0]?.feedback ?? "");
      } catch (e: any) { setErr(e.message); }
      finally { setLoading(false); }
    })();
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="px-6 py-12 lg:px-12 xl:px-24">
        {loading ? (
          <div className="py-32 text-center text-sm text-muted-foreground">Computing AI verdict…</div>
        ) : err ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{err}</div>
        ) : (
          <>
            {/* Winner banner */}
            <div className="surface fade-up overflow-hidden p-10 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Verdict</p>
              <h1 className="mt-4 font-mono text-5xl font-bold tracking-tight">
                <span className="text-primary glow-text">@{winner ?? "—"}</span>
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">wins the duel</p>
            </div>

            {/* Score bars per player */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {players.map((p, i) => (
                <div key={p.username + i} className={`surface p-6 fade-up ${p.username === winner ? "ring-1 ring-primary/60" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-lg font-semibold">@{p.username}</div>
                      {p.username === winner && <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">winner</div>}
                    </div>
                    <div className="font-mono text-3xl font-bold text-primary">{p.total}</div>
                  </div>
                  <div className="mt-6 space-y-4">
                    <Bar label="Correctness" value={p.scores.correctness} />
                    <Bar label="Cleanliness" value={p.scores.cleanliness} />
                    <Bar label="Efficiency" value={p.scores.efficiency} />
                    <Bar label="Security"    value={p.scores.security} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI feedback */}
            {feedback && (
              <div className="surface mt-8 p-6 fade-up">
                <div className="font-mono text-xs uppercase tracking-wider text-primary">AI feedback</div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{feedback}</p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/dashboard" className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow">Play again</Link>
              <button
                onClick={() => {
                  const url = typeof window !== "undefined" ? window.location.href : "";
                  navigator.clipboard?.writeText(`I just dueled on DebugDuel — winner @${winner}. ${url}`);
                }}
                className="rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium hover:border-primary/50"
              >
                Share result
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function num(v: any): number {
  const n = typeof v === "number" ? v : parseFloat(v);
  if (!isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-out"
          style={{ width: `${value}%`, boxShadow: "0 0 12px var(--primary)" }}
        />
      </div>
    </div>
  );
}
