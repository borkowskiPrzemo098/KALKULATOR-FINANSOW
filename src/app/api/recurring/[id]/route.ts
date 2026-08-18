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
  const { active } = await req.json();

  await prisma.recurringTransaction.updateMany({
    where: { id, userId: session.userId },
    data: { active: Boolean(active) },
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
  await prisma.recurringTransaction.deleteMany({ where: { id, userId: session.userId } });

  return NextResponse.json({ ok: true });
}
