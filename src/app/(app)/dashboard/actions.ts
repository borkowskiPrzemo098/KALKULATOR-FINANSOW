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
  const categoryId = (formData.get("categoryId") as string) || null;

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
      categoryId: categoryId || null,
      occurredOn: new Date(occurred_on || new Date().toISOString().slice(0, 10)),
    },
  });

  revalidatePath("/dashboard");
}

export type UpdateTransactionInput = {
  type: string;
  amount: number;
  description: string | null;
  occurredOn: string;
  categoryId: string | null;
};

export async function updateTransaction(id: string, input: UpdateTransactionInput) {
  const session = await getSession();
  if (!session) throw new Error("Musisz być zalogowany.");

  if (!["income", "expense"].includes(input.type)) {
    throw new Error("Nieprawidłowy typ transakcji.");
  }
  if (!input.amount || input.amount <= 0) {
    throw new Error("Kwota musi być większa od zera.");
  }

  // updateMany + filtr po userId — użytkownik nie może edytować cudzej
  // transakcji, nawet znając jej id.
  await prisma.transaction.updateMany({
    where: { id, userId: session.userId },
    data: {
      type: input.type,
      amount: input.amount,
      description: input.description,
      categoryId: input.categoryId,
      occurredOn: new Date(input.occurredOn),
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
