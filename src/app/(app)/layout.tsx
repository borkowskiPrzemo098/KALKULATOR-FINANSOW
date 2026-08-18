import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MarkIcon, ShieldIcon, TagIcon, RepeatIcon } from "@/components/icons";
import ThemeToggle from "@/components/theme-toggle";
import MobileNav from "@/components/mobile-nav";
import LogoutButton from "./logout-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { displayName: true, isAdmin: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5 text-ink">
            <MarkIcon className="h-5 w-5 text-accent" />
            <span className="font-display font-semibold tracking-tight text-lg">
              Kalkulator Finansów
            </span>
          </Link>
          <div className="flex items-center gap-5">
            {user.isAdmin && (
              <Link
                href="/admin/users"
                className="flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-accent"
              >
                <ShieldIcon className="h-4 w-4" />
                Panel admina
              </Link>
            )}
            <span className="hidden text-sm text-ink-muted sm:inline">
              {user.displayName}
            </span>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
        <div className="mx-auto hidden max-w-4xl gap-5 px-6 pb-4 text-sm sm:flex">
          <Link href="/dashboard" className="text-ink-muted transition-colors hover:text-ink">
            Budżet
          </Link>
          <Link href="/categories" className="flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink">
            <TagIcon className="h-3.5 w-3.5" />
            Kategorie
          </Link>
          <Link href="/recurring" className="flex items-center gap-1.5 text-ink-muted transition-colors hover:text-ink">
            <RepeatIcon className="h-3.5 w-3.5" />
            Cykliczne
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10 pb-28 sm:pb-10">{children}</main>
      <MobileNav isAdmin={user.isAdmin} />
    </div>
  );
}
