"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CATEGORY_ICONS } from "@/components/icons";

const ICON_KEYS = Object.keys(CATEGORY_ICONS);
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export async function addCategory(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  const name = (formData.get("name") as string)?.trim();
  const type = formData.get("type") as string;
  const icon = formData.get("icon") as string;
  const color = formData.get("color") as string;
  const limitRaw = formData.get("monthlyLimit") as string;

  if (!name) throw new Error("Podaj nazwę kategorii.");
  if (!["income", "expense"].includes(type)) throw new Error("Nieprawidłowy typ.");
  if (!ICON_KEYS.includes(icon)) throw new Error("Nieprawidłowa ikona.");
  if (!COLOR_RE.test(color)) throw new Error("Nieprawidłowy kolor.");

  const monthlyLimit =
    type === "expense" && limitRaw && Number(limitRaw) > 0 ? Number(limitRaw) : null;

  await prisma.category.create({
    data: { userId: session.userId, name, type, icon, color, monthlyLimit },
  });

  revalidatePath("/categories");
  revalidatePath("/dashboard");
}

export async function deleteCategory(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  await prisma.category.deleteMany({ where: { id, userId: session.userId } });

  revalidatePath("/categories");
  revalidatePath("/dashboard");
}

export async function setCategoryLimit(id: string, monthlyLimit: number | null) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  await prisma.category.updateMany({
    where: { id, userId: session.userId },
    data: { monthlyLimit },
  });

  revalidatePath("/categories");
  revalidatePath("/dashboard");
}
