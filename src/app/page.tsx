import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">
        Kalkulator Finansów Rodzinnych
      </h1>
      <p className="mt-3 max-w-md text-slate-500">
        Zarządzaj budżetem domowym z dowolnego urządzenia. Twoje dane widzisz
        tylko Ty — logowanie chroni każde konto osobno.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Zaloguj się
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Załóż konto
        </Link>
      </div>
    </div>
  );
}
