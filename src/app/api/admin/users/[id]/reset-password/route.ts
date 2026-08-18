import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// Tylko administrator może zresetować hasło dowolnego użytkownika —
// nie ma automatycznego "zapomniałem hasła" e-mailem, bo aplikacja
// świadomie nie zbiera adresów e-mail ani numerów telefonu.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Brak uprawnień." }, { status: 403 });
  }

  const { id } = await params;
  const { newPassword } = await req.json();

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Nowe hasło musi mieć co najmniej 8 znaków." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const user = await prisma.user.update({
    where: { id },
    data: { passwordHash },
    select: { id: true, username: true },
  });

  return NextResponse.json({ ok: true, user });
}
