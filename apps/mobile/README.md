# RoutePilot Mobile (Expo)

Sjåfør-app for dagens rute, stopp og leveringsbevis.

## Utvikling

```bash
cd apps/mobile
npm install
npm start
```

Sett API-URL i `.env`:

```env
EXPO_PUBLIC_API_URL=http://<din-pc-ip>:3000
```

## Sjåfør-flyt

1. Administrator eller planlegger oppretter sjåfør i **web** (Sjåfører) med e-post og passord.
2. Sjåfør logger inn i mobilappen med **organisasjon (slug)**, **e-post** og **passord** — ingen selvregistrering.
2. **Hjem** henter `GET /routes/me/today`.
3. **Start rute** → `POST /routes/:id/start`.
4. **Navigasjon** åpner **Apple Maps** (iOS) eller **Google Maps** (Android) med hele ruten: depot → alle stopp → depot.
5. **Levert** / **Kunne ikke levere** → `POST /route-stops/:id/complete|fail`.
6. **Leveringsbevis** (foto + GPS) → `POST /route-stops/:id/proof`.
7. **Fullfør rute** når alle stopp er behandlet.

## Tester

```bash
npm test
```

## EAS Build (TestFlight / intern testing)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

For TestFlight: `eas submit --platform ios` etter production-build.
