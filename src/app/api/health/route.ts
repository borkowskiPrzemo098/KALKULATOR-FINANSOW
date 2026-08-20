import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lekki endpoint bez logowania — jego jedyne zadanie to wykonać trywialne
// zapytanie do bazy. Używany jako "podtrzymanie" (keep-alive): pingowany
// co kilka minut z zewnątrz, żeby baza danych (Neon, plan darmowy) nie
// usypiała po 5 minutach bezczynności — to usypianie jest źródłem
// zauważalnych, nierównych opóźnień przy pierwszym kliknięciu po przerwie.
export async function GET() {
  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({ ok: true, ms: Date.now() - start });
}
