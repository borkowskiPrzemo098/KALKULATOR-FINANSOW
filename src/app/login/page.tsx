"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MarkIcon } from "@/components/icons";
import ThemeToggle from "@/components/theme-toggle";
import TiltCard from "@/components/tilt-card";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Nieprawidłowy login lub hasło.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45rem 32rem at 50% -10%, rgba(201,164,92,0.14), transparent 60%)",
        }}
      />

      <div className="animate-rise relative w-full max-w-sm">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
          >
            <MarkIcon className="h-5 w-5 text-accent" />
            <span className="text-xs font-medium tracking-wide">
              Kalkulator Finansów Rodzinnych
            </span>
          </Link>
          <ThemeToggle />
        </div>

        <TiltCard className="rounded-2xl border border-border bg-canvas-raised p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Zaloguj się</h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Wpisz login i hasło do swojego budżetu.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Login
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-border-strong px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">
                Hasło
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border-strong px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-negative/10 px-3 py-2 text-sm text-negative-strong">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-50"
            >
              {loading ? "Logowanie…" : "Zaloguj się"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-faint">
            Zapomniałeś hasła? Poproś administratora o reset.
          </p>
        </TiltCard>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Nie masz konta?{" "}
          <Link href="/signup" className="font-medium text-accent hover:text-accent-strong">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}
