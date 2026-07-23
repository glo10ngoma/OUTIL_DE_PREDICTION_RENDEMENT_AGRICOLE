from app.schemas.prediction import PressureLevel, YieldPredictionRequest, YieldPredictionResponse


class YieldPredictor:
    """Baseline predictor to be replaced by a trained ML model when data is ready."""

    model_version = "baseline-agronomic-v0.1"

    crop_baselines_t_ha = {
        "maize": 2.5,
        "cassava": 12.0,
        "rice": 3.0,
        "watermelon": 18.0,
        "palm": 10.0,
        "rubber": 1.2,
    }

    def predict(self, payload: YieldPredictionRequest) -> YieldPredictionResponse:
        crop_key = payload.crop.strip().lower()
        baseline = self.crop_baselines_t_ha.get(crop_key, 3.0)
        score = baseline
        factors: list[str] = []

        if payload.previous_yield_t_ha:
            score = (score * 0.6) + (payload.previous_yield_t_ha * 0.4)
            factors.append("historique de rendement disponible")

        if payload.soil_ph is not None:
            if 5.5 <= payload.soil_ph <= 7.2:
                score *= 1.08
                factors.append("pH du sol favorable")
            else:
                score *= 0.88
                factors.append("pH du sol potentiellement limitant")

        if payload.organic_matter_percent is not None:
            if payload.organic_matter_percent >= 2.0:
                score *= 1.06
                factors.append("matiere organique correcte")
            else:
                score *= 0.9
                factors.append("matiere organique faible")

        if payload.rainfall_mm is not None:
            if 700 <= payload.rainfall_mm <= 1400:
                score *= 1.07
                factors.append("pluviometrie favorable")
            elif payload.rainfall_mm < 500:
                score *= 0.78
                factors.append("risque de deficit hydrique")
            else:
                score *= 0.94
                factors.append("pluviometrie a surveiller")

        if payload.fertilizer_kg_ha is not None:
            if payload.fertilizer_kg_ha >= 80:
                score *= 1.08
                factors.append("fertilisation significative")
            elif payload.fertilizer_kg_ha < 30:
                score *= 0.92
                factors.append("fertilisation faible")

        if payload.irrigation:
            score *= 1.05
            factors.append("irrigation disponible")

        risk_penalty = self._pressure_penalty(payload.pest_pressure) * self._pressure_penalty(
            payload.disease_pressure
        )
        score *= risk_penalty

        if payload.pest_pressure != PressureLevel.low:
            factors.append(f"pression ravageurs {payload.pest_pressure.value}")
        if payload.disease_pressure != PressureLevel.low:
            factors.append(f"pression maladies {payload.disease_pressure.value}")

        estimated_yield = round(max(score, 0.1), 2)
        total = round(estimated_yield * payload.surface_ha, 2)
        risk_level = self._risk_level(payload)

        return YieldPredictionResponse(
            crop=payload.crop,
            province=payload.province,
            estimated_yield_t_ha=estimated_yield,
            estimated_total_tons=total,
            confidence_score=self._confidence_score(payload),
            risk_level=risk_level,
            main_factors=factors[:6] or ["donnees terrain insuffisantes pour expliquer finement la prediction"],
            recommendation=self._recommendation(risk_level),
            model_version=self.model_version,
        )

    def _pressure_penalty(self, pressure: PressureLevel) -> float:
        penalties = {
            PressureLevel.low: 1.0,
            PressureLevel.medium: 0.88,
            PressureLevel.high: 0.7,
        }
        return penalties[pressure]

    def _risk_level(self, payload: YieldPredictionRequest) -> str:
        risk_points = 0
        if payload.pest_pressure == PressureLevel.medium:
            risk_points += 1
        elif payload.pest_pressure == PressureLevel.high:
            risk_points += 2

        if payload.disease_pressure == PressureLevel.medium:
            risk_points += 1
        elif payload.disease_pressure == PressureLevel.high:
            risk_points += 2

        if payload.rainfall_mm is not None and payload.rainfall_mm < 500:
            risk_points += 2
        if payload.soil_ph is not None and not 5.5 <= payload.soil_ph <= 7.2:
            risk_points += 1

        if risk_points >= 4:
            return "high"
        if risk_points >= 2:
            return "medium"
        return "low"

    def _confidence_score(self, payload: YieldPredictionRequest) -> float:
        available_fields = sum(
            value is not None
            for value in [
                payload.soil_ph,
                payload.organic_matter_percent,
                payload.rainfall_mm,
                payload.temperature_avg_c,
                payload.fertilizer_kg_ha,
                payload.planting_density_ha,
                payload.previous_yield_t_ha,
            ]
        )
        return round(min(0.35 + available_fields * 0.07, 0.85), 2)

    def _recommendation(self, risk_level: str) -> str:
        if risk_level == "high":
            return "Prioriser une visite terrain, verifier le stress hydrique, les maladies et les ravageurs avant de confirmer la prevision."
        if risk_level == "medium":
            return "Surveiller les facteurs limitants identifies et completer les donnees sol/meteo pour ameliorer la precision."
        return "Conditions globalement favorables selon les donnees fournies. Continuer la collecte pour renforcer le futur modele IA."

