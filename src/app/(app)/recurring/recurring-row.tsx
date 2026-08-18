"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";

export default function RecurringRow({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await fetch(`/api/recurring/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await fetch(`/api/recurring/${id}`, { method: "DELETE" });
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={toggle}
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
        onClick={remove}
        disabled={isPending}
        className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-negative/10 hover:text-negative-strong disabled:opacity-50"
        aria-label="Usuń regułę"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
