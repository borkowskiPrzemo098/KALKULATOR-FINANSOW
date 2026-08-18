"use client";

import { useEffect } from "react";
import { MarkIcon } from "@/components/icons";

/**
 * Globalna siatka bezpieczeństwa. Najczęstsza przyczyna: strona była
 * otwarta na telefonie/w karcie z poprzedniej wersji aplikacji, a w
 * międzyczasie wdrożyliśmy nową — próba zapisania/usunięcia czegoś
 * (Server Action) trafia w nieistniejącą już wersję serwera i się wiesza.
 * Zamiast cichego zawieszenia: jasny komunikat + jeden przycisk, który to
 * naprawia (pełne przeładowanie pobiera świeżą wersję).
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Nic nie logujemy do zewnętrznych usług — tylko lokalna diagnostyka.
  }, []);

  return (
    <div className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4">
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-canvas-raised p-8 text-center">
        <MarkIcon className="mx-auto h-8 w-8 text-accent" />
        <h1 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
          Dostępna nowa wersja aplikacji
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Ta karta była otwarta ze starszej wersji. Odśwież, żeby pobrać
          aktualną — Twoje dane są bezpieczne, nic nie zginęło.
        </p>
        <button
          onClick={() => {
            reset();
            window.location.reload();
          }}
          className="mt-6 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
        >
          Odśwież stronę
        </button>
      </div>
    </div>
  );
}
