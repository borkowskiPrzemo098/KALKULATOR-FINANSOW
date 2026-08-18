"use client";

import { useState, useTransition } from "react";
import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  CategoryIcon,
  PencilIcon,
  TrashIcon,
} from "@/components/icons";
import { updateTransaction, deleteTransaction } from "./actions";

type Category = { id: string; name: string; type: string; icon: string; color: string };

export type TransactionRowData = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  occurredOn: string; // yyyy-mm-dd
  categoryId: string | null;
  category: { icon: string; color: string; name: string } | null;
};

function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value);
}

export default function TransactionRow({
  transaction,
  categories,
}: {
  transaction: TransactionRowData;
  categories: Category[];
}) {
  const [editing, setEditing] = useState(false);
  const [type, setType] = useState(transaction.type);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [description, setDescription] = useState(transaction.description ?? "");
  const [occurredOn, setOccurredOn] = useState(transaction.occurredOn);
  const [categoryId, setCategoryId] = useState(transaction.categoryId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const t = transaction;
  const filteredCategories = categories.filter((c) => c.type === type);

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await updateTransaction(t.id, {
          type,
          amount: Number(amount),
          description: description || null,
          occurredOn,
          categoryId: categoryId || null,
        });
        setEditing(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nie udało się zapisać.");
      }
    });
  }

  if (editing) {
    return (
      <li className="px-6 py-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-6 sm:items-end">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-border-strong px-2.5 py-2 text-sm sm:col-span-1"
          >
            <option value="expense">Wydatek</option>
            <option value="income">Przychód</option>
          </select>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-lg border border-border-strong px-2.5 py-2 text-sm sm:col-span-1"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opis"
            className="rounded-lg border border-border-strong px-2.5 py-2 text-sm sm:col-span-2"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-border-strong px-2.5 py-2 text-sm sm:col-span-1"
          >
            <option value="">—</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            className="rounded-lg border border-border-strong px-2.5 py-2 text-sm sm:col-span-1"
          />
        </div>
        {error && <p className="mt-2 text-xs text-negative-strong">{error}</p>}
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={save}
            disabled={isPending}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-50"
          >
            {isPending ? "Zapisywanie…" : "Zapisz"}
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-ink-faint hover:text-ink-muted"
          >
            Anuluj
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 px-6 py-3.5">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={
            t.category
              ? { backgroundColor: `${t.category.color}26`, color: t.category.color }
              : undefined
          }
        >
          {t.category ? (
            <CategoryIcon icon={t.category.icon} className="h-4 w-4" />
          ) : t.type === "income" ? (
            <ArrowUpRightIcon className="h-4 w-4 text-positive" />
          ) : (
            <ArrowDownRightIcon className="h-4 w-4 text-negative" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-ink">{t.description || "(bez opisu)"}</p>
          <p className="text-xs text-ink-faint">
            {t.occurredOn}
            {t.category ? ` · ${t.category.name}` : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <span
          className={`tabular mr-1 text-sm font-medium ${
            t.type === "income" ? "text-positive-strong" : "text-negative-strong"
          }`}
        >
          {t.type === "income" ? "+" : "−"}
          {formatPLN(t.amount)}
        </span>
        <button
          onClick={() => setEditing(true)}
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-accent/10 hover:text-accent"
          aria-label="Edytuj transakcję"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => deleteTransaction(t.id))}
          className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-negative/10 hover:text-negative-strong disabled:opacity-50"
          aria-label="Usuń transakcję"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
