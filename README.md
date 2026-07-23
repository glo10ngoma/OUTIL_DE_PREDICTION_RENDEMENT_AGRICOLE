# Outil de prediction de rendement agricole

Backend FastAPI pour collecter les donnees terrain agricoles et exposer une API de prediction de rendement.

## Objectif

Construire une plateforme IA capable de predire le rendement agricole en RD Congo a partir des donnees de terrain :

- localisation et contexte agro-ecologique ;
- culture, variete et calendrier cultural ;
- donnees sol ;
- pratiques agricoles ;
- observations terrain ;
- rendement reel apres recolte.

La V1 fournit une API propre et un moteur de prediction de depart. Le moteur pourra ensuite etre remplace ou enrichi par un modele ML entraine avec les donnees collectees.

## Stack

- FastAPI
- Python
- Pydantic
- PostgreSQL/Supabase
- SQLAlchemy
- React/Vite pour le frontend local
- scikit-learn, XGBoost ou LightGBM plus tard

## Demarrage local

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.db.init_db
uvicorn app.main:app --reload
```

Sur Windows PowerShell, si l'activation `.venv\Scripts\Activate.ps1` est bloquee,
utiliser directement le Python du venv :

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Les dependances ML lourdes sont separees dans `requirements-ml.txt`. Elles ne
sont pas necessaires pour demarrer l'API V1 :

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-ml.txt
```

API :

- Documentation Swagger : `http://127.0.0.1:8000/docs`
- Health check : `GET /api/v1/health`
- Health check DB : `GET /api/v1/health/db`
- Prediction : `POST /api/v1/predictions/yield`
- Observations terrain : `POST /api/v1/field-observations`

## Frontend local

Lancer d'abord le backend sur `http://127.0.0.1:8000`, puis demarrer
l'interface web :

```bash
cd frontend
npm install
npm run dev
```

Interface :

- Application frontend : `http://127.0.0.1:5173`
- URL API par defaut : `http://127.0.0.1:8000/api/v1`

Pour changer l'URL API, creer `frontend/.env.local` :

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Base de donnees

Par defaut, l'API utilise SQLite localement via `sqlite:///./agri_prediction.db`.
Pour Supabase/PostgreSQL, renseigner `DATABASE_URL` dans `.env`.

Le script SQL initial est disponible ici :

```bash
database/001_field_observations.sql
```

Appliquer la migration sur la base configuree dans `.env` :

```bash
python scripts/apply_migration.py
```

Verifier la connexion DB et la presence de la table terrain :

```bash
curl http://127.0.0.1:8000/api/v1/health/db
```

## Exemple observation terrain

```json
{
  "observation_code": "OBS-2026-0001",
  "observation_date": "2026-08-15",
  "agent_name": "Agent Demo",
  "province": "Province Demo",
  "territory": "Territoire Demo",
  "village": "Village Demo",
  "latitude": -4.123,
  "longitude": 15.456,
  "altitude_m": 210,
  "farm_name": "Ferme Demo",
  "plot_code": "PLOT-DEMO-001",
  "surface_ha": 2,
  "slope_percent": 3.5,
  "drainage": "good",
  "previous_crop": "cassava",
  "crop": "maize",
  "seed_variety": "locale amelioree",
  "planting_date": "2026-09-01",
  "planting_density_ha": 45000,
  "expected_harvest_date": "2026-12-15",
  "soil_texture": "loamy",
  "soil_ph": 6.2,
  "organic_matter_percent": 2.4,
  "nitrogen_mg_kg": 35,
  "phosphorus_mg_kg": 18,
  "potassium_mg_kg": 120,
  "soil_moisture_percent": 21,
  "rainfall_mm": 850,
  "temperature_avg_c": 26,
  "fertilizer_kg_ha": 120,
  "irrigation": false,
  "pest_pressure": "medium",
  "disease_pressure": "low",
  "notes": "Observation initiale avant recolte."
}
```

## Exemple de prediction

```json
{
  "crop": "maize",
  "province": "Kongo Central",
  "surface_ha": 2,
  "soil_ph": 6.2,
  "organic_matter_percent": 2.4,
  "rainfall_mm": 850,
  "temperature_avg_c": 26,
  "fertilizer_kg_ha": 120,
  "irrigation": false,
  "pest_pressure": "medium",
  "disease_pressure": "low",
  "planting_density_ha": 45000,
  "seed_variety": "Jubilee",
  "previous_yield_t_ha": 3.1
}
```