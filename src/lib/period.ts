// Wspólna logika okresów (dzień/tydzień/miesiąc/rok) używana przez cały
// dashboard — jedno źródło prawdy dla filtrowania, żeby wszystkie widoki
// (podsumowanie, lista, wykres, budżety) patrzyły na ten sam zakres dat.
// Wszystko liczone w UTC, bo occurredOn w bazie to data bez czasu.

export type PeriodRange = "day" | "week" | "month" | "year";

export const PERIOD_LABELS: Record<PeriodRange, string> = {
  day: "Dzień",
  week: "Tydzień",
  month: "Miesiąc",
  year: "Rok",
};

const MONTH_NAMES = [
  "stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia",
];
const MONTH_NAMES_NOM = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień",
];

function toUTCDate(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Poniedziałek jako początek tygodnia (ISO). */
function startOfWeekUTC(d: Date) {
  const day = d.getUTCDay(); // 0=niedziela..6=sobota
  const diff = (day === 0 ? -6 : 1) - day;
  const start = new Date(d);
  start.setUTCDate(d.getUTCDate() + diff);
  return toUTCDate(start);
}

export function parsePeriodParams(searchParams: {
  range?: string;
  date?: string;
}): { range: PeriodRange; anchor: Date } {
  const range: PeriodRange =
    searchParams.range === "day" ||
    searchParams.range === "week" ||
    searchParams.range === "year"
      ? searchParams.range
      : "month";

  let anchor = toUTCDate(new Date());
  if (searchParams.date) {
    const parsed = new Date(searchParams.date + "T00:00:00Z");
    if (!isNaN(parsed.getTime())) anchor = parsed;
  }

  return { range, anchor };
}

/** Zwraca [start, end) — end wyłączny, do porównań occurredOn < end. */
export function getPeriodBounds(range: PeriodRange, anchor: Date) {
  const a = toUTCDate(anchor);
  let start: Date;
  let end: Date;

  switch (range) {
    case "day":
      start = a;
      end = new Date(a);
      end.setUTCDate(end.getUTCDate() + 1);
      break;
    case "week":
      start = startOfWeekUTC(a);
      end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 7);
      break;
    case "year":
      start = new Date(Date.UTC(a.getUTCFullYear(), 0, 1));
      end = new Date(Date.UTC(a.getUTCFullYear() + 1, 0, 1));
      break;
    case "month":
    default:
      start = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), 1));
      end = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + 1, 1));
      break;
  }
  return { start, end };
}

export function shiftAnchor(range: PeriodRange, anchor: Date, dir: 1 | -1): Date {
  const a = toUTCDate(anchor);
  switch (range) {
    case "day":
      a.setUTCDate(a.getUTCDate() + dir);
      return a;
    case "week":
      a.setUTCDate(a.getUTCDate() + dir * 7);
      return a;
    case "year":
      a.setUTCFullYear(a.getUTCFullYear() + dir);
      return a;
    case "month":
    default:
      a.setUTCMonth(a.getUTCMonth() + dir);
      return a;
  }
}

export function formatAnchorISO(d: Date): string {
  return toUTCDate(d).toISOString().slice(0, 10);
}

export function getPeriodLabel(range: PeriodRange, anchor: Date): string {
  const a = toUTCDate(anchor);
  switch (range) {
    case "day":
      return `${a.getUTCDate()} ${MONTH_NAMES[a.getUTCMonth()]} ${a.getUTCFullYear()}`;
    case "week": {
      const start = startOfWeekUTC(a);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 6);
      const sameMonth = start.getUTCMonth() === end.getUTCMonth();
      const startStr = `${start.getUTCDate()}${sameMonth ? "" : " " + MONTH_NAMES[start.getUTCMonth()]}`;
      const endStr = `${end.getUTCDate()} ${MONTH_NAMES[end.getUTCMonth()]}`;
      return `${startStr}–${endStr} ${end.getUTCFullYear()}`;
    }
    case "year":
      return `${a.getUTCFullYear()}`;
    case "month":
    default:
      return `${MONTH_NAMES_NOM[a.getUTCMonth()]} ${a.getUTCFullYear()}`;
  }
}

/** Czy anchor wypada w bieżącym okresie (do wyłączenia strzałki "dalej"). */
export function isCurrentPeriod(range: PeriodRange, anchor: Date): boolean {
  const { start, end } = getPeriodBounds(range, new Date());
  const { start: aStart } = getPeriodBounds(range, anchor);
  return aStart >= start && aStart < end;
}
