import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Musisz być zalogowany." }, { status: 401 });

  const body = await req.json();
  const { type, amount, description, categoryId, dayOfMonth } = body;

  if (!["income", "expense"].includes(type)) {
    return NextResponse.json({ error: "Nieprawidłowy typ." }, { status: 400 });
  }
  if (!amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Kwota musi być większa od zera." }, { status: 400 });
  }
  const day = Number(dayOfMonth);
  if (!day || day < 1 || day > 28) {
    return NextResponse.json({ error: "Dzień miesiąca musi być między 1 a 28." }, { status: 400 });
  }

  const rule = await prisma.recurringTransaction.create({
    data: {
      userId: session.userId,
      type,
      amount: Number(amount),
      description: description || null,
      categoryId: categoryId || null,
      dayOfMonth: day,
    },
  });

  return NextResponse.json({ ok: true, rule });
}
