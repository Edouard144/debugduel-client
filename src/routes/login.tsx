import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { api, auth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — BugCombat" }] }),
  component: LoginPage,
});

declare global {
  interface Window {
    google?: any;
  }
}

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, []);

  async function handleGoogleLogin(response: { credential: string }) {
    setLoading(true);
    setErr(null);
    try {
      const data = await api<{ user: any; tokens: { refresh: string; access: string }; created: boolean }>(
        "/api/auth/google/",
        { method: "POST", body: { token: response.credential }, auth: false }
      );
      auth.setTokens(data.tokens.access, data.tokens.refresh);
      auth.setUser(data.user);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const data = await api<{ access: string; refresh: string }>("/api/auth/login/", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      auth.setTokens(data.access, data.refresh);
      try {
        const me = await api<any>("/api/auth/me/");
        auth.setUser(me);
      } catch {}
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto flex max-w-md flex-col px-6 pt-28">
        <h1 className="font-mono text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to enter the arena.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4 surface p-6 fade-up">
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
          {err && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
          <button
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 glow"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <div ref={googleBtnRef} className="w-full"></div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          No account? <Link to="/register" className="text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export function Field({
  label, type = "text", value, onChange, autoComplete,
}: { label: string; type?: string; value: string; onChange: (v: string) => void; autoComplete?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}
