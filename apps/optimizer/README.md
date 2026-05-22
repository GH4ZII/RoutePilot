# RoutePilot Optimizer

Python-tjeneste som kjører **Google OR-Tools** for å finne beste rekkefølge på leveringsstopp (én bil, TSP).

## Start lokalt (Windows PowerShell)

Bruk **Windows Python** (`py -3.12`), ikke WSL — ellers får du `bin/` i stedet for `Scripts/` og `pip` finnes ikke.

```powershell
cd apps/optimizer
Remove-Item -Recurse -Force .venv -ErrorAction SilentlyContinue
py -3.12 -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Eller fra repo-roten: `npm run dev:optimizer`

API-et kaller `POST http://127.0.0.1:8000/solve` med varighetsmatrise fra OSRM.
