# RoutePilot Optimizer

Python-tjeneste med **Google OR-Tools**:

- `POST /solve` — én bil (TSP, fase 4)
- `POST /solve-vrp` — flere kjøretøy med kapasitet, tidsvinduer, deadlines og prioritet (fase 5)

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

## Tester

```powershell
cd apps/optimizer
.\.venv\Scripts\python -m pytest tests/ -v
```

API-et kaller `POST /solve-vrp` med matriser fra OSRM.
