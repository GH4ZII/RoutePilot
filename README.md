# RoutePilot

Logistikk- og ruteplanleggingsplattform for leveringsselskaper: organisasjoner registrerer leveringer, kjøretøy og sjåfører, genererer optimerte ruter (VRP med kapasitet, tidsvinduer og prioritet), og følger opp gjennomføring via web (dispatcher/admin) og mobil (sjåfør).

## Monorepo

| Mappe | Teknologi | Rolle |
|-------|-----------|--------|
| `apps/web` | React, Vite, Tailwind, Leaflet | Dispatcher og admin |
| `apps/mobile` | Expo, Expo Router | Sjåfør på veien |
| `apps/api` | NestJS, Prisma, PostgreSQL | REST API, auth, jobbkø |
| `apps/optimizer` | Python, FastAPI, OR-Tools | TSP og VRP-beregning |

Infrastruktur lokalt: `docker-compose.yml` (Redis for BullMQ). Database: PostgreSQL (f.eks. Supabase) med migrasjoner under `apps/api/prisma/migrations/`.

## Starte lokalt

Alle kommandoer kjøres fra **repo-roten** (`RoutePilot/`), med mindre annet står.

### Første gang

```powershell
npm install
npm install --prefix apps/api
npm install --prefix apps/web
npm install --prefix apps/mobile

copy apps\api\.env.example apps\api\.env
# Fyll inn DATABASE_URL, JWT_SECRET, osv.

cd apps\api
npx prisma migrate deploy
npx prisma generate
cd ..\..

# Optimizer (kun ved ruteoptimalisering — Windows, bruk py)
cd apps\optimizer
py -3.12 -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
cd ..\..
```

Miljøvariabler:

- `apps/api/.env` — se `.env.example` (`DATABASE_URL`, `JWT_SECRET`, `OSRM_BASE_URL`, `REDIS_*`, `OPTIMIZER_URL`, …)
- `apps/web/.env` — `VITE_API_URL=http://localhost:3000`
- `apps/mobile/.env` — `EXPO_PUBLIC_API_URL=http://localhost:3000` (på telefon: bruk PC-ens IP)

### Starte tjenester

| Hva | Kommando | Port / URL |
|-----|----------|------------|
| Redis (Docker) | `docker compose up -d redis` | 6379 |
| Optimizer (Python) | `npm run dev:optimizer` | http://127.0.0.1:8000 |
| API (NestJS) | `npm run dev:api` | http://localhost:3000 |
| Web (Vite) | `npm run dev:web` | http://localhost:5173 |
| Mobil (Expo) | `npm run dev:mobile` | Expo Dev Tools (QR-kode) |

**API + web + mobil** (én terminal):

```powershell
npm run dev
```

**Med ruteoptimalisering** trenger du i tillegg Redis og optimizer:

```powershell
docker compose up -d redis
npm run dev:optimizer
npm run dev:api
npm run dev:web
```

Uten optimalisering holder API + web til innlogging, CRUD, kart og dashboard.

## Arkitektur

```txt
RoutePilot/
├── apps/web          → React (dispatcher/admin)
├── apps/mobile       → Expo (sjåfør)
├── apps/api          → NestJS + Prisma + BullMQ
├── apps/optimizer    → FastAPI + OR-Tools
└── docker-compose    → Redis
```

Flyt for optimalisering: web → API → OSRM (matrise) → Python `/solve-vrp` → lagring av `routes` / `route_stops` via BullMQ-jobb.

### API-moduler (utvalg)

- **Auth** — registrering, innlogging, JWT, roller (Admin, Dispatcher, Driver)
- **Organizations, Users, Drivers, Vehicles, Deliveries** — CRUD med org-isolasjon
- **Geocoding** — Kartverket adresse-API
- **Routing** — OSRM avstands-/tidsmatrise
- **Optimization** — `POST /optimization/jobs`, bakgrunnsprosessering
- **Routes, Route stops** — planlegging, tildeling, start/fullfør, POD
- **Dashboard** — sammendrag, live ruter, leveringsstatus

Prisma-skjema: `apps/api/prisma/schema.prisma`. Klient genereres til `apps/api/src/generated/prisma` (`npx prisma generate`).

## Implementert vs. gjenstår

MVP-kjernen (faser 1–7) er stort sett på plass: auth, CRUD, kart, VRP, sjåfør-app, dashboard. Detaljert sjekkliste og åpne oppgaver står i [TODO.md](./TODO.md) (rapporter, bredere tester, deploy, CSV-import, sanntid, osv.).

Per-app dokumentasjon:

- [apps/api/README.md](./apps/api/README.md)
- [apps/web/README.md](./apps/web/README.md)
- [apps/mobile/README.md](./apps/mobile/README.md)
- [apps/optimizer/README.md](./apps/optimizer/README.md)

## Tester

```powershell
# Optimizer (fra apps/optimizer med aktiv .venv)
.\.venv\Scripts\python -m pytest tests/ -v

# API
cd apps\api
npm test
```

## Sikkerhet

- Organisasjonsdata isoleres per `organizationId`
- Rollebasert tilgang på API-endepunkter
- Ikke commit `.env` — bruk `.env.example` som mal
