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
  const { monthlyLimit } = await req.json();
  const limit = monthlyLimit && Number(monthlyLimit) > 0 ? Number(monthlyLimit) : null;

  await prisma.category.updateMany({
    where: { id, userId: session.userId },
    data: { monthlyLimit: limit },
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
  await prisma.category.deleteMany({ where: { id, userId: session.userId } });

  return NextResponse.json({ ok: true });
}
