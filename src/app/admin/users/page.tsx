import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <span className="font-semibold text-slate-900">
            Panel admina — użytkownicy
          </span>
          <a href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
            ← Wróć do kalkulatora
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-xl border border-slate-200 bg-white">
          <h2 className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900">
            Reset hasła użytkownika
          </h2>
          <ul className="divide-y divide-slate-100">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {u.displayName}{" "}
                    {u.isAdmin && (
                      <span className="ml-1 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
                        admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">@{u.username}</p>
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
