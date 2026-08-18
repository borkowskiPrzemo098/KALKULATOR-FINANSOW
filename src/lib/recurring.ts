import { prisma } from "@/lib/prisma";

/**
 * Materializuje transakcje cykliczne jako zwykłe Transaction (powiązane
 * przez recurringId) dla wszystkich miesięcy od utworzenia reguły do
 * bieżącego miesiąca włącznie. Idempotentne. Wołane przy każdym wejściu
 * na dashboard, więc MUSI być szybkie — jedno zapytanie sprawdzające
 * istniejące wpisy + jedno zbiorcze tworzenie brakujących, zamiast
 * osobnego zapytania na każdy miesiąc każdej reguły (poprzednia wersja
 * robiła nawet kilkadziesiąt sekwencyjnych round-tripów do bazy przy
 * każdym odświeżeniu strony — stąd zauważalne opóźnienie).
 */
export async function ensureRecurringGenerated(userId: string): Promise<void> {
  const rules = await prisma.recurringTransaction.findMany({
    where: { userId, active: true },
  });
  if (rules.length === 0) return;

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  // Dla każdej reguły policz listę miesięcy (rok, miesiąc), które powinny
  // mieć wygenerowaną transakcję — od utworzenia reguły do teraz, max 60.
  const wanted: { rule: (typeof rules)[number]; year: number; month: number }[] = [];
  for (const rule of rules) {
    let year = rule.createdAt.getUTCFullYear();
    let month = rule.createdAt.getUTCMonth();
    let guard = 0;
    while (
      (year < currentYear || (year === currentYear && month <= currentMonth)) &&
      guard < 60
    ) {
      guard++;
      wanted.push({ rule, year, month });
      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
  }
  if (wanted.length === 0) return;

  // Jedno zapytanie: wszystkie już istniejące transakcje cykliczne tego
  // użytkownika od najwcześniejszego potrzebnego miesiąca do dziś.
  const earliest = wanted.reduce(
    (min, w) => (w.year < min.year || (w.year === min.year && w.month < min.month) ? w : min),
    wanted[0]
  );
  const existing = await prisma.transaction.findMany({
    where: {
      userId,
      recurringId: { in: rules.map((r) => r.id) },
      occurredOn: { gte: new Date(Date.UTC(earliest.year, earliest.month, 1)) },
    },
    select: { recurringId: true, occurredOn: true },
  });
  const existingKeys = new Set(
    existing.map((t) => `${t.recurringId}:${t.occurredOn.getUTCFullYear()}-${t.occurredOn.getUTCMonth()}`)
  );

  const toCreate = wanted
    .filter((w) => !existingKeys.has(`${w.rule.id}:${w.year}-${w.month}`))
    .map((w) => {
      const daysInMonth = new Date(Date.UTC(w.year, w.month + 1, 0)).getUTCDate();
      const day = Math.min(w.rule.dayOfMonth, daysInMonth);
      return {
        userId: w.rule.userId,
        categoryId: w.rule.categoryId,
        recurringId: w.rule.id,
        type: w.rule.type,
        amount: w.rule.amount,
        description: w.rule.description,
        occurredOn: new Date(Date.UTC(w.year, w.month, day)),
      };
    });

  if (toCreate.length > 0) {
    await prisma.transaction.createMany({ data: toCreate });
  }
}
