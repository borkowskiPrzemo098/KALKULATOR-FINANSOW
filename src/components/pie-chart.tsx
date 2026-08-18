"use client";

import { useEffect, useState } from "react";

export type PieSlice = {
  label: string;
  value: number;
  color: string;
};

const SIZE = 200;
const STROKE = 26;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * Donut chart animowany klasyczną techniką SVG: każdy segment startuje z
 * dashoffset = pełny obwód (niewidoczny), po zamontowaniu komponent
 * przełącza na docelowy offset — CSS transition robi resztę, z
 * opóźnieniem rosnącym dla kolejnych segmentów.
 */
export default function PieChart({ data }: { data: PieSlice[] }) {
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
    if (prefersReduced) {
      setRevealed(true);
      return;
    }
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (total <= 0) {
    return (
      <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full border border-dashed border-border-strong">
        <p className="max-w-[110px] text-center text-xs text-ink-faint">
          Brak danych w tym okresie
        </p>
      </div>
    );
  }

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="shrink-0 -rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={STROKE}
        />
        {data.map((slice, i) => {
          const fraction = slice.value / total;
          const length = fraction * CIRCUMFERENCE;
          const offset = revealed ? CIRCUMFERENCE - length : CIRCUMFERENCE;
          const rotation = (cumulative / total) * 360;
          cumulative += slice.value;
          return (
            <circle
              key={slice.label}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={slice.color}
              strokeWidth={STROKE}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="butt"
              style={{
                transformOrigin: "center",
                transform: `rotate(${rotation}deg)`,
                transition: reducedMotion
                  ? "none"
                  : `stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`,
              }}
            />
          );
        })}
      </svg>

      <ul className="w-full space-y-2">
        {data.map((slice) => (
          <li key={slice.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-ink-muted">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              {slice.label}
            </span>
            <span className="tabular text-ink">
              {Math.round((slice.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
