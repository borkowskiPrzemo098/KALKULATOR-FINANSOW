"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@/components/icons";

export default function DeleteCategoryButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      router.refresh();
    });
  }

  return (
    <button
      disabled={isPending}
      onClick={remove}
      className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-negative/10 hover:text-negative-strong disabled:opacity-50"
      aria-label="Usuń kategorię"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
