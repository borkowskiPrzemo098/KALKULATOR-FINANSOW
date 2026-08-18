"use client";

import { useTransition } from "react";
import { deleteTransaction } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteTransaction(id))}
      className="text-xs text-slate-400 hover:text-red-600 disabled:opacity-50"
      aria-label="Usuń transakcję"
    >
      Usuń
    </button>
  );
}
