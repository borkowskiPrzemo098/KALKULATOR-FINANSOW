"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  type PeriodRange,
  PERIOD_LABELS,
  shiftAnchor,
  formatAnchorISO,
} from "@/lib/period";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

const RANGES: PeriodRange[] = ["day", "week", "month", "year"];

export default function PeriodSwitcher({
  range,
  anchor,
  label,
  isCurrent,
}: {
  range: PeriodRange;
  anchor: Date;
  label: string;
  isCurrent: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function go(nextRange: PeriodRange, nextAnchor: Date) {
    const params = new URLSearchParams({
      range: nextRange,
      date: formatAnchorISO(nextAnchor),
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex rounded-full border border-border-strong p-1">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => go(r, r === range ? anchor : new Date())}
            aria-pressed={r === range}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              r === range
                ? "bg-accent text-accent-ink"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {PERIOD_LABELS[r]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => go(range, shiftAnchor(range, anchor, -1))}
          aria-label="Poprzedni okres"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-ink-muted transition-colors hover:border-accent hover:text-accent"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="min-w-[9rem] text-center font-display font-semibold tracking-tight text-lg text-ink">
          {label}
        </span>
        <button
          onClick={() => go(range, shiftAnchor(range, anchor, 1))}
          disabled={isCurrent}
          aria-label="Następny okres"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-ink-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-border-strong disabled:hover:text-ink-muted"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
