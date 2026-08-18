import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RepeatIcon, ArrowUpRightIcon, ArrowDownRightIcon, CategoryIcon } from "@/components/icons";
import RecurringForm from "./recurring-form";
import RecurringRow from "./recurring-row";

function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value);
}

export default async function RecurringPage() {
  const session = await getSession();
  if (!session) return null;

  const [rules, categories] = await Promise.all([
    prisma.recurringTransaction.findMany({
      where: { userId: session.userId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-2 text-ink">
        <RepeatIcon className="h-5 w-5 text-accent" />
        <h1 className="font-display text-2xl italic">Transakcje cykliczne</h1>
      </div>

      <div className="elevated rounded-2xl border border-border bg-canvas-raised p-6">
        <h2 className="font-display text-xl italic text-ink">Nowa reguła</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Powtarza się co miesiąc, tego samego dnia — np. czynsz, subskrypcje, wypłata.
        </p>
        <div className="mt-5">
          <RecurringForm categories={categories} />
        </div>
      </div>

      <div className="elevated rounded-2xl border border-border bg-canvas-raised">
        <h2 className="border-b border-border px-6 py-5 font-display text-xl italic text-ink">
          Aktywne reguły
        </h2>
        {rules.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-faint">
            Brak transakcji cyklicznych. Dodaj pierwszą powyżej.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rules.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: r.category ? `${r.category.color}26` : undefined,
                      color: r.category?.color,
                    }}
                  >
                    {r.category ? (
                      <CategoryIcon icon={r.category.icon} className="h-4 w-4" />
                    ) : r.type === "income" ? (
                      <ArrowUpRightIcon className="h-4 w-4 text-positive" />
                    ) : (
                      <ArrowDownRightIcon className="h-4 w-4 text-negative" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">
                      {r.description || "(bez opisu)"}
                    </p>
                    <p className="text-xs text-ink-faint">co miesiąc, {r.dayOfMonth}. dnia</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`tabular text-sm font-medium ${
                      r.type === "income" ? "text-positive-strong" : "text-negative-strong"
                    }`}
                  >
                    {r.type === "income" ? "+" : "−"}
                    {formatPLN(Number(r.amount))}
                  </span>
                  <RecurringRow id={r.id} active={r.active} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
