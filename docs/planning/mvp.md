# MVP — scope og status

MVP for RoutePilot dekker **planlegging, optimalisering, gjennomføring og oppfølging** for ett leveringsselskap (én organisasjon) med web for dispatch og mobil for sjåfør.

## Målbrukere

| Rolle | Klient | MVP-behov |
|-------|--------|-----------|
| Admin | Web | Brukere, org-data, full CRUD |
| Dispatcher | Web | Leveringer, kart, VRP, ruter, rapporter |
| Sjåfør | Mobil | Dagens rute, stopp, POD, posisjon |

## Funksjonell scope (inkludert i MVP)

### Fase 1–2 — Grunnmur

- [x] Registrering av organisasjon + admin (`POST /auth/register`)
- [x] Innlogging JWT + roller
- [x] Org-isolert CRUD: brukere, sjåfører, kjøretøy, depot, leveringer
- [x] Geokoding (Kartverket) ved adresseinntasting

### Fase 3–4 — Kart og enkel rute

- [x] Web-kart (Leaflet) med leveringer og ruter
- [x] OSRM avstands-/tidsmatrise
- [x] TSP for én bil (`/solve`) — bakoverkompatibel i optimizer

### Fase 5 — VRP

- [x] Multi-vehicle VRP med kapasitet, tidsvinduer, prioritet
- [x] Fem optimaliseringsmål (`OptimizationObjective`)
- [x] Asynkron jobb (BullMQ) + polling/SSE i web
- [x] Re-optimalisering av eksisterende rute

### Fase 6 — Sjåfør og gjennomføring

- [x] Mobilapp: dagens rute, start/fullfør rute
- [x] Fullfør/feil stopp, POD (foto + signatur)
- [x] GPS til `PATCH /drivers/me/location`
- [x] Tildeling av rute fra web

### Fase 7 — Innsikt

- [x] Dashboard (sammendrag, live ruter, leveringsstatus)
- [x] Rapporter + CSV/PDF-eksport
- [x] CSV-import av leveringer
- [x] SSE på web (`route.updated`, `stop.updated`, `driver.location`, `optimization.completed`)

## Utenfor MVP-kjerne (kjent gap)

Disse er **ikke** blokkere for demo av planlegging/levering, men mangler for «produktferdig»:

| Område | Status |
|--------|--------|
| Org-innstillinger i web (`/settings/org`) | API finnes; UI er placeholder |
| POD-visning i web (arkiv/detalj) | Data i API; ingen galleri-UI |
| Ekte SMS/e-post til kunde | Stub i `NotificationsService` |
| CI/CD (GitHub Actions) | Ikke satt opp |
| API health endpoint | Mangler (optimizer har `/health`) |
| POD object storage (S3/Supabase) | Data-URI/base64 i DB |
| Bred e2e-dekning | Minimal `app.e2e-spec.ts` |
| Mobil SSE | Bevisst polling/no-op |
| Passord-reset / invitasjonsflyt | Ikke implementert |

## Akseptansekriterier (MVP «ferdig»)

MVP anses **levert** når en dispatcher kan:

1. Logge inn og administrere leveringer for sin org.
2. Kjøre VRP for valgt dato/kjøretøy og få planlagte ruter i systemet.
3. Tildele rute til sjåfør.
4. Sjåfør fullfører alle stopp med POD fra mobil.
5. Dispatcher ser status på dashboard og i rapporter.

Dette er oppfylt i dagens kodebase; gjenstående arbeid er **modning** (se [roadmap.md](./roadmap.md)).

## Teknisk MVP-stack

- PostgreSQL + Prisma migrasjoner
- Redis + BullMQ for optimalisering
- OSRM + Python OR-Tools
- Web + Expo mobil

Lokal oppstart: [README.md](../../README.md)
