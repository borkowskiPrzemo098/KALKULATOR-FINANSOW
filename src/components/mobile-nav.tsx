"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, TagIcon, RepeatIcon, ShieldIcon } from "@/components/icons";

export default function MobileNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", label: "Budżet", Icon: HomeIcon },
    { href: "/categories", label: "Kategorie", Icon: TagIcon },
    { href: "/recurring", label: "Cykliczne", Icon: RepeatIcon },
    ...(isAdmin ? [{ href: "/admin/users", label: "Admin", Icon: ShieldIcon }] : []),
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-canvas-raised/90 backdrop-blur-lg sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Nawigacja"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
                style={{ color: active ? "var(--accent)" : "var(--ink-faint)" }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                  style={{ backgroundColor: active ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent" }}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
