"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";

export default function DeleteUserButton({
  userId,
  displayName,
  isSelf,
}: {
  userId: string;
  displayName: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (isSelf) return null;

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Nie udało się usunąć konta.");
        return;
      }
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-negative/10 hover:text-negative-strong"
        aria-label={`Usuń konto ${displayName}`}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-negative-strong">{error}</span>}
      <span className="text-xs text-ink-muted">Na pewno usunąć?</span>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-md bg-negative px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-negative-strong disabled:opacity-50"
      >
        {isPending ? "Usuwanie…" : "Usuń konto"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-xs text-ink-faint hover:text-ink-muted"
      >
        Anuluj
      </button>
    </div>
  );
}
