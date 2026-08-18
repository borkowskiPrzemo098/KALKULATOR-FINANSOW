import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureRecurringGenerated } from "@/lib/recurring";
import { parsePeriodParams, getPeriodBounds, getPeriodLabel, isCurrentPeriod } from "@/lib/period";
import { ArrowUpRightIcon, ArrowDownRightIcon, CategoryIcon, TagIcon } from "@/components/icons";
import TiltCard from "@/components/tilt-card";
import PeriodSwitcher from "@/components/period-switcher";
import PieChart from "@/components/pie-chart";
import AddTransactionForm from "./add-transaction-form";
import TransactionRow from "./transaction-row";

function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

const FALLBACK_COLOR = "#8a8378";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; date?: string }>;
}) {
  const session = await getSession();
  if (!session) return null; // layout nadrzędny już przekierował

  const params = await searchParams;
  const { range, anchor } = parsePeriodParams(params);
  const { start, end } = getPeriodBounds(range, anchor);
  const periodLabel = getPeriodLabel(range, anchor);

  await ensureRecurringGenerated(session.userId);

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  const [transactions, categories, monthExpenses] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId: session.userId, occurredOn: { gte: start, lt: end } },
      include: { category: true },
      orderBy: [{ occurredOn: "desc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.category.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
    }),
    // Budżety miesięczne liczone zawsze od bieżącego kalendarzowego
    // miesiąca — niezależnie od wybranego okresu filtrowania powyżej.
    prisma.transaction.findMany({
      where: {
        userId: session.userId,
        type: "expense",
        occurredOn: { gte: monthStart, lt: monthEnd },
      },
      select: { amount: true, categoryId: true },
    }),
  ]);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  // Podział wydatków po kategoriach w wybranym okresie — dane wykresu.
  const expenseByCategory = new Map<
    string,
    { label: string; value: number; color: string; icon: string; count: number }
  >();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const key = t.category?.id ?? "none";
    const label = t.category?.name ?? "Bez kategorii";
    const color = t.category?.color ?? FALLBACK_COLOR;
    const icon = t.category?.icon ?? "other";
    const prev = expenseByCategory.get(key);
    expenseByCategory.set(key, {
      label,
      color,
      icon,
      value: (prev?.value ?? 0) + Number(t.amount),
      count: (prev?.count ?? 0) + 1,
    });
  }
  const pieData = [...expenseByCategory.values()].sort((a, b) => b.value - a.value);

  // Budżety: kategorie wydatków z limitem, suma wydana w bieżącym miesiącu.
  const spentByCategory = new Map<string, number>();
  for (const t of monthExpenses) {
    if (!t.categoryId) continue;
    spentByCategory.set(t.categoryId, (spentByCategory.get(t.categoryId) ?? 0) + Number(t.amount));
  }
  const budgets = categories
    .filter((c) => c.type === "expense" && c.monthlyLimit)
    .map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      limit: Number(c.monthlyLimit),
      spent: spentByCategory.get(c.id) ?? 0,
    }));

  return (
    <div className="space-y-10">
      <PeriodSwitcher
        range={range}
        anchor={anchor}
        label={periodLabel}
        isCurrent={isCurrentPeriod(range, anchor)}
      />

      {/* Podsumowanie — jeden spójny panel, nie trzy oddzielne karty. */}
      <TiltCard className="grid divide-y divide-border rounded-2xl border border-border bg-canvas-raised sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-6">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <ArrowUpRightIcon className="h-3.5 w-3.5 text-positive" />
            Przychody
          </div>
          <p className="tabular mt-2.5 font-display text-3xl font-semibold tracking-tight text-positive-strong">
            {formatPLN(income)}
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted">
            <ArrowDownRightIcon className="h-3.5 w-3.5 text-negative" />
            Wydatki
          </div>
          <p className="tabular mt-2.5 font-display text-3xl font-semibold tracking-tight text-negative-strong">
            {formatPLN(expense)}
          </p>
        </div>
        <div className="p-6">
          <div className="text-xs font-medium text-ink-muted">Bilans</div>
          <p className="tabular mt-2.5 font-display text-3xl font-semibold tracking-tight text-ink">
            {formatPLN(balance)}
          </p>
        </div>
      </TiltCard>

      {budgets.length > 0 && (
        <div className="elevated rounded-2xl border border-border bg-canvas-raised p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold tracking-tight text-xl text-ink">
              Budżety miesięczne
            </h2>
            <span className="text-xs text-ink-faint">bieżący miesiąc</span>
          </div>
          <div className="mt-5 space-y-4">
            {budgets.map((b) => {
              const pct = Math.min(100, Math.round((b.spent / b.limit) * 100));
              const over = b.spent > b.limit;
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink">
                      <CategoryIcon icon={b.icon} className="h-4 w-4" style={{ color: b.color }} />
                      {b.name}
                    </span>
                    <span className={`tabular ${over ? "text-negative-strong" : "text-ink-muted"}`}>
                      {formatPLN(b.spent)} / {formatPLN(b.limit)}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: over ? "var(--negative)" : b.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="elevated rounded-2xl border border-border bg-canvas-raised p-6">
        <h2 className="font-display font-semibold tracking-tight text-xl text-ink">
          Wydatki wg kategorii
        </h2>
        <div className="mt-6 flex justify-center sm:justify-start">
          <PieChart data={pieData} />
        </div>
      </div>

      <div className="elevated rounded-2xl border border-border bg-canvas-raised p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold tracking-tight text-xl text-ink">
            Dodaj transakcję
          </h2>
          <Link href="/categories" className="flex items-center gap-1 text-xs text-ink-muted hover:text-accent">
            <TagIcon className="h-3.5 w-3.5" />
            Zarządzaj kategoriami
          </Link>
        </div>
        <AddTransactionForm categories={categories} />
      </div>

      <div className="elevated rounded-2xl border border-border bg-canvas-raised">
        <h2 className="border-b border-border px-6 py-5 font-display font-semibold tracking-tight text-xl text-ink">
          Transakcje — {periodLabel.toLowerCase()}
        </h2>
        {transactions.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-faint">
            Brak transakcji w tym okresie.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={{
                  id: t.id,
                  type: t.type,
                  amount: Number(t.amount),
                  description: t.description,
                  occurredOn: t.occurredOn.toISOString().slice(0, 10),
                  categoryId: t.categoryId,
                  category: t.category
                    ? { icon: t.category.icon, color: t.category.color, name: t.category.name }
                    : null,
                }}
                categories={categories.map((c) => ({
                  id: c.id,
                  name: c.name,
                  type: c.type,
                  icon: c.icon,
                  color: c.color,
                }))}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
