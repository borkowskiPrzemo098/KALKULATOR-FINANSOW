import { createClient } from "@/lib/supabase/server";
import { addTransaction } from "./actions";
import DeleteButton from "./delete-button";

function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

export default async function DashboardPage() {
  const supabase = await createClient();

  // RLS w bazie danych gwarantuje, że to zapytanie zwróci WYŁĄCZNIE
  // transakcje zalogowanego użytkownika — nie trzeba tego dodatkowo filtrować.
  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, type, amount, description, occurred_on")
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  const list = transactions ?? [];
  const income = list
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = list
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Przychody</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-600">
            {formatPLN(income)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Wydatki</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">
            {formatPLN(expense)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Bilans</p>
          <p
            className={`mt-1 text-2xl font-semibold ${
              balance >= 0 ? "text-slate-900" : "text-red-600"
            }`}
          >
            {formatPLN(balance)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Dodaj transakcję
        </h2>
        <form
          action={addTransaction}
          className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end"
        >
          <div className="sm:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Typ
            </label>
            <select
              name="type"
              defaultValue="expense"
              className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
            >
              <option value="expense">Wydatek</option>
              <option value="income">Przychód</option>
            </select>
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Kwota (PLN)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0.01"
              required
              className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Opis
            </label>
            <input
              type="text"
              name="description"
              placeholder="np. Zakupy spożywcze"
              className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Data
            </label>
            <input
              type="date"
              name="occurred_on"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-5">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Dodaj
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <h2 className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900">
          Ostatnie transakcje
        </h2>
        {list.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-slate-400">
            Brak transakcji. Dodaj pierwszą powyżej.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm text-slate-900">
                    {t.description || "(bez opisu)"}
                  </p>
                  <p className="text-xs text-slate-400">{t.occurred_on}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${
                      t.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatPLN(Number(t.amount))}
                  </span>
                  <DeleteButton id={t.id} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
