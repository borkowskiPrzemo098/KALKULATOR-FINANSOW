import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Musisz być zalogowany." }, { status: 401 });

  const body = await req.json();
  const { type, amount, description, occurredOn, categoryId } = body;

  if (!["income", "expense"].includes(type)) {
    return NextResponse.json({ error: "Nieprawidłowy typ transakcji." }, { status: 400 });
  }
  if (!amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Kwota musi być większa od zera." }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: {
      userId: session.userId,
      type,
      amount: Number(amount),
      description: description || null,
      categoryId: categoryId || null,
      occurredOn: new Date(occurredOn || new Date().toISOString().slice(0, 10)),
    },
  });

  return NextResponse.json({ ok: true, transaction });
}
