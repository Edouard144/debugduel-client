import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { api, auth, WS_BASE } from "@/lib/auth";

export const Route = createFileRoute("/duel/$code")({
  head: () => ({ meta: [{ title: "Duel — BugCombat" }] }),
  component: DuelPage,
});

const STARTERS: Record<string, string> = {
  python: "def solve(arr):\n    # TODO: fix the bug\n    total = 0\n    for i in range(len(arr) + 1):\n        total += arr[i]\n    return total\n",
  javascript: "function solve(arr) {\n  // TODO: fix the bug\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) total += arr[i];\n  return total;\n}\n",
  typescript: "function solve(arr: number[]) {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) total += arr[i];\n  return total;\n}\n",
  go: "package main\nfunc solve(arr []int) int {\n  total := 0\n  for i := 0; i <= len(arr); i++ { total += arr[i] }\n  return total\n}\n",
  rust: "fn solve(arr: &[i32]) -> i32 {\n  let mut t = 0;\n  for i in 0..=arr.len() { t += arr[i]; }\n  t\n}\n",
};

function DuelPage() {
  const { code } = Route.useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [Editor, setEditor] = useState<any>(null);
  const [duel, setDuel] = useState<any>(null);
  const [opponent, setOpponent] = useState<{ username?: string; submitted?: boolean } | null>(null);
  const [meSubmitted, setMeSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 min default
  const totalTime = 180;
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [codeText, setCodeText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  async function fetchOpponent() {
    try {
      const d = await api<any>(`/api/duels/${code}/`);
      if (d.opponent) setOpponent({ username: d.opponent.username, submitted: false });
    } catch {}
  }

  // gate auth + load editor client-side
  useEffect(() => {
    // auth guard removed by request
    // if (!auth.token) { navigate({ to: "/login" }); return; }
    setMounted(true);
    import("@monaco-editor/react").then((m) => setEditor(() => m.default));
  }, [navigate]);

  // fetch duel info
  useEffect(() => {
    if (!mounted) return;
    (async () => {
      try {
        const d = await api<any>(`/api/duels/${code}/`);
        setDuel(d);
        if (d.opponent) setOpponent({ username: d.opponent.username, submitted: false });
        if (d.status === "active") setStarted(true);
      } catch {}
    })();
  }, [mounted, code]);

  // initialize code starter when language known
  useEffect(() => {
    const lang = duel?.language ?? "python";
    if (!codeText) setCodeText(STARTERS[lang] ?? STARTERS.python);
  }, [duel, codeText]);

  // WebSocket
  useEffect(() => {
    if (!mounted) return;
    const ws = new WebSocket(`${WS_BASE}/ws/duels/${code}/`);
    wsRef.current = ws;
    ws.onopen = () => {
      try { ws.send(JSON.stringify({ type: "room_status" })); } catch {}
    };
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const t = msg.type;
        if (t === "room_update") {
          if (msg.status === "active") {
            setStarted(true);
            fetchOpponent();
          }
        }
        if (t === "duel_judged") {
          navigate({ to: "/results/$code", params: { code } });
        }
      } catch {}
    };
    return () => { ws.close(); };
  }, [mounted, code, navigate]);

  // countdown
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [started]);

  async function submit() {
    setSubmitting(true); setErr(null);
    try {
      await api(`/api/duels/${code}/submit/`, { method: "POST", body: { code: codeText } });
      setMeSubmitted(true);
      try { wsRef.current?.send(JSON.stringify({ type: "submitted" })); } catch {}
      if (opponent?.submitted) navigate({ to: "/results/$code", params: { code } });
    } catch (e: any) { setErr(e.message); } finally { setSubmitting(false); }
  }

  async function copyCode() { try { await navigator.clipboard.writeText(code); } catch {} }

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  // Lobby (waiting for opponent + start)
  if (!started || !opponent) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-primary">Room code</p>
          <button
            onClick={copyCode}
            className="mt-3 font-mono text-6xl font-bold tracking-[0.3em] text-foreground glow-text hover:opacity-80"
            title="Click to copy"
          >
            {code}
          </button>
          <p className="mt-2 text-xs text-muted-foreground">Click to copy · share with your opponent</p>

          <div className="mt-10 flex gap-2">
            <Badge>{(duel?.language ?? "—").toString()}</Badge>
            <Badge>{(duel?.difficulty ?? "—").toString()}</Badge>
          </div>

          <div className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary pulse-dot" />
            {opponent ? `Opponent @${opponent.username} joined — starting…` : "Waiting for opponent…"}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="mt-12 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Start solo (practice)
          </button>
        </main>
      </div>
    );
  }

  // Active duel
  const pct = (timeLeft / totalTime) * 100;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* Editor */}
        <div className="flex flex-col border-r border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="text-primary">●</span> {duel?.language ?? "python"} · room {code}
            </div>
            <button
              onClick={submit}
              disabled={submitting || meSubmitted}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50 glow"
            >
              {meSubmitted ? "Submitted ✓" : submitting ? "Submitting…" : "Submit fix"}
            </button>
          </div>
          <div className="flex-1 min-h-[60vh]">
            {Editor ? (
              <Editor
                height="100%"
                theme="vs-dark"
                language={duel?.language ?? "python"}
                value={codeText}
                onChange={(v: string | undefined) => setCodeText(v ?? "")}
                options={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  padding: { top: 16 },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading editor…</div>
            )}
          </div>
          {err && <div className="border-t border-destructive/40 bg-destructive/10 px-4 py-2 text-xs text-destructive">{err}</div>}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 p-6">
          {/* Timer ring */}
          <div className="flex flex-col items-center">
            <div className="relative h-44 w-44">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="44" stroke="var(--border)" strokeWidth="6" fill="none" />
                <circle
                  cx="50" cy="50" r="44"
                  stroke="var(--primary)" strokeWidth="6" fill="none"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={2 * Math.PI * 44 * (1 - pct / 100)}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px var(--primary))", transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-4xl font-bold glow-text">{mm}:{ss}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">time left</div>
              </div>
            </div>
          </div>

          {/* Opponent */}
          <div className="surface p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Opponent</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="font-mono text-sm">@{opponent?.username ?? "—"}</div>
              <div className="flex items-center gap-2 text-xs">
                {opponent?.submitted ? (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-primary">submitted</span>
                ) : (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
                    typing
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="surface p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">You</div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-mono">@{auth.user?.username ?? "you"}</span>
              {meSubmitted
                ? <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-xs text-primary">submitted</span>
                : <span className="text-xs text-muted-foreground">in progress</span>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}
