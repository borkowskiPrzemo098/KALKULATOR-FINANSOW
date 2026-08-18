"use client";

import { useState } from "react";

export default function ResetPasswordForm({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Nie udało się zresetować hasła.");
      setStatus("error");
      return;
    }

    setStatus("done");
    setPassword("");
    setTimeout(() => {
      setOpen(false);
      setStatus("idle");
    }, 1500);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start rounded-full border border-border-strong px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent hover:text-accent"
      >
        Resetuj hasło
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        type="password"
        required
        minLength={8}
        placeholder="Nowe hasło (min. 8 znaków)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-48 rounded-lg border border-border-strong px-2.5 py-1.5 text-sm"
      />
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {status === "saving" ? "…" : status === "done" ? "✓" : "Zapisz"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-sm text-ink-faint hover:text-ink-muted"
      >
        Anuluj
      </button>
      {error && <span className="w-full text-xs text-negative-strong">{error}</span>}
    </form>
  );
}
