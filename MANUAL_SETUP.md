# Manuelle oppsettsteg (Advanced scope)

Dette dokumentet beskriver hva du må gjøre **utenfor kodebasen** for at alle Advanced-funksjoner skal fungere optimalt.

## 1. Database-migrasjon

Etter `git pull`:

```powershell
cd apps\api
npx prisma migrate deploy
npx prisma generate
```

## 2. Redis og optimizer (re-optimalisering)

Re-optimalisering og VRP-jobs krever Redis og Python-optimizeren:

```powershell
# Fra repo-roten
docker compose up -d redis
npm run dev:optimizer
```

Se [README.md](./README.md) for full oppsett.

## 3. Nye npm-avhengigheter (API)

Fra `apps/api` etter pull:

```powershell
cd apps\api
npm install
```

Pakker som brukes i Advanced scope: `csv-parse`, `pdfkit`, `@types/pdfkit`, `@types/multer`.

## 4. Mapbox — trafikkbevisst routing (valgfritt)

1. Opprett konto på [mapbox.com](https://www.mapbox.com/)
2. Opprett access token med `Directions` og `Matrix` scope
3. Legg til i `apps/api/.env`:

```env
TRAFFIC_PROVIDER=mapbox
MAPBOX_ACCESS_TOKEN=pk.eyJ...
```

Uten dette brukes OSRM (statisk kjøretid, ingen live trafikk).

## 5. OpenAI — AI-rutesammendrag (valgfritt)

1. Opprett API-nøkkel på [platform.openai.com](https://platform.openai.com/)
2. Legg til i `apps/api/.env`:

```env
OPENAI_API_KEY=sk-...
```

Uten nøkkel genereres et deterministisk norsk sammendrag fra rutedata (ingen ekstern kostnad).

## 6. Mobil — GPS og signatur

### iOS (`apps/mobile/app.json`)

Sjekk at disse finnes under `expo.ios.infoPlist`:

- `NSLocationWhenInUseUsageDescription`
- `NSLocationAlwaysAndWhenInUseUsageDescription` (hvis bakgrunns-GPS)

### Android

- `ACCESS_FINE_LOCATION` og `ACCESS_COARSE_LOCATION` i `app.json`
- Test på **fysisk enhet** — emulator har upålitelig GPS

### Bakgrunnslokasjon

Expo `expo-location` med `Location.startLocationUpdatesAsync` krever at appen har aktiv rute (`IN_PROGRESS`). For produksjon på Android kan du trenge foreground service — se [Expo Location docs](https://docs.expo.dev/versions/latest/sdk/location/).

## 7. Produksjon — SSE (sanntidsoppdateringer)

Reverse proxy må **ikke** bufre Server-Sent Events.

**Nginx:**

```nginx
location /events/ {
  proxy_pass http://api:3000;
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 86400s;
}
```

**CORS:** `WEB_ORIGIN` i API må matche web-appens URL.

## 8. Kundenotifikasjoner (fremtidig)

Nåværende implementasjon er **stub**: varsler logges i `customer_notifications` med `status: SENT` og `payload.stub: true`.

For ekte SMS/e-post senere, legg til (eksempel):

```env
# Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# SendGrid (e-post)
SENDGRID_API_KEY=
NOTIFICATION_FROM_EMAIL=
```

Implementer `SmsNotificationProvider` / `EmailNotificationProvider` i `apps/api/src/notifications/providers/` uten å endre call-sites.

## 9. Supabase Storage for POD-bilder (valgfritt fremtid)

POD lagres som data-URI i PostgreSQL (maks ~500 KB foto). For produksjon med mange bilder:

1. Opprett bucket `proof-of-delivery` i Supabase Storage
2. Konfigurer RLS
3. Utvid `ProofOfDeliveryService` til å laste opp og lagre URL i stedet for base64

Ikke påkrevd for lokal utvikling.

## 10. Web — SSE token

Web-appen kobler til `GET /events/stream?token=<JWT>`. Sørg for at `VITE_API_URL` peker på API (f.eks. `http://localhost:3000`).

## Sjekkliste etter deploy

- [ ] `prisma migrate deploy` kjørt
- [ ] Redis + optimizer kjører (hvis re-opt brukes)
- [ ] `WEB_ORIGIN` og `VITE_API_URL` er riktige
- [ ] SSE fungerer i dashboard (nettverksfane: `text/event-stream`)
- [ ] Mobil sender posisjon når rute er startet
- [ ] (Valgfritt) Mapbox token for trafikk
- [ ] (Valgfritt) OpenAI for AI-sammendrag
