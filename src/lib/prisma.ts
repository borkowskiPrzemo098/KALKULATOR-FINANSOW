import { PrismaClient } from "@prisma/client";

// Jeden współdzielony klient Prisma na cały cykl życia instancji funkcji
// serverless (i żeby uniknąć wyczerpania puli połączeń przy hot-reloadzie
// Next.js w dev) — cache'owany zawsze, nie tylko w dev, dla bezpieczeństwa.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
globalForPrisma.prisma = prisma;
