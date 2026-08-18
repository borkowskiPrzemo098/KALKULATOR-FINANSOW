import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password, displayName } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Podaj login i hasło" },
      { status: 400 }
    );
  }
  if (!/^[a-zA-Z0-9_.-]{3,32}$/.test(username)) {
    return NextResponse.json(
      {
        error:
          "Login: 3-32 znaki, tylko litery, cyfry, kropka, myślnik, podkreślnik.",
      },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Hasło musi mieć co najmniej 8 znaków." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json(
      { error: "Ten login jest już zajęty." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      displayName: displayName?.trim() || username,
    },
  });

  await setSessionCookie({
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    isAdmin: user.isAdmin,
  });
  return NextResponse.json({ ok: true });
}
