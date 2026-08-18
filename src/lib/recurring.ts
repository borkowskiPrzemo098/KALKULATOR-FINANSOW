import { prisma } from "@/lib/prisma";

/**
 * Materializuje transakcje cykliczne jako zwykłe Transaction (powiązane
 * przez recurringId) dla wszystkich miesięcy od utworzenia reguły do
 * bieżącego miesiąca włącznie. Idempotentne — sprawdza czy dany miesiąc
 * już ma wpis, zanim go utworzy. Wołane przy każdym wejściu na dashboard,
 * żeby użytkownik nie musiał nic klikać, a lista/wykresy zawsze były
 * aktualne.
 */
export async function ensureRecurringGenerated(userId: string): Promise<void> {
  const rules = await prisma.recurringTransaction.findMany({
    where: { userId, active: true },
  });
  if (rules.length === 0) return;

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth(); // 0-indexed

  for (const rule of rules) {
    const startYear = rule.createdAt.getUTCFullYear();
    const startMonth = rule.createdAt.getUTCMonth();

    let year = startYear;
    let month = startMonth;
    // Bezpiecznik: nie więcej niż 60 miesięcy wstecz w jednym przebiegu.
    let guard = 0;

    while ((year < currentYear || (year === currentYear && month <= currentMonth)) && guard < 60) {
      guard++;
      const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      const day = Math.min(rule.dayOfMonth, daysInMonth);
      const occurredOn = new Date(Date.UTC(year, month, day));

      const existing = await prisma.transaction.findFirst({
        where: {
          recurringId: rule.id,
          occurredOn: {
            gte: new Date(Date.UTC(year, month, 1)),
            lt: new Date(Date.UTC(year, month + 1, 1)),
          },
        },
        select: { id: true },
      });

      if (!existing) {
        await prisma.transaction.create({
          data: {
            userId: rule.userId,
            categoryId: rule.categoryId,
            recurringId: rule.id,
            type: rule.type,
            amount: rule.amount,
            description: rule.description,
            occurredOn,
          },
        });
      }

      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
  }
}
