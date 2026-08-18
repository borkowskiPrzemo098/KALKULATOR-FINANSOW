"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Musisz być zalogowany.");

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

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id, // RLS i tak by to wymusił, ale ustawiamy jawnie
    type,
    amount,
    description,
    occurred_on: occurred_on || new Date().toISOString().slice(0, 10),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
}
