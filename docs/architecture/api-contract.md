# API-kontrakt

Base-URL lokalt: `http://localhost:3000` (ingen global prefix).

## Autentisering

| Metode | Sti | Auth | Beskrivelse |
|--------|-----|------|-------------|
| POST | `/auth/register` | Nei | Ny org + admin-bruker |
| POST | `/auth/login` | Nei | JWT access token |
| GET | `/auth/me` | JWT | Innlogget bruker |

**Header:** `Authorization: Bearer <token>`

**JWT-payload:** `sub`, `organizationId`, `role`, `email` (se `JwtPayload`).

Login/register er throttlet (10/min).

## SSE

| Metode | Sti | Auth | Beskrivelse |
|--------|-----|------|-------------|
| GET | `/events/stream?token=` | JWT i query | Server-Sent Events for org |

Hendelser: `route.updated`, `stop.updated`, `driver.location`, `optimization.completed`.

---

## Organisasjon og brukere

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| GET | `/organizations/me` | ADMIN, DISPATCHER | Hent org |
| PATCH | `/organizations/me` | ADMIN | Oppdater org |
| GET | `/users` | ADMIN | Liste brukere |
| POST | `/users` | ADMIN | Opprett bruker |
| GET/PATCH/DELETE | `/users/:id` | ADMIN | CRUD bruker |

## Sjåfører og kjøretøy

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| GET/POST | `/drivers` | ADMIN, DISPATCHER | Liste / opprett |
| GET/PATCH/DELETE | `/drivers/:id` | ADMIN, DISPATCHER | CRUD |
| PATCH | `/drivers/me/location` | DRIVER | GPS-posisjon |
| GET/POST | `/vehicles` | ADMIN, DISPATCHER | Kjøretøy |
| GET/PATCH/DELETE | `/vehicles/:id` | ADMIN, DISPATCHER | CRUD |
| GET/POST | `/depots` | ADMIN, DISPATCHER | Depot |
| GET/PATCH/DELETE | `/depots/:id` | ADMIN, DISPATCHER | CRUD |
| DELETE | `/depots/:id` | ADMIN | Slett depot |

## Leveringer

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| GET | `/deliveries` | ADMIN, DISPATCHER | Liste (filter query) |
| POST | `/deliveries` | ADMIN, DISPATCHER | Opprett |
| POST | `/deliveries/import-csv` | ADMIN, DISPATCHER | CSV-import |
| GET/PATCH | `/deliveries/:id` | ADMIN, DISPATCHER | Hent / oppdater |
| DELETE | `/deliveries/:id` | ADMIN | Slett |

## Geokoding og routing

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| GET | `/geocoding/suggest?q=` | JWT (modul) | Kartverket-forslag |
| POST | `/routing/matrix` | ADMIN, DISPATCHER | OSRM N×N-matrise |

## Optimalisering

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| POST | `/optimization/jobs` | ADMIN, DISPATCHER | Start VRP-jobb |
| GET | `/optimization/jobs/:id` | ADMIN, DISPATCHER | Status og resultat |

**POST body (utdrag):**

```json
{
  "plannedDate": "2026-05-26",
  "vehicleIds": ["..."],
  "driverIds": ["..."],
  "deliveryIds": ["..."],
  "objective": "MINIMIZE_TOTAL_TIME",
  "routeStartTime": "08:00",
  "returnToDepot": true,
  "respectCapacity": true,
  "respectTimeWindows": true
}
```

Enten `vehicleId` (én bil) eller `vehicleIds` (VRP). Respons: jobb med `status`, `request`, `result`, `errorMessage`.

## Ruter

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| GET | `/routes` | ADMIN, DISPATCHER | Liste ruter |
| GET | `/routes/me` | DRIVER | Aktiv/planlagt for sjåfør |
| GET | `/routes/me/today` | DRIVER | Dagens rute(r) |
| GET | `/routes/:id` | ADMIN, DISPATCHER, DRIVER | Detalj inkl. stopp |
| POST | `/routes/:id/assign` | ADMIN, DISPATCHER | Tildel sjåfør |
| POST | `/routes/:id/start` | DRIVER, ADMIN, DISPATCHER | Start rute |
| POST | `/routes/:id/finish` | DRIVER, ADMIN, DISPATCHER | Fullfør rute |
| POST | `/routes/:id/reoptimize` | ADMIN, DISPATCHER | Re-optimaliser eksisterende rute |
| DELETE | `/routes/:id` | ADMIN, DISPATCHER | Slett planlagt rute |

## Rutestopp og POD

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| POST | `/route-stops/:id/complete` | DRIVER, ADMIN, DISPATCHER | Fullfør stopp |
| POST | `/route-stops/:id/fail` | DRIVER, ADMIN, DISPATCHER | Feilet levering |
| GET | `/route-stops/:id/proof` | ADMIN, DISPATCHER, DRIVER | Hent POD |
| POST | `/route-stops/:id/proof` | DRIVER, ADMIN | Last opp POD (foto/signatur URL eller data) |

## Dashboard og rapporter

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| GET | `/dashboard/summary` | ADMIN, DISPATCHER | Aggregert oversikt |
| GET | `/dashboard/routes/live` | ADMIN, DISPATCHER | Aktive ruter |
| GET | `/dashboard/deliveries/status` | ADMIN, DISPATCHER | Leveringsstatus-fordeling |
| GET | `/reports/daily` | ADMIN, DISPATCHER | Daglig rapport |
| GET | `/reports/driver-performance` | ADMIN, DISPATCHER | Sjåførytelse |
| GET | `/reports/route-efficiency` | ADMIN, DISPATCHER | Rute-effektivitet |
| GET | `/reports/planned-vs-actual` | ADMIN, DISPATCHER | Plan vs. faktisk |
| GET | `/reports/daily/export.csv` | ADMIN, DISPATCHER | CSV-eksport |
| GET | `/reports/route-efficiency/export.csv` | ADMIN, DISPATCHER | CSV-eksport |
| GET | `/reports/routes/:id/export.pdf` | ADMIN, DISPATCHER | PDF for én rute |

Query-parametre for rapporter: se `ReportsQueryDto` (`date`, `from`, `to`, …).

## Notifikasjoner

| Metode | Sti | Roller | Beskrivelse |
|--------|-----|--------|-------------|
| GET | `/notifications` | ADMIN, DISPATCHER | Varslingslogg (stub-send) |

---

## Feilhåndtering

- Validering: `400` med Nest `ValidationPipe` (whitelist + forbidNonWhitelisted)
- Auth: `401`
- Rolle/org: `403`
- Ikke funnet: `404` (norske meldinger i mange services)
- Optimizer/OSRM nede: `503` Service Unavailable

## Konvensjoner

- IDs er `cuid()` strenger
- Datoer i API ofte `YYYY-MM-DD`; lagres som `Date` / `@db.Date` der relevant
- Desimaler fra DB serialiseres som tall i JSON der `decimalToNumber` brukes
- Alle muterende business-endepunkter krever JWT unntatt `auth/register` og `auth/login`

Implementasjonsreferanse: `apps/api/src/**/**.controller.ts`
