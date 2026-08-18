"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function addTransaction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  const type = formData.get("type") as string;
  const amount = Number(formData.get("amount"));
  const description = (formData.get("description") as string) || null;
  const occurred_on = formData.get("occurred_on") as string;

  if (!["income", "expense"].includes(type)) {
    throw new Error("Nieprawidłowy typ transakcji.");
  }
  if (!amount || amount <= 0) {
    throw new Error("Kwota musi być większa od zera.");
  }

  await prisma.transaction.create({
    data: {
      userId: session.userId,
      type,
      amount,
      description,
      occurredOn: new Date(occurred_on || new Date().toISOString().slice(0, 10)),
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteTransaction(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  // deleteMany + filtr po userId (nie samo `id`) gwarantuje, że użytkownik
  // nie może usunąć cudzej transakcji, nawet znając jej id.
  await prisma.transaction.deleteMany({
    where: { id, userId: session.userId },
  });

  revalidatePath("/dashboard");
}
