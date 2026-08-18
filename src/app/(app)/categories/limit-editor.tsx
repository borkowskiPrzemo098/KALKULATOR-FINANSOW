"use client";

import { useState, useTransition } from "react";
import { setCategoryLimit } from "./actions";

export default function LimitEditor({
  categoryId,
  initialLimit,
}: {
  categoryId: string;
  initialLimit: number | null;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialLimit ? String(initialLimit) : "");
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const num = value.trim() === "" ? null : Number(value);
      await setCategoryLimit(categoryId, num && num > 0 ? num : null);
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-ink-muted underline decoration-dotted hover:text-accent"
      >
        {initialLimit ? `Limit: ${initialLimit.toLocaleString("pl-PL")} zł` : "Ustaw limit"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="zł / mies."
        className="w-24 rounded-md border border-border-strong px-2 py-1 text-xs"
        autoFocus
      />
      <button
        onClick={save}
        disabled={isPending}
        className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-ink disabled:opacity-50"
      >
        OK
      </button>
      <button onClick={() => setOpen(false)} className="text-xs text-ink-faint hover:text-ink-muted">
        Anuluj
      </button>
    </div>
  );
}
