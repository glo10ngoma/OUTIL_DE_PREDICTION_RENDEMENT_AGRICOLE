from fastapi.testclient import TestClient

from app.main import app


def test_yield_prediction() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/v1/predictions/yield",
        json={
            "crop": "maize",
            "province": "Kongo Central",
            "surface_ha": 2,
            "soil_ph": 6.2,
            "organic_matter_percent": 2.4,
            "rainfall_mm": 850,
            "temperature_avg_c": 26,
            "fertilizer_kg_ha": 120,
            "irrigation": False,
            "pest_pressure": "medium",
            "disease_pressure": "low",
            "planting_density_ha": 45000,
            "seed_variety": "Jubilee",
            "previous_yield_t_ha": 3.1,
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["estimated_yield_t_ha"] > 0
    assert payload["estimated_total_tons"] > 0
    assert payload["model_version"] == "baseline-agronomic-v0.1"

