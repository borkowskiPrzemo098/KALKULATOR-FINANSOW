"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/components/icons";

type Category = { id: string; name: string; type: string };

export default function AddTransactionForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.get("type"),
          amount: data.get("amount"),
          description: data.get("description"),
          categoryId: data.get("categoryId"),
          occurredOn: data.get("occurred_on"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Nie udało się dodać transakcji.");
        return;
      }

      form.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-6 sm:items-end">
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Typ</label>
        <select
          name="type"
          defaultValue="expense"
          className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
        >
          <option value="expense">Wydatek</option>
          <option value="income">Przychód</option>
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Kwota (PLN)</label>
        <input
          type="number"
          name="amount"
          step="0.01"
          min="0.01"
          required
          className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Opis</label>
        <input
          type="text"
          name="description"
          placeholder="np. Zakupy spożywcze"
          className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
        />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Kategoria</label>
        <select name="categoryId" className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm">
          <option value="">—</option>
          <optgroup label="Wydatki">
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="Przychody">
            {incomeCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-medium text-ink-muted">Data</label>
        <input
          type="date"
          name="occurred_on"
          defaultValue={new Date().toISOString().slice(0, 10)}
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-50"
        >
          <PlusIcon className="h-4 w-4" />
          {isPending ? "Dodawanie…" : "Dodaj"}
        </button>
      </div>
    </form>
  );
}
