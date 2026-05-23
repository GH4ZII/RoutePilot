# RoutePilot Web

React + Vite + Tailwind for dispatcher og admin: leveringer, sjåfører, kjøretøy, kart, ruteoptimalisering, dashboard og rapporter.

## Oppsett

```powershell
npm install
```

Opprett `.env`:

```env
VITE_API_URL=http://localhost:3000
```

```powershell
npm run dev
```

Appen kjører på http://localhost:5173.

## Rapporter

`/reports` — daglig oversikt, sjåførytelse og rute-effektivitet (React Query + Recharts). Krever innlogget admin eller dispatcher.

## Tester

```powershell
npm test
```

## Roller

- **Admin / Dispatcher** — full web-tilgang
- **Driver** — omdirigeres til info om mobilapp (`apps/mobile`)

Se [README.md](../../README.md) for å starte API og øvrige tjenester.
