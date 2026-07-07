import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { api, auth } from "@/lib/auth";
import { Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — BugCombat" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
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
      const data = await api<{ user: any; tokens: { refresh: string; access: string } }>("/api/auth/register/", {
        method: "POST",
        body: { username, email, password },
        auth: false,
      });
      auth.setTokens(data.tokens.access, data.tokens.refresh);
      auth.setUser(data.user);
      navigate({ to: "/dashboard" });
    } catch (e: any) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="mx-auto flex max-w-md flex-col px-6 pt-28">
        <h1 className="font-mono text-3xl font-bold tracking-tight">Create your handle</h1>
        <p className="mt-2 text-sm text-muted-foreground">Claim a username and start dueling.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 surface p-6 fade-up">
          <Field label="Username" value={username} onChange={setUsername} autoComplete="username" />
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
          {err && <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">{err}</div>}
          <button disabled={loading} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 glow">
            {loading ? "Creating…" : "Create account"}
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
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
