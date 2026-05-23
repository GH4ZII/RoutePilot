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
| `src/` | Moduler (auth, deliveries, routes, optimization, …) |
| `src/generated/prisma/` | Generert Prisma-klient (`npx prisma generate`) |

## Miljøvariabler

Se [.env.example](./.env.example): `DATABASE_URL`, `JWT_SECRET`, `OSRM_BASE_URL`, `REDIS_HOST` / `REDIS_PORT`, `OPTIMIZER_URL`, `WEB_ORIGIN`.

Redis: `docker compose up -d redis` fra repo-roten.

## Utvikling

```powershell
npm run start:dev   # watch
npm run build
npm run test
```

Full prosjektstart: [README.md](../../README.md) i repo-roten.
