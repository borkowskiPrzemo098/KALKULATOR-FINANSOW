import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Musisz być zalogowany." }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { type, amount, description, occurredOn, categoryId } = body;

  if (!["income", "expense"].includes(type)) {
    return NextResponse.json({ error: "Nieprawidłowy typ transakcji." }, { status: 400 });
  }
  if (!amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Kwota musi być większa od zera." }, { status: 400 });
  }

  // updateMany + filtr po userId — użytkownik nie może edytować cudzej
  // transakcji, nawet znając jej id.
  await prisma.transaction.updateMany({
    where: { id, userId: session.userId },
    data: {
      type,
      amount: Number(amount),
      description: description || null,
      categoryId: categoryId || null,
      occurredOn: new Date(occurredOn),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Musisz być zalogowany." }, { status: 401 });

  const { id } = await params;
  await prisma.transaction.deleteMany({ where: { id, userId: session.userId } });

  return NextResponse.json({ ok: true });
}
