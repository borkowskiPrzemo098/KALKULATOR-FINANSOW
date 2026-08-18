import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_ICONS } from "@/components/icons";

const ICON_KEYS = Object.keys(CATEGORY_ICONS);
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Musisz być zalogowany." }, { status: 401 });

  const body = await req.json();
  const name = (body.name as string)?.trim();
  const { type, icon, color, monthlyLimit } = body;

  if (!name) return NextResponse.json({ error: "Podaj nazwę kategorii." }, { status: 400 });
  if (!["income", "expense"].includes(type)) {
    return NextResponse.json({ error: "Nieprawidłowy typ." }, { status: 400 });
  }
  if (!ICON_KEYS.includes(icon)) {
    return NextResponse.json({ error: "Nieprawidłowa ikona." }, { status: 400 });
  }
  if (!COLOR_RE.test(color)) {
    return NextResponse.json({ error: "Nieprawidłowy kolor." }, { status: 400 });
  }

  const limit =
    type === "expense" && monthlyLimit && Number(monthlyLimit) > 0
      ? Number(monthlyLimit)
      : null;

  const category = await prisma.category.create({
    data: { userId: session.userId, name, type, icon, color, monthlyLimit: limit },
  });

  return NextResponse.json({ ok: true, category });
}
