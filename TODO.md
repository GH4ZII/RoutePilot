# RoutePilot — To-do liste

Basert på [README.md](./README.md). Repoet er foreløpig greenfield (kun README).

**Sist oppdatert:** 2026-05-22

---

## Status

| Område        | Status      |
|---------------|-------------|
| Web           | Startet |
| Mobile (Expo) | Ikke startet |
| Backend       | Ikke startet |
| Database      | Ikke startet |
| Optimalisering| Ikke startet |
| Deploy        | Ikke startet |

---

## Fase 1: Prosjektoppsett

- [x] Web (`apps/web`): React + TypeScript + Vite + Tailwind CSS
- [x] Mobile (`apps/mobile`): Expo + TypeScript + Expo Router
- [x] Backend (`apps/api`): NestJS + TypeScript
- [x] PostgreSQL + PostGIS
- [x] ORM / migrasjoner (f.eks. Prisma)
- [ ] Autentisering: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- [ ] Roller: Admin, Dispatcher, Driver
- [ ] Organisasjons-isolasjon (brukere ser kun egen org)
- [ ] Web: layout og navigasjon (admin + dispatcher)
- [ ] Mobile: layout og navigasjon (sjåfør, Expo Router)

---

## Fase 2: Core CRUD + database

### Tabeller

- [ ] `organizations`
- [ ] `users`
- [ ] `drivers`
- [ ] `vehicles`
- [ ] `deliveries`
- [ ] `routes`
- [ ] `route_stops`
- [ ] `proof_of_delivery`
- [ ] `route_events`
- [ ] `optimization_jobs`

### Moduler og API

- [ ] Organisasjoner — `GET /organizations/me`, `PATCH /organizations/me`
- [ ] Brukere — admin kan legge til brukere og roller
- [ ] Sjåfører — CRUD (`GET/POST/PATCH/DELETE /drivers`)
- [ ] Sjåførstatus: Available, On route, Unavailable, Off duty
- [ ] Kjøretøy — CRUD (`GET/POST/PATCH/DELETE /vehicles`)
- [ ] Kjøretøy: navn, reg.nr, max vekt/volum, depot-koordinater, status
- [ ] Leveringer — CRUD (`GET/POST/PATCH/DELETE /deliveries`)
- [ ] Leveringsfelt: kunde, telefon, adresse, lat/lng, vekt, volum, prioritet, deadline, tidsvindu, notater, status
- [ ] Leveringsstatuser: Pending, Assigned, In progress, Delivered, Failed, Cancelled

---

## Fase 3: Kart og geokoding

- [ ] Geokoding (Nominatim, Mapbox eller Google)
- [ ] Lagre lesbar adresse + latitude/longitude
- [ ] Kartbibliotek (Leaflet eller MapLibre + OpenStreetMap)
- [ ] Markører for alle leveringer
- [ ] Klikk på markør → leveringsdetaljer

---

## Fase 4: Grunnleggende optimalisering

- [ ] Routing-motor for avstand og reisetid (OSRM, OpenRouteService, GraphHopper eller Google)
- [ ] Bygg avstands- og reisetidsmatrise
- [ ] Python-tjeneste med Google OR-Tools (FastAPI eller worker)
- [ ] Redis + BullMQ for bakgrunnsjobber
- [ ] `POST /optimization/jobs`, `GET /optimization/jobs/:id`
- [ ] Lagre genererte ruter og `route_stops` med rekkefølge
- [ ] Estimert ankomsttid per stopp

---

## Fase 5: Avansert optimalisering (VRP)

- [ ] Fordeling på flere kjøretøy og sjåfører
- [ ] Kapasitet: vekt, volum, antall pakker
- [ ] Tidsvinduer
- [ ] Deadlines
- [ ] Prioritet: Low, Normal, High, Critical
- [ ] Kun tilgjengelige sjåfører og kjøretøy
- [ ] Ruter starter og slutter ved depot
- [ ] Ufordelte leveringer og advarsler i respons
- [ ] Optimaliseringsmål: min tid, min distanse, balansert arbeidslast, min forsinkelser
- [ ] Tester: kapasitet, depot, tidsvinduer, prioritet, ingen dobbeltildeling

---

## Fase 6: Sjåfør-workflow (Expo `apps/mobile`)

- [ ] Expo-app: innlogging, dagens rute, neste stopp
- [ ] Vis adresse, telefon, notater, estimert ankomst, pakkeinfo
- [ ] `POST /routes/:id/assign`, `/start`, `/finish`
- [ ] `POST /route-stops/:id/complete`, `/fail`
- [ ] Handlinger: start rute, åpne navigasjon (deep link), fullfør rute
- [ ] Expo Location + kamera for proof of delivery
- [ ] EAS Build / TestFlight / intern testing
- [ ] Ruteplanleggingsflyt: opprett leveringer → generer → gjennomgå → tildel → kjør

---

## Fase 7: Dashboard

- [ ] `GET /dashboard/summary`
- [ ] `GET /dashboard/routes/live`
- [ ] `GET /dashboard/deliveries/status`
- [ ] Metrikker: totalt, pending, assigned, completed, failed, aktive ruter, forsinkelser
- [ ] Advarsler: deadline i fare, over kapasitet, ingen sjåfør, mislykkede leveringer
- [ ] Kart: ruter per sjåfør, nummererte stopp, rute-linjer, toggle synlighet

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

- [ ] Brukerautentisering
- [ ] Organisasjons-workspace
- [ ] Roller: admin / dispatcher / driver
- [ ] Sjåfør-CRUD
- [ ] Kjøretøy-CRUD
- [ ] Leverings-CRUD
- [ ] Adresse-geokoding
- [ ] Kart med leveringsmarkører
- [ ] Ruteoptimalisering for flere kjøretøy
- [ ] Kapasitetsbegrensninger
- [ ] Tidsvinduer
- [ ] Rute-tildeling til sjåfør
- [ ] Sjåfør-rutevisning (Expo mobile app)
- [ ] Marker stopp som levert eller feilet
- [ ] Dispatcher-dashboard

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

- [ ] Auth
- [ ] Users
- [ ] Organizations
- [ ] Drivers
- [ ] Vehicles
- [ ] Deliveries
- [ ] Routes
- [ ] Optimization
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
