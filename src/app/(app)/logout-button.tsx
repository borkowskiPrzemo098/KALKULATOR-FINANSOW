"use client";

import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/icons";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      aria-label="Wyloguj"
      className="flex items-center gap-1.5 rounded-full border border-border-strong px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:border-accent hover:text-ink"
    >
      <LogoutIcon className="h-3.5 w-3.5" />
      Wyloguj
    </button>
  );
}
