# RoutePilot API

NestJS-backend med Prisma (PostgreSQL), JWT-auth, BullMQ og integrasjon mot OSRM og Python-optimalizeren.

## Oppsett

```powershell
npm install
copy .env.example .env
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

Standard port: **3000** (se `PORT` i `.env`).

## Viktige filer

| Sti | Innhold |
|-----|---------|
| `prisma/schema.prisma` | Datamodell |
| `prisma/migrations/` | Offisielle DB-migrasjoner (ikke rediger manuelt utenom nye migrasjoner) |
| `src/` | Moduler (auth, deliveries, routes, optimization, dashboard, reports, …) |
| `src/generated/prisma/` | Generert Prisma-klient (`npx prisma generate`) |

## Miljøvariabler

Se [.env.example](./.env.example): `DATABASE_URL`, `JWT_SECRET`, `OSRM_BASE_URL`, `REDIS_HOST` / `REDIS_PORT`, `OPTIMIZER_URL`, `WEB_ORIGIN`.

Redis: `docker compose up -d redis` fra repo-roten.

## Rapporter (admin / dispatcher)

| Metode | Sti | Beskrivelse |
|--------|-----|-------------|
| GET | `/reports/daily?date=YYYY-MM-DD` | Daglig oppsummering |
| GET | `/reports/driver-performance?from=&to=` | Sjåførytelse (standard: siste 7 dager) |
| GET | `/reports/route-efficiency?from=&to=` | Effektivitet per fullført rute |

## Utvikling

```powershell
npm run start:dev   # watch
npm run build
npm run test
npm run test:e2e
```

Rate limiting: globalt 100 forespørsler/min; `POST /auth/login` og `/auth/register` er begrenset til 10/min.

Full prosjektstart: [README.md](../../README.md) i repo-roten.
