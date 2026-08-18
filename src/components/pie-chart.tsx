"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { CategoryIcon } from "@/components/icons";

export type PieSlice = {
  label: string;
  value: number;
  color: string;
  icon: string;
  count: number;
};

const SIZE = 220;
const R_OUTER = 104;
const R_INNER = 62;
const CENTER = SIZE / 2;
const POP = 10; // px wysunięcia zaznaczonego wycinka
const TAP_THRESHOLD_DEG = 4; // poniżej tego kąta ruchu = traktuj jak "klik", nie przeciąganie

function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" }).format(value);
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Ścieżka SVG dla jednego wycinka pierścienia (donut), 0° = wschód, zgodnie z zegarem. */
function donutArcPath(startAngle: number, endAngle: number) {
  const a1 = Math.min(endAngle - startAngle, 359.99) + startAngle;
  const largeArc = a1 - startAngle > 180 ? 1 : 0;
  const oStart = polar(CENTER, CENTER, R_OUTER, startAngle);
  const oEnd = polar(CENTER, CENTER, R_OUTER, a1);
  const iEnd = polar(CENTER, CENTER, R_INNER, a1);
  const iStart = polar(CENTER, CENTER, R_INNER, startAngle);
  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${iStart.x} ${iStart.y}`,
    "Z",
  ].join(" ");
}

function normalize360(a: number) {
  return ((a % 360) + 360) % 360;
}

/** Kierunek najkrótszej różnicy kątowej a→b, w zakresie (-180, 180]. */
function shortestDelta(a: number, b: number) {
  return ((b - a + 540) % 360) - 180;
}

/**
 * Wykres kołowy (donut) — obracany przeciąganiem myszą lub palcem, z lekką
 * bezwładnością po puszczeniu. Kliknięcie (bez przeciągania) w wycinek
 * zaznacza go: wysuwa się na zewnątrz, a pod wykresem rozwija się panel ze
 * szczegółami. Jeden autorski moment ruchu wejścia (fade+scale), reszta to
 * bezpośrednia manipulacja — nie dekoracja w tle.
 */
export default function PieChart({ data }: { data: PieSlice[] }) {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const lastAngleRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0); // deg / ms
  const movementRef = useRef(0); // suma |delta| podczas bieżącego gestu
  const rafRef = useRef<number | null>(null);
  const rotationRef = useRef(0);
  rotationRef.current = rotation;

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

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  function pointerAngle(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const x = (clientX - rect.left) * scale;
    const y = (clientY - rect.top) * scale;
    const raw = (Math.atan2(y - CENTER, x - CENTER) * 180) / Math.PI;
    return normalize360(raw);
  }

  function stopMomentum() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  function handlePointerDown(e: ReactPointerEvent<SVGSVGElement>) {
    stopMomentum();
    // setPointerCapture może rzucić (np. NotFoundError), jeśli przeglądarka
    // z jakiegoś powodu nie uzna id wskaźnika za aktywne w danym momencie —
    // nie pozwól, żeby to przerwało rozpoczęcie przeciągania.
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {
      // ignorowane celowo — patrz komentarz wyżej
    }
    lastAngleRef.current = pointerAngle(e.clientX, e.clientY);
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    movementRef.current = 0;
    setDragging(true);
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    const angle = pointerAngle(e.clientX, e.clientY);
    const now = performance.now();
    const delta = shortestDelta(lastAngleRef.current, angle);
    const dt = Math.max(1, now - lastTimeRef.current);

    setRotation((r) => r + delta);
    velocityRef.current = delta / dt;
    movementRef.current += Math.abs(delta);
    lastAngleRef.current = angle;
    lastTimeRef.current = now;
  }

  function hitTestSlice(clientX: number, clientY: number): number | null {
    const angle = pointerAngle(clientX, clientY);
    // Odwróć aktualny obrót grupy, żeby dostać kąt w lokalnym układzie wycinków.
    const local = normalize360(angle - rotationRef.current);
    let cumulative = 0;
    for (let i = 0; i < data.length; i++) {
      const fraction = data[i].value / total;
      const start = cumulative * 360;
      const end = (cumulative + fraction) * 360;
      if (local >= start && local < end) return i;
      cumulative += fraction;
    }
    return null;
  }

  function handlePointerUp(e: ReactPointerEvent<SVGSVGElement>) {
    setDragging(false);
    if (movementRef.current < TAP_THRESHOLD_DEG) {
      const hit = hitTestSlice(e.clientX, e.clientY);
      setSelected((prev) => (prev === hit ? null : hit));
      return;
    }
    if (reducedMotion) return;

    // Bezwładność: kontynuuj obrót ze zwalniającą prędkością.
    let v = velocityRef.current;
    const friction = 0.94;
    const step = () => {
      v *= friction;
      if (Math.abs(v) < 0.003) {
        rafRef.current = null;
        return;
      }
      setRotation((r) => r + v * 16);
      rafRef.current = requestAnimationFrame(step);
    };
    if (Math.abs(v) > 0.01) {
      rafRef.current = requestAnimationFrame(step);
    }
  }

  if (total <= 0) {
    return (
      <div className="flex h-[220px] w-[220px] items-center justify-center rounded-full border border-dashed border-border-strong">
        <p className="max-w-[110px] text-center text-xs text-ink-faint">
          Brak danych w tym okresie
        </p>
      </div>
    );
  }

  const selectedSlice = selected !== null ? data[selected] : null;

  let cumulative = 0;
  const slices = data.map((slice, i) => {
    const fraction = slice.value / total;
    const start = cumulative * 360;
    const end = (cumulative + fraction) * 360;
    cumulative += fraction;
    const mid = (start + end) / 2;
    const isSelected = selected === i;
    const offset = isSelected
      ? { x: Math.cos((mid * Math.PI) / 180) * POP, y: Math.sin((mid * Math.PI) / 180) * POP }
      : { x: 0, y: 0 };
    return { ...slice, start, end, isSelected, offset, index: i };
  });

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div
          className="relative shrink-0 transition-transform duration-500 ease-out"
          style={{
            transform: revealed ? "scale(1)" : "scale(0.7)",
            opacity: revealed ? 1 : 0,
            transitionProperty: "transform, opacity",
          }}
        >
          <svg
            ref={svgRef}
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            role="img"
            aria-label="Wykres kołowy wydatków wg kategorii — przeciągnij, aby obrócić, kliknij kategorię po szczegóły"
            style={{
              cursor: dragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
          >
            <g
              style={{
                transformOrigin: `${CENTER}px ${CENTER}px`,
                transform: `rotate(${rotation}deg)`,
                transition: dragging ? "none" : "transform 0.15s linear",
              }}
            >
              <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill="none" stroke="var(--border)" strokeWidth={1} />
              {slices.map((s) => (
                <path
                  key={s.label}
                  d={donutArcPath(s.start, s.end)}
                  fill={s.color}
                  opacity={selected === null || s.isSelected ? 1 : 0.35}
                  style={{
                    transform: `translate(${s.offset.x}px, ${s.offset.y}px)`,
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease",
                  }}
                />
              ))}
            </g>
          </svg>

          {/* Etykieta na środku — poza obracaną grupą, zawsze prosto. */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            {selectedSlice ? (
              <>
                <CategoryIcon icon={selectedSlice.icon} className="h-5 w-5" style={{ color: selectedSlice.color }} />
                <p className="tabular mt-1.5 font-display text-lg font-semibold tracking-tight text-ink">
                  {Math.round((selectedSlice.value / total) * 100)}%
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] text-ink-faint">Razem</p>
                <p className="tabular mt-0.5 font-display text-lg font-semibold tracking-tight text-ink">
                  {formatPLN(total)}
                </p>
              </>
            )}
          </div>
        </div>

        <ul className="w-full space-y-1.5">
          {data.map((slice, i) => (
            <li key={slice.label}>
              <button
                onClick={() => setSelected((prev) => (prev === i ? null : i))}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-surface-hover"
                style={{ opacity: selected === null || selected === i ? 1 : 0.5 }}
              >
                <span className="flex items-center gap-2 text-ink-muted">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: slice.color }} />
                  {slice.label}
                </span>
                <span className="tabular text-ink">
                  {Math.round((slice.value / total) * 100)}%
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel szczegółów — płynnie rozwija/zwija się (grid-template-rows 0fr↔1fr). */}
      <div
        className="grid transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: selectedSlice ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {selectedSlice && (
            <div className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${selectedSlice.color}26`, color: selectedSlice.color }}
              >
                <CategoryIcon icon={selectedSlice.icon} className="h-5 w-5" />
              </span>
              <div className="grid flex-1 grid-cols-3 gap-3">
                <div>
                  <p className="text-[11px] text-ink-faint">{selectedSlice.label}</p>
                  <p className="tabular text-sm font-semibold text-ink">{formatPLN(selectedSlice.value)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-ink-faint">Transakcji</p>
                  <p className="tabular text-sm font-semibold text-ink">{selectedSlice.count}</p>
                </div>
                <div>
                  <p className="text-[11px] text-ink-faint">Średnio</p>
                  <p className="tabular text-sm font-semibold text-ink">
                    {formatPLN(selectedSlice.value / selectedSlice.count)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
