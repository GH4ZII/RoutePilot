# RoutePilot — To-do liste

Basert på [README.md](./README.md). Repoet er foreløpig greenfield (kun README).

**Sist oppdatert:** 2026-05-22

---

## Status

| Område        | Status      |
|---------------|-------------|
| Web           | Startet (dashboard) |
| Mobile (Expo) | Startet (sjåfør-workflow) |
| Backend       | Startet (auth) |
| Database      | Startet (Prisma) |
| Optimalisering| Startet (VRP) |
| Deploy        | Ikke startet |

---

## Fase 1: Prosjektoppsett

- [x] Web (`apps/web`): React + TypeScript + Vite + Tailwind CSS
- [x] Mobile (`apps/mobile`): Expo + TypeScript + Expo Router
- [x] Backend (`apps/api`): NestJS + TypeScript
- [x] PostgreSQL + PostGIS
- [x] ORM / migrasjoner (f.eks. Prisma)
- [x] Autentisering: `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (web + mobil innlogging mot API)
- [x] Roller: Admin, Dispatcher, Driver (`@Roles` + `RolesGuard` på API)
- [x] Organisasjons-isolasjon (`OrgScopeService`, `GET/PATCH /organizations/me`)
- [x] Web: layout og navigasjon (admin + dispatcher) — sidebar, rollebasert nav
- [x] Mobile: layout og navigasjon (sjåfør, Expo Router) — faner Hjem/Profil, staff → web

---

## Fase 2: Core CRUD + database

### Tabeller

- [x] `organizations`
- [x] `users`
- [x] `drivers`
- [x] `vehicles`
- [x] `deliveries`
- [x] `routes`
- [x] `route_stops`
- [x] `proof_of_delivery`
- [x] `route_events`
- [x] `optimization_jobs`

### Moduler og API

- [x] Organisasjoner — `GET /organizations/me`, `PATCH /organizations/me`
- [x] Brukere — admin kan legge til brukere og roller (`GET/POST/PATCH/DELETE /users`)
- [x] Sjåfører — CRUD (`GET/POST/PATCH/DELETE /drivers`)
- [x] Sjåførstatus: Available, On route, Unavailable, Off duty
- [x] Kjøretøy — CRUD (`GET/POST/PATCH/DELETE /vehicles`)
- [x] Kjøretøy: navn, reg.nr, max vekt/volum, depot-koordinater, status
- [x] Leveringer — CRUD (`GET/POST/PATCH/DELETE /deliveries`)
- [x] Leveringsfelt: kunde, telefon, adresse, lat/lng, vekt, volum, prioritet, deadline, tidsvindu, notater, status
- [x] Leveringsstatuser: Pending, Assigned, In progress, Delivered, Failed, Cancelled

---

## Fase 3: Kart og geokoding

- [x] Geokoding — Kartverket Adresse-API på API + adresseforslag i skjema
- [x] Lagre lesbar adresse + latitude/longitude
- [x] Kartbibliotek (Leaflet eller MapLibre + OpenStreetMap) — Leaflet + OSM på `/map`
- [x] Markører for alle leveringer (+ depot fra kjøretøy)
- [x] Klikk på markør → leveringsdetaljer (popup + sidepanel)

---

## Fase 4: Grunnleggende optimalisering

- [x] Routing-motor for avstand og reisetid — OSRM (`RoutingModule`, `OSRM_BASE_URL`)
- [x] Bygg avstands- og reisetidsmatrise — `POST /routing/matrix`
- [x] Python-tjeneste med Google OR-Tools — `apps/optimizer` (FastAPI + OR-Tools TSP)
- [x] Redis + BullMQ for bakgrunnsjobber — `OptimizationProcessor`, `docker-compose.yml` (redis)
- [x] `POST /optimization/jobs`, `GET /optimization/jobs/:id`
- [x] Lagre genererte ruter og `route_stops` med rekkefølge
- [x] Estimert ankomsttid per stopp (`estimatedArrival` på `route_stops`)

---

## Fase 5: Avansert optimalisering (VRP)

- [x] Fordeling på flere kjøretøy og sjåfører
- [x] Kapasitet: vekt, volum, antall pakker
- [x] Tidsvinduer
- [x] Deadlines
- [x] Prioritet: Low, Normal, High, Critical
- [x] Kun tilgjengelige sjåfører og kjøretøy
- [x] Ruter starter og slutter ved depot
- [x] Ufordelte leveringer og advarsler i respons
- [x] Optimaliseringsmål: min tid, min distanse, balansert arbeidslast, min forsinkelser
- [x] Tester: kapasitet, depot, tidsvinduer, prioritet, ingen dobbeltildeling

---

## Fase 6: Sjåfør-workflow (Expo `apps/mobile`)

- [x] Expo-app: innlogging, dagens rute, neste stopp
- [x] Vis adresse, telefon, notater, estimert ankomst, pakkeinfo
- [x] `POST /routes/:id/assign`, `/start`, `/finish`
- [x] `POST /route-stops/:id/complete`, `/fail`
- [x] Handlinger: start rute, åpne navigasjon (deep link), fullfør rute
- [x] Expo Location + kamera for proof of delivery
- [x] EAS Build / TestFlight / intern testing (`eas.json` + `apps/mobile/README.md`)
- [x] Ruteplanleggingsflyt: opprett leveringer → generer → gjennomgå → tildel → kjør

---

## Fase 7: Dashboard

- [x] `GET /dashboard/summary`
- [x] `GET /dashboard/routes/live`
- [x] `GET /dashboard/deliveries/status`
- [x] Metrikker: totalt, pending, assigned, completed, failed, aktive ruter, forsinkelser
- [x] Advarsler: deadline i fare, over kapasitet, ingen sjåfør, mislykkede leveringer
- [x] Kart: ruter per sjåfør, nummererte stopp, rute-linjer, toggle synlighet

---

## Fase 8: Rapporter, polish og deploy

- [ ] `GET /reports/daily`
- [ ] `GET /reports/driver-performance`
- [ ] `GET /reports/route-efficiency`
- [ ] React Query + Recharts på frontend
- [ ] Feilhåndtering og input-validering
- [ ] Backend-tester (auth, leveringer, kapasitet, optimalisering, API)
- [ ] Web-tester (login, skjema, dashboard, kart)
- [ ] Mobile-tester (login, rutevisning, fullfør/feil stopp)
- [ ] Sikkerhet: RBAC, org-isolasjon, rate limiting, sikker filopplasting
- [ ] Deploy: web (Vercel), mobile (EAS → App Store / Play), API, DB, Redis

---

## MVP (må være ferdig før «Advanced»)

- [x] Brukerautentisering
- [ ] Organisasjons-workspace
- [ ] Roller: admin / dispatcher / driver
- [ ] Sjåfør-CRUD
- [ ] Kjøretøy-CRUD
- [ ] Leverings-CRUD
- [ ] Adresse-geokoding
- [ ] Kart med leveringsmarkører
- [x] Ruteoptimalisering for flere kjøretøy
- [x] Kapasitetsbegrensninger
- [x] Tidsvinduer
- [x] Rute-tildeling til sjåfør
- [x] Sjåfør-rutevisning (Expo mobile app)
- [x] Marker stopp som levert eller feilet
- [x] Dispatcher-dashboard

---

## Etter MVP (Advanced scope)

- [ ] CSV-import av leveringer (`POST /deliveries/import-csv`)
- [ ] Proof of delivery: foto, signatur, GPS, tidsstempel (`POST /route-stops/:id/proof`)
- [ ] Sanntidsoppdateringer (WebSocket, SSE, Supabase Realtime eller polling)
- [ ] Live sjåførposisjon på kart
- [ ] Re-optimalisering i løpet av dagen
- [ ] Kundenotifikasjoner
- [ ] Rapporter og analytics (planlagt vs. faktisk distanse/tid)
- [ ] PDF/CSV-eksport
- [ ] Multi-depot routing
- [ ] Trafikkbevisst routing
- [ ] AI-generert rutesammendrag

---

## Arkitektur (referanse)

Se [README.md §17 Project Architecture](./README.md#17-project-architecture).

### NestJS-moduler

- [x] Auth
- [ ] Users
- [ ] Organizations
- [ ] Drivers
- [ ] Vehicles
- [ ] Deliveries
- [ ] Routes
- [x] Optimization
- [x] Dashboard
- [ ] Reports

---

## Kritisk sti

1. Fase 1 → 2 → 3 → 4 → 5 → 6 → 7 → **MVP ferdig**
2. Deretter Fase 8 og Advanced scope

**Største tekniske risiko:** ruteoptimaliseringsmotoren (OR-Tools + matriser + alle begrensninger).

**Største produktrisiko:** enkel og brukbar workflow for dispatcher og sjåfør.

---

## Brukerhistorier (sjekkliste)

### Dispatcher

- [ ] Opprette leveringer for dagens planlegging
- [ ] Generere optimerte ruter
- [ ] Se forsinkede leveringer
- [ ] Tildele ruter til sjåfører

### Sjåfør

- [ ] Se tildelt rute
- [ ] Markere levering som fullført
- [ ] Rapportere mislykket levering

### Admin

- [ ] Administrere brukere og roller
- [ ] Administrere kjøretøy med riktig kapasitet
