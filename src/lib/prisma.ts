import { PrismaClient } from "@prisma/client";

// Jeden współdzielony klient Prisma w trybie dev (unika wyczerpania puli
// połączeń przy hot-reloadzie Next.js).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
