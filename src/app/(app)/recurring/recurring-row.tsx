"use client";

import { useTransition } from "react";
import { TrashIcon } from "@/components/icons";
import { toggleRecurring, deleteRecurring } from "./actions";

export default function RecurringRow({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => startTransition(() => toggleRecurring(id, !active))}
        disabled={isPending}
        aria-pressed={active}
        aria-label={active ? "Wyłącz regułę" : "Włącz regułę"}
        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
          active
            ? "border-accent/40 bg-accent/15 text-accent-strong"
            : "border-border-strong text-ink-faint"
        }`}
      >
        {active ? "Aktywna" : "Wstrzymana"}
      </button>
      <button
        onClick={() => startTransition(() => deleteRecurring(id))}
        disabled={isPending}
        className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-negative/10 hover:text-negative-strong disabled:opacity-50"
        aria-label="Usuń regułę"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
