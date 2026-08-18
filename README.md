# Kalkulator Finansów Rodzinnych

Aplikacja webowa do zarządzania budżetem domowym — dostęp z dowolnego
urządzenia (telefon, tablet, komputer). Logowanie samym loginem i hasłem
(bez e-maila, bez numeru telefonu). Dane każdego użytkownika są od siebie
odizolowane.

## Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript, Tailwind CSS)
- [Prisma](https://www.prisma.io/) + PostgreSQL
- Autoryzacja własna: hasła haszowane `bcrypt`, sesja w bezpiecznym
  ciasteczku (httpOnly, JWT) — ten sam sprawdzony wzorzec co w projekcie
  Siłownia Ranking.

## Bezpieczeństwo

- Hasła nigdy nie są przechowywane jawnie — tylko jako hash `bcrypt`
  (12 rund).
- Sesja logowania żyje w ciasteczku `httpOnly` — niedostępnym dla
  JavaScriptu w przeglądarce (ochrona przed XSS).
- Każde zapytanie do bazy filtruje dane po `userId` zalogowanej osoby —
  jeden użytkownik nie może odczytać ani usunąć transakcji innego.
- Brak automatycznego resetu hasła e-mailem (aplikacja świadomie nie
  zbiera e-maili ani telefonów) — hasło może zresetować wyłącznie
  administrator, przez panel `/admin/users`.
- Repozytorium jest publiczne, ale zawiera wyłącznie **kod aplikacji**.
  Żadne hasła ani dane finansowe użytkowników nigdy tu nie trafiają —
  żyją wyłącznie w bazie danych.

## Uruchomienie lokalnie

1. Zainstaluj zależności:

   ```bash
   npm install
   ```

2. Skopiuj `.env.example` do `.env` i uzupełnij `DATABASE_URL` (Postgres)
   oraz `JWT_SECRET` (losowy ciąg, np. `openssl rand -hex 32`):

   ```bash
   cp .env.example .env
   ```

3. Utwórz tabele w bazie:

   ```bash
   npm run db:push
   ```

4. Uruchom serwer developerski:

   ```bash
   npm run dev
   ```

   Aplikacja będzie dostępna pod `http://localhost:3000`.

5. Zarejestruj pierwsze konto na `/signup`, a następnie nadaj mu
   uprawnienia administratora (potrzebne do resetowania haseł innych
   użytkowników):

   ```bash
   npm run set-admin -- twoj-login
   ```

## Wdrożenie (żeby mieć dostęp z każdego urządzenia)

Najprościej wdrożyć na [Vercel](https://vercel.com/) (darmowy plan
wystarczy na start):

1. Zaimportuj to repozytorium z GitHuba na Vercel.
2. W kreatorze importu dodaj bazę danych: zakładka **Storage → Create
   Database → Postgres** — `DATABASE_URL` doda się do projektu
   automatycznie.
3. Dodaj zmienną środowiskową `JWT_SECRET` (losowy długi ciąg).
4. Deploy — aplikacja dostanie publiczny adres
   `https://twoja-nazwa.vercel.app`, dostępny z telefonu, tabletu i
   komputera.
5. Po pierwszym wdrożeniu nadaj sobie uprawnienia admina poleceniem
   `npm run set-admin -- twoj-login` uruchomionym lokalnie z tym samym
   `DATABASE_URL` co produkcja.

## Struktura projektu

```
src/app/                  strony (App Router)
  page.tsx                strona główna
  login/, signup/          logowanie i rejestracja (login + hasło)
  (app)/dashboard/         panel po zalogowaniu (chroniony)
  admin/users/             panel admina — reset hasła użytkownika
  api/auth/                logowanie, rejestracja, wylogowanie
  api/admin/users/         reset hasła (tylko admin)
src/lib/auth.ts            sesja JWT w ciasteczku httpOnly
src/lib/prisma.ts          klient Prisma
prisma/schema.prisma       schemat bazy danych
scripts/set-admin.ts       nadanie uprawnień admina (lokalnie, poza appką)
```

## Status projektu

Wersja startowa: logowanie loginem/hasłem, rejestracja, dodawanie/usuwanie
transakcji, podsumowanie przychodów/wydatków/bilansu, panel admina do
resetu haseł. Możliwe dalsze kroki: kategorie wydatków, wykresy, budżety
miesięczne, eksport do CSV, współdzielenie budżetu w rodzinie (wielu
użytkowników na jednym koncie domowym).
