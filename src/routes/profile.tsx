import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { api, auth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — BugCombat" }] }),
  component: ProfilePage,
});

type UserProfile = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  total_duels: number;
  wins: number;
  losses: number;
  created_at: string;
};

function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.token) { navigate({ to: "/login" }); return; }
    (async () => {
      try {
        const data = await api<UserProfile>("/api/auth/me/");
        setProfile(data);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="flex items-center justify-center py-32 text-sm text-muted-foreground">Loading profile…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="mx-auto max-w-md px-6 pt-28">
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">{err}</div>
        </div>
      </div>
    );
  }

  const winRate = profile && profile.total_duels > 0
    ? Math.round((profile.wins / profile.total_duels) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="mx-auto max-w-2xl px-6 pt-28 pb-12">
        <div className="surface p-8 fade-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">@{profile?.username}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{profile?.email}</p>
              {profile?.bio && <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>}
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4">
            <StatCard label="Duels" value={profile?.total_duels ?? 0} />
            <StatCard label="Wins" value={profile?.wins ?? 0} highlight />
            <StatCard label="Losses" value={profile?.losses ?? 0} />
            <StatCard label="Win Rate" value={`${winRate}%`} />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number | string; highlight?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-background p-4 text-center">
      <div className={`font-mono text-2xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
