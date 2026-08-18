import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MarkIcon, ShieldIcon } from "@/components/icons";
import ResetPasswordForm from "./reset-password-form";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, username: true, displayName: true, isAdmin: true },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5 text-ink">
            <MarkIcon className="h-5 w-5 text-accent" />
            <span className="font-display text-lg italic">
              Kalkulator Finansów
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            ← Wróć do kalkulatora
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-6 flex items-center gap-2 text-ink">
          <ShieldIcon className="h-5 w-5 text-accent" />
          <h1 className="font-display text-2xl italic">Panel admina</h1>
        </div>

        <div className="elevated rounded-2xl border border-border bg-canvas-raised">
          <h2 className="border-b border-border px-6 py-5 text-sm font-medium text-ink-muted">
            Reset hasła użytkownika
          </h2>
          <ul className="divide-y divide-border">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-ink">
                    {u.displayName}
                    {u.isAdmin && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-strong">
                        admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink-faint">@{u.username}</p>
                </div>
                <ResetPasswordForm userId={u.id} />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
