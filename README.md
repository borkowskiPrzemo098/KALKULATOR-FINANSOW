# Kalkulator Finansów Rodzinnych

Aplikacja webowa do zarządzania budżetem domowym — dostęp z dowolnego
urządzenia (telefon, tablet, komputer), proste logowanie e-mail + hasło,
dane każdego użytkownika są od siebie odizolowane.

## Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript, Tailwind CSS)
- [Supabase](https://supabase.com/) — baza danych PostgreSQL + logowanie hasłem
- **Row Level Security** w bazie danych — mechanizm, który na poziomie samej
  bazy blokuje dostęp jednego użytkownika do danych innego. Nawet błąd w
  kodzie aplikacji nie pozwoli podejrzeć cudzych transakcji.

## Jak to działa (bezpieczeństwo)

- Hasła nigdy nie są przechowywane w tym repozytorium ani w kodzie — obsługuje
  je Supabase Auth (haszowanie, tokeny sesji w bezpiecznych ciasteczkach).
- Repozytorium jest publiczne, ale zawiera wyłącznie **kod aplikacji**.
  Żadne dane finansowe użytkowników nigdy tu nie trafiają — żyją wyłącznie
  w bazie danych Supabase, do której dostęp regulują polityki RLS
  (`supabase/schema.sql`).
- Middleware (`middleware.ts`) chroni strony prywatne (`/dashboard`) — bez
  zalogowania użytkownik jest przekierowywany na `/login`.

## Uruchomienie lokalnie

1. Zainstaluj zależności:

   ```bash
   npm install
   ```

2. Utwórz darmowy projekt na [supabase.com](https://supabase.com/), a
   następnie w **SQL Editor** wklej i uruchom zawartość pliku
   [`supabase/schema.sql`](supabase/schema.sql) — utworzy to tabele i
   polityki bezpieczeństwa.

3. Skopiuj `.env.local.example` do `.env.local` i uzupełnij danymi z
   **Project Settings → API** swojego projektu Supabase:

   ```bash
   cp .env.local.example .env.local
   ```

4. Uruchom serwer developerski:

   ```bash
   npm run dev
   ```

   Aplikacja będzie dostępna pod `http://localhost:3000`.

## Wdrożenie (żeby mieć dostęp z każdego urządzenia)

Najprościej wdrożyć na [Vercel](https://vercel.com/) (darmowy plan
wystarczy na start):

1. Zaimportuj to repozytorium z GitHuba na Vercel.
2. Dodaj te same zmienne środowiskowe co w `.env.local` w ustawieniach
   projektu na Vercel.
3. Deploy — aplikacja dostanie publiczny adres `https://twoja-nazwa.vercel.app`,
   dostępny z telefonu, tabletu i komputera.

## Struktura projektu

```
src/app/                  strony (App Router)
  page.tsx                strona główna
  login/, signup/          logowanie i rejestracja
  (app)/dashboard/         panel po zalogowaniu (chroniony)
src/lib/supabase/         klienci Supabase (przeglądarka, serwer, middleware)
supabase/schema.sql       schemat bazy danych + polityki RLS
```

## Status projektu

Wersja startowa: logowanie, rejestracja, dodawanie/usuwanie transakcji,
podsumowanie przychodów/wydatków/bilansu. Możliwe dalsze kroki: kategorie
wydatków, wykresy, budżety miesięczne, eksport do CSV, współdzielenie
budżetu w rodzinie (wielu użytkowników na jednym koncie domowym).
