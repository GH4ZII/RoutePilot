# RoutePilot — agent guide

Denne filen er inngangspunktet for AI-agenter og utviklere som jobber i repoet. Les den før du endrer kode.

## Hva er RoutePilot?

Multi-tenant logistikkplattform for leveringsselskaper: organisasjoner registrerer **leveringer**, **kjøretøy**, **sjåfører** og **depot**, kjører **VRP-optimalisering**, tildeler **ruter**, og følger gjennomføring via **web** (dispatcher/admin) og **mobil** (sjåfør).

## Monorepo — hvor ting bor

| Sti | Stack | Ansvar |
|-----|-------|--------|
| `apps/api` | NestJS, Prisma, BullMQ, PostgreSQL | REST API, auth, jobbkø, SSE |
| `apps/web` | React, Vite, Tailwind, Leaflet | Dispatcher og admin |
| `apps/mobile` | Expo, Expo Router | Sjåfør på veien |
| `apps/optimizer` | Python, FastAPI, OR-Tools | TSP og VRP-beregning |
| `docker-compose.yml` | Redis | BullMQ (optimalisering) |

**Kilde til sannhet for datamodell:** `apps/api/prisma/schema.prisma`  
**Generert Prisma-klient:** `apps/api/src/generated/prisma` (kjør `npx prisma generate` i `apps/api`)

## Dokumentasjon (les ved behov)

| Dokument | Innhold |
|----------|---------|
| [docs/architecture/overview.md](docs/architecture/overview.md) | Systemarkitektur og dataflyt |
| [docs/architecture/api-contract.md](docs/architecture/api-contract.md) | REST-endepunkter og roller |
| [docs/architecture/optimization-pipeline.md](docs/architecture/optimization-pipeline.md) | VRP fra web til database |
| [docs/domain/terminology.md](docs/domain/terminology.md) | Domenespråk og enums |
| [docs/planning/mvp.md](docs/planning/mvp.md) | MVP-scope og status |
| [docs/planning/roadmap.md](docs/planning/roadmap.md) | Prioritert videre arbeid |
| [README.md](README.md) | Lokal oppstart og kommandoer |

## Viktige regler for agenter

1. **Organisasjonsisolasjon** — All forretningsdata filtreres på `organizationId` fra JWT. Bruk `OrgScopeService` / `forOrganization()` i API; ikke stol på klient-supplied org-id.
2. **Roller** — `ADMIN`, `DISPATCHER`, `DRIVER`. Sjekk `@Roles()` på controllere før du eksponerer nye endepunkter.
3. **Minimal diff** — Match eksisterende mønstre (Nest-moduler, DTO + class-validator, Prisma-transaksjoner). Ikke refaktorer bredt uten at brukeren ber om det.
4. **Språk** — Brukergrensesnitt og API-feilmeldinger er ofte på **norsk bokmål**. Kode, typer og filnavn på engelsk.
5. **Ikke commit hemmeligheter** — `.env` skal aldri committes. Bruk `.env.example` som mal.
6. **Optimalisering krever infra** — VRP trenger Redis + Python optimizer + OSRM (`OSRM_BASE_URL`). Uten det fungerer CRUD, kart og dashboard.
7. **Prisma** — Etter schema-endring: migrasjon i `apps/api/prisma/migrations/`, deretter `npx prisma generate`.

## Typisk arbeidsflyt lokalt

Fra repo-roten:

```powershell
docker compose up -d redis          # ved optimalisering
npm run dev:optimizer               # port 8000
npm run dev                         # api + web + mobile
```

API: `http://localhost:3000` · Web: `http://localhost:5173` · Optimizer: `http://127.0.0.1:8000`

## Tester

```powershell
cd apps/optimizer && .\.venv\Scripts\python -m pytest tests/ -v
cd apps/api && npm test && npm run test:e2e
cd apps/web && npm test
cd apps/mobile && npm test
```

## Når du er usikker

- **API-atferd** → les controller + service i `apps/api/src/<modul>/`
- **Begreper** → [docs/domain/terminology.md](docs/domain/terminology.md)
- **Optimalisering** → [docs/architecture/optimization-pipeline.md](docs/architecture/optimization-pipeline.md)
- **Hva som gjenstår** → [docs/planning/roadmap.md](docs/planning/roadmap.md)

Prosjektregler for Cursor ligger i [.cursor/rules/project-rules.mdc](.cursor/rules/project-rules.mdc).
