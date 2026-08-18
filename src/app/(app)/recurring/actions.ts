"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function addRecurring(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  const type = formData.get("type") as string;
  const amount = Number(formData.get("amount"));
  const description = (formData.get("description") as string) || null;
  const categoryId = (formData.get("categoryId") as string) || null;
  const dayOfMonth = Number(formData.get("dayOfMonth"));

  if (!["income", "expense"].includes(type)) throw new Error("Nieprawidłowy typ.");
  if (!amount || amount <= 0) throw new Error("Kwota musi być większa od zera.");
  if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 28) {
    throw new Error("Dzień miesiąca musi być między 1 a 28.");
  }

  await prisma.recurringTransaction.create({
    data: {
      userId: session.userId,
      type,
      amount,
      description,
      categoryId: categoryId || null,
      dayOfMonth,
    },
  });

  revalidatePath("/recurring");
  revalidatePath("/dashboard");
}

export async function toggleRecurring(id: string, active: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  await prisma.recurringTransaction.updateMany({
    where: { id, userId: session.userId },
    data: { active },
  });

  revalidatePath("/recurring");
}

export async function deleteRecurring(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  await prisma.recurringTransaction.deleteMany({
    where: { id, userId: session.userId },
  });

  revalidatePath("/recurring");
  revalidatePath("/dashboard");
}
