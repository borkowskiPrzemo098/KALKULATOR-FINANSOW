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
        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
      >
        Resetuj hasło
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="password"
        required
        minLength={8}
        placeholder="Nowe hasło (min. 8 znaków)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-48 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
      />
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {status === "saving" ? "..." : status === "done" ? "✓" : "Zapisz"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-sm text-slate-400 hover:text-slate-700"
      >
        Anuluj
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </form>
  );
}
