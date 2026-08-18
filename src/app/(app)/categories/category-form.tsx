"use client";

import { useState, useTransition } from "react";
import {
  CATEGORY_ICONS,
  CATEGORY_ICON_LABELS,
  type CategoryIconKey,
} from "@/components/icons";
import { addCategory } from "./actions";

const PALETTE = [
  "#c9a45c", "#8fae86", "#c77b63", "#7a9bb8",
  "#b487c9", "#c9c15c", "#5cc9a4", "#c95c8a",
];

export default function CategoryForm() {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [icon, setIcon] = useState<CategoryIconKey>("other");
  const [color, setColor] = useState(PALETTE[0]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await addCategory(formData);
        (document.getElementById("category-form") as HTMLFormElement)?.reset();
        setIcon("other");
        setColor(PALETTE[0]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nie udało się dodać kategorii.");
      }
    });
  }

  return (
    <form id="category-form" action={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            Nazwa
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="np. Jedzenie"
            className="w-full rounded-lg border border-border-strong px-3 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            Typ
          </label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as "expense" | "income")}
            className="w-full rounded-lg border border-border-strong px-3 py-2.5 text-sm"
          >
            <option value="expense">Wydatek</option>
            <option value="income">Przychód</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-ink-muted">
          Ikona
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_ICONS) as CategoryIconKey[]).map((key) => {
            const Icon = CATEGORY_ICONS[key];
            const active = icon === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setIcon(key)}
                title={CATEGORY_ICON_LABELS[key]}
                aria-pressed={active}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border-strong text-ink-muted hover:text-ink"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </button>
            );
          })}
        </div>
        <input type="hidden" name="icon" value={icon} />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-ink-muted">
          Kolor (na wykresie)
        </label>
        <div className="flex flex-wrap gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Wybierz kolor ${c}`}
              aria-pressed={color === c}
              className="h-8 w-8 rounded-full ring-offset-2 ring-offset-canvas-raised transition-shadow"
              style={{
                backgroundColor: c,
                boxShadow: color === c ? `0 0 0 2px var(--canvas-raised), 0 0 0 4px ${c}` : "none",
              }}
            />
          ))}
        </div>
        <input type="hidden" name="color" value={color} />
      </div>

      {type === "expense" && (
        <div className="max-w-xs">
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">
            Miesięczny limit budżetu (opcjonalnie, PLN)
          </label>
          <input
            type="number"
            name="monthlyLimit"
            min="0"
            step="0.01"
            placeholder="np. 800"
            className="w-full rounded-lg border border-border-strong px-3 py-2.5 text-sm"
          />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-negative/10 px-3 py-2 text-sm text-negative-strong">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-50"
      >
        {isPending ? "Dodawanie…" : "Dodaj kategorię"}
      </button>
    </form>
  );
}
