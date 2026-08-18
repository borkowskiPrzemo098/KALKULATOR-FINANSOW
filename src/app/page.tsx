import Link from "next/link";
import { MarkIcon, ArrowUpRightIcon, ArrowDownRightIcon, LockIcon, ShieldIcon } from "@/components/icons";
import ThemeToggle from "@/components/theme-toggle";
import TiltCard from "@/components/tilt-card";

export default function Home() {
  return (
    <div className="grain relative min-h-screen overflow-hidden bg-canvas">
      {/* Poświata tła — dwa nakładające się gradienty radialne, jeden
          moment światła, nie fajerwerki. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 15% -10%, rgba(201,164,92,0.16), transparent 60%), radial-gradient(50rem 36rem at 100% 10%, rgba(143,174,134,0.10), transparent 55%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6">
        <header className="flex items-center justify-between py-8">
          <div className="flex items-center gap-2.5 text-ink">
            <MarkIcon className="h-6 w-6 text-accent" />
            <span className="text-sm font-medium tracking-wide">
              Kalkulator Finansów Rodzinnych
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-ink-muted">
            <Link href="/login" className="transition-colors hover:text-ink">
              Zaloguj się
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-border-strong px-4 py-2 text-ink transition-colors hover:border-accent hover:text-accent"
            >
              Załóż konto
            </Link>
            <ThemeToggle />
          </nav>
        </header>

        <main className="flex flex-1 flex-col justify-center py-16">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-rise max-w-xl">
              <h1 className="font-display text-6xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-7xl">
                Prywatny budżet
                <br />
                <span className="text-ink-muted">rodzinny.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
                Koniec z rozjeżdżającym się Excelem. Jeden kalkulator budżetu
                rodzinnego, dostępny z telefonu, tabletu i komputera — a
                Twoje dane widzisz tylko Ty.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
                >
                  Załóż konto
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  Mam już konto
                </Link>
              </div>
            </div>

            {/* Pływająca podglądowa karta — ilustracja, nie realne dane;
                daje efekt głębi 3D już w pierwszym wrażeniu. */}
            <div
              className="animate-rise hidden lg:block"
              style={{ animationDelay: "160ms" }}
            >
              <TiltCard className="rounded-2xl border border-border bg-canvas-raised p-6">
                <p className="text-xs font-medium text-ink-muted">
                  Podgląd miesiąca
                </p>
                <p className="tabular mt-2 font-display text-4xl font-semibold tracking-tight text-ink">
                  4 280,00 zł
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink-muted">
                      <ArrowUpRightIcon className="h-3.5 w-3.5 text-positive" />
                      Przychody
                    </span>
                    <span className="tabular text-positive-strong">
                      6 100,00 zł
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-ink-muted">
                      <ArrowDownRightIcon className="h-3.5 w-3.5 text-negative" />
                      Wydatki
                    </span>
                    <span className="tabular text-negative-strong">
                      1 820,00 zł
                    </span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>

          <div
            className="animate-rise mt-24 flex flex-col gap-8 border-t border-border pt-8 sm:flex-row sm:gap-0 sm:divide-x sm:divide-border"
            style={{ animationDelay: "260ms" }}
          >
            <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted sm:w-1/3 sm:pr-8">
              <LockIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Login i hasło — żadnego e-maila, żadnego numeru telefonu.
            </p>
            <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted sm:w-1/3 sm:px-8">
              <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Każde konto widzi wyłącznie własny budżet.
            </p>
            <p className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted sm:w-1/3 sm:pl-8">
              <MarkIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              Telefon, tablet, komputer — jedna przeglądarka wystarczy.
            </p>
          </div>
        </main>

        <footer className="py-8 text-xs text-ink-faint">
          Kalkulator Finansów Rodzinnych
        </footer>
      </div>
    </div>
  );
}
