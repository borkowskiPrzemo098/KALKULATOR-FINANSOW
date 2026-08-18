import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Usunięcie konta kaskadowo usuwa jego transakcje, kategorie i reguły
// cykliczne (onDelete: Cascade w schemacie) — świadome, nieodwracalne.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Brak uprawnień." }, { status: 403 });
  }

  const { id } = await params;

  if (id === admin.userId) {
    return NextResponse.json(
      { error: "Nie możesz usunąć własnego konta z tego panelu." },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
