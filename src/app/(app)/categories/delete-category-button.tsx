"use client";

import { useTransition } from "react";
import { TrashIcon } from "@/components/icons";
import { deleteCategory } from "./actions";

export default function DeleteCategoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => deleteCategory(id))}
      className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-negative/10 hover:text-negative-strong disabled:opacity-50"
      aria-label="Usuń kategorię"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
