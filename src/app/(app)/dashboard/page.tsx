import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowUpRightIcon, ArrowDownRightIcon, PlusIcon } from "@/components/icons";
import { addTransaction } from "./actions";
import DeleteButton from "./delete-button";

function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null; // layout nadrzędny już przekierował

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.userId },
    orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  return (
    <div className="space-y-10">
      {/* Podsumowanie — jeden spójny panel, nie trzy oddzielne karty. */}
      <div className="grid divide-y divide-border rounded-2xl border border-border bg-canvas-raised sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-6">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <ArrowUpRightIcon className="h-3.5 w-3.5 text-positive" />
            Przychody
          </div>
          <p className="tabular mt-2.5 font-display text-3xl text-positive-strong">
            {formatPLN(income)}
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <ArrowDownRightIcon className="h-3.5 w-3.5 text-negative" />
            Wydatki
          </div>
          <p className="tabular mt-2.5 font-display text-3xl text-negative-strong">
            {formatPLN(expense)}
          </p>
        </div>
        <div className="p-6">
          <div className="text-xs font-medium text-ink-muted">Bilans</div>
          <p className="tabular mt-2.5 font-display text-3xl text-ink">
            {formatPLN(balance)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-canvas-raised p-6">
        <h2 className="font-display text-xl italic text-ink">
          Dodaj transakcję
        </h2>
        <form
          action={addTransaction}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end"
        >
          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">
              Typ
            </label>
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
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">
              Kwota (PLN)
            </label>
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
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">
              Opis
            </label>
            <input
              type="text"
              name="description"
              placeholder="np. Zakupy spożywcze"
              className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">
              Data
            </label>
            <input
              type="date"
              name="occurred_on"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-lg border border-border-strong px-2.5 py-2.5 text-sm"
            />
          </div>
          <div className="sm:col-span-5">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
            >
              <PlusIcon className="h-4 w-4" />
              Dodaj
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-canvas-raised">
        <h2 className="border-b border-border px-6 py-5 font-display text-xl italic text-ink">
          Ostatnie transakcje
        </h2>
        {transactions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-faint">
            Brak transakcji. Dodaj pierwszą powyżej.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-4 px-6 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      t.type === "income"
                        ? "bg-positive/10 text-positive"
                        : "bg-negative/10 text-negative"
                    }`}
                  >
                    {t.type === "income" ? (
                      <ArrowUpRightIcon className="h-4 w-4" />
                    ) : (
                      <ArrowDownRightIcon className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">
                      {t.description || "(bez opisu)"}
                    </p>
                    <p className="text-xs text-ink-faint">
                      {t.occurredOn.toISOString().slice(0, 10)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`tabular text-sm font-medium ${
                      t.type === "income" ? "text-positive-strong" : "text-negative-strong"
                    }`}
                  >
                    {t.type === "income" ? "+" : "−"}
                    {formatPLN(Number(t.amount))}
                  </span>
                  <DeleteButton id={t.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
