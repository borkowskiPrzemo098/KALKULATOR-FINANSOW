/**
 * Nadaje uprawnienia admina użytkownikowi po nazwie loginu.
 * Celowo NIE jest to endpoint API - uruchamiane tylko lokalnie/z serwera,
 * żeby nikt nie mógł się sam mianować adminem przez aplikację.
 *
 * Użycie: npx tsx scripts/set-admin.ts <login>
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error("Użycie: npx tsx scripts/set-admin.ts <login>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { username },
    data: { isAdmin: true },
  });

  console.log(`✅ ${user.displayName} (@${user.username}) jest teraz adminem.`);
}

main()
  .catch((e) => {
    console.error("Błąd:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
