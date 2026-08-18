"use client";

import { useState, useTransition } from "react";
import { addRecurring } from "./actions";

type Category = { id: string; name: string; type: string };

export default function RecurringForm({ categories }: { categories: Category[] }) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = categories.filter((c) => c.type === type);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await addRecurring(formData);
        (document.getElementById("recurring-form") as HTMLFormElement)?.reset();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nie udało się dodać.");
      }
    });
  }

  return (
    <form id="recurring-form" action={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Typ</label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as "expense" | "income")}
          className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
        >
          <option value="expense">Wydatek</option>
          <option value="income">Przychód</option>
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Kwota</label>
        <input
          type="number" name="amount" step="0.01" min="0.01" required
          className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Opis</label>
        <input
          type="text" name="description" placeholder="np. Czynsz"
          className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
        />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Kategoria</label>
        <select name="categoryId" className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm">
          <option value="">—</option>
          {filtered.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Dzień mies.</label>
        <input
          type="number" name="dayOfMonth" min="1" max="28" required defaultValue={1}
          className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
        />
      </div>

      {error && (
        <p className="sm:col-span-6 rounded-lg bg-negative/10 px-3 py-2 text-sm text-negative-strong">
          {error}
        </p>
      )}

      <div className="sm:col-span-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-50"
        >
          {isPending ? "Dodawanie…" : "Dodaj regułę"}
        </button>
      </div>
    </form>
  );
}
