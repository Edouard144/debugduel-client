import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { api, auth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — DebugDuel" }] }),
  component: Dashboard,
});

type LeaderRow = { username: string; wins?: number; losses?: number; rating?: number; score?: number };

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.user);
  const [leaders, setLeaders] = useState<LeaderRow[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [difficulty, setDifficulty] = useState("medium");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // auth guard removed by request
    // if (!auth.token) { navigate({ to: "/login" }); return; }
    (async () => {
      try {
        if (!auth.user && auth.token) { const me = await api<any>("/api/auth/me/"); auth.setUser(me); setUser(me); }
        const lb = await api<any>("/api/auth/leaderboard/");
        const rows: LeaderRow[] = Array.isArray(lb) ? lb : (lb?.results ?? lb?.leaderboard ?? []);
        setLeaders(rows);
      } catch (e: any) { setErr(e.message); }
    })();
  }, [navigate]);

  async function createDuel() {
    setCreating(true); setErr(null);
    try {
      const d = await api<any>("/api/duels/create/", { method: "POST", body: { language, difficulty } });
      const code = d.code || d.room_code || d.id;
      navigate({ to: "/duel/$code", params: { code: String(code) } });
    } catch (e: any) { setErr(e.message); } finally { setCreating(false); }
  }

  async function joinDuel() {
    if (!joinCode.trim()) return;
    setJoining(true); setErr(null);
    try {
      await api(`/api/duels/${joinCode.trim()}/join/`, { method: "POST" });
      navigate({ to: "/duel/$code", params: { code: joinCode.trim() } });
    } catch (e: any) { setErr(e.message); } finally { setJoining(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12 xl:px-24">
        <div className="fade-up">
          <p className="font-mono text-xs uppercase tracking-wider text-primary">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {user?.username ? `@${user.username}` : "Ready to duel?"}
          </h1>
        </div>

        {err && <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Create */}
          <section className="surface p-6 fade-up">
            <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">Create a duel</h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Select label="Language" value={language} onChange={setLanguage} options={["python","javascript","typescript","go","rust","java","cpp"]} />
              <Select label="Difficulty" value={difficulty} onChange={setDifficulty} options={["easy","medium","hard","expert"]} />
            </div>
            <button onClick={createDuel} disabled={creating} className="mt-6 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 glow">
              {creating ? "Spinning up arena…" : "Create duel"}
            </button>
          </section>

          {/* Join */}
          <section className="surface p-6 fade-up">
            <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">Join with code</h2>
            <div className="mt-5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Room code</span>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABCD-1234"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-lg tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>
            </div>
            <button onClick={joinDuel} disabled={joining || !joinCode.trim()} className="mt-6 w-full rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/60 disabled:opacity-50">
              {joining ? "Joining…" : "Join duel →"}
            </button>
          </section>
        </div>

        {/* Leaderboard */}
        <section className="mt-10 surface overflow-hidden fade-up">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">Leaderboard</h2>
            <span className="text-xs text-muted-foreground">Top duelists</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 w-12">#</th>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3 text-right">Wins</th>
                <th className="px-6 py-3 text-right">Losses</th>
                <th className="px-6 py-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {leaders.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">No players ranked yet. Be the first.</td></tr>
              )}
              {leaders.slice(0, 20).map((row, i) => (
                <tr key={(row.username ?? "") + i} className="border-t border-border/60 hover:bg-surface-elevated/40">
                  <td className="px-6 py-3 font-mono text-muted-foreground">{i + 1}</td>
                  <td className="px-6 py-3 font-medium">@{row.username}</td>
                  <td className="px-6 py-3 text-right font-mono">{row.wins ?? 0}</td>
                  <td className="px-6 py-3 text-right font-mono text-muted-foreground">{row.losses ?? 0}</td>
                  <td className="px-6 py-3 text-right font-mono text-primary">{row.rating ?? row.score ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary capitalize"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
