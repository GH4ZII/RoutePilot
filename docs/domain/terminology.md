# Domeneterminologi

RoutePilot bruker et konsistent domenespråk på tvers av database (Prisma), API og klienter. Denne siden er autoritativ for begreper og livssykluser.

## Organisasjon og brukere

| Begrep | Beskrivelse |
|--------|-------------|
| **Organization** | Tenant — alt data tilhører én organisasjon (`organizationId`). |
| **User** | Innloggingskonto med rolle. Kan kobles til en **Driver**-profil. |
| **Slug** | Unik, lesbar identifikator for organisasjon (registrering/innlogging). |

### Roller (`UserRole`)

| Rolle | Typisk bruk |
|-------|-------------|
| `ADMIN` | Full tilgang inkl. sletting og brukeradministrasjon |
| `DISPATCHER` | Planlegging, optimalisering, ruter, rapporter |
| `DRIVER` | Kun egne ruter og stopp (mobil) |

## Logistikk-entiteter

| Begrep | Beskrivelse |
|--------|-------------|
| **Depot** | Fast lokasjon (navn, adresse, koordinater) — knyttes til kjøretøy. |
| **Vehicle** | Kjøretøy med kapasitet (`maxWeightKg`, `maxVolumeM3`), start/slutt-adresse og status. |
| **Driver** | Sjåfør; kan ha `vehicleId`, `activeRouteId`, `DriverLocation`. |
| **Delivery** | En leveringsoppgave til kunde med adresse, vekt, prioritet, tidsvindu/deadline. |

### Leveringsstatus (`DeliveryStatus`)

```
PENDING → ASSIGNED → IN_PROGRESS → DELIVERED
                              ↘ FAILED
                    CANCELLED (fra PENDING/ASSIGNED)
```

- `PENDING` — ikke på rute ennå
- `ASSIGNED` — ligger på en planlagt rute (stopp opprettet)
- `IN_PROGRESS` — ruten er startet
- `DELIVERED` / `FAILED` — avsluttet på stopp-nivå
- `CANCELLED` — avbrutt av dispatcher

### Prioritet (`DeliveryPriority`)

`LOW` · `NORMAL` · `HIGH` · `CRITICAL` — påvirker drop-straff i VRP (høyere prioritet = vanskeligere å droppe).

## Ruteplanlegging

| Begrep | Beskrivelse |
|--------|-------------|
| **Route** | Plan for én bil/sjåfør på en **plannedDate**; har aggregerte km/tid og faktiske mål ved fullføring. |
| **RouteStop** | Ett stopp = én **Delivery** i en gitt **stopOrder** på en rute. |
| **RouteEvent** | Hendelseslogg (`ROUTE_STARTED`, `STOP_COMPLETED`, …). |
| **Proof of Delivery (POD)** | Bevis ved levering: foto, signatur, notat, GPS (`ProofOfDelivery`). |

### Rutestatus (`RouteStatus`)

```
PLANNED → ASSIGNED → IN_PROGRESS → COMPLETED
                              ↘ CANCELLED
```

### Stoppstatus (`RouteStopStatus`)

```
PENDING → IN_PROGRESS → COMPLETED
                    ↘ FAILED
                    ↘ SKIPPED
```

## Optimalisering

| Begrep | Beskrivelse |
|--------|-------------|
| **OptimizationJob** | Asynkron jobb med `request` (JSON) og `result` (JSON) etter VRP. |
| **Objective** | Hva solveren skal optimalisere for (se under). |
| **Unassigned delivery** | Levering solveren ikke kunne plassere (kapasitet, tidsvindu, …). |

### Optimaliseringsmål (`OptimizationObjective`)

| Verdi | Intensjon |
|-------|-----------|
| `MINIMIZE_TOTAL_DISTANCE` | Kortest total kjørelengde |
| `MINIMIZE_TOTAL_TIME` | Kortest total kjøretid |
| `BALANCE_WORKLOAD` | Jevn fordeling mellom kjøretøy |
| `PRIORITIZE_URGENT` | Prioriter HIGH/CRITICAL |
| `MINIMIZE_LATE_DELIVERIES` | Reduser antall sene leveringer |

### Jobbstatus (`OptimizationJobStatus`)

`PENDING` → `RUNNING` → `COMPLETED` | `FAILED`

## Kundenotifikasjoner

| Begrep | Beskrivelse |
|--------|-------------|
| **CustomerNotification** | Utgående SMS/e-post knyttet til en levering. |
| **Channel** | `SMS` eller `EMAIL` |
| **Type** | `ETA`, `DELIVERED`, `FAILED` |
| **Status** | `PENDING`, `SENT`, `FAILED` |

*Merk:* Provider-integrasjon er foreløpig stub (`stub: true` i payload); se [roadmap](../planning/roadmap.md).

## Tekniske begreper (ikke domene, men ofte brukt)

| Begrep | Betydning i RoutePilot |
|--------|------------------------|
| **VRP** | Vehicle Routing Problem — flere kjøretøy, mange leveringer |
| **TSP** | Traveling Salesman — én rute (eldre `/solve`-sti) |
| **Matrise** | N×N avstand (meter) og varighet (sekunder) fra OSRM |
| **Org-scope** | Automatisk `where: { organizationId }` på alle queries |

## Kilden til sannhet

Enums og relasjoner: `apps/api/prisma/schema.prisma`  
Web-typer (speil): `apps/web/src/types/domain.ts`
