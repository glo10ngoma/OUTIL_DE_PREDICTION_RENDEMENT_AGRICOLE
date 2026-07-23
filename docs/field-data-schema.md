# Schema de collecte terrain V1

Ce schema sert de base pour les fiches de prelevement terrain en RD Congo.

## Identification

| Champ | Type | Obligatoire | Exemple |
|---|---:|---:|---|
| observation_id | texte | oui | OBS-2026-0001 |
| date_observation | date | oui | 2026-08-15 |
| agent_name | texte | oui | Agent Demo |
| province | texte | oui | Province Demo |
| territory | texte | non | Territoire Demo |
| village | texte | non | Village Demo |
| latitude | decimal | oui | -4.123 |
| longitude | decimal | oui | 15.456 |
| altitude_m | decimal | non | 210 |

## Parcelle

| Champ | Type | Obligatoire | Exemple |
|---|---:|---:|---|
| farm_name | texte | non | Ferme Demo |
| plot_code | texte | oui | PLOT-DEMO-001 |
| surface_ha | decimal | oui | 2.0 |
| slope_percent | decimal | non | 3.5 |
| drainage | categorie | non | bon / moyen / mauvais |
| previous_crop | texte | non | manioc |

## Culture

| Champ | Type | Obligatoire | Exemple |
|---|---:|---:|---|
| crop | texte | oui | maize |
| seed_variety | texte | non | locale amelioree |
| planting_date | date | oui | 2026-09-01 |
| planting_density_ha | decimal | non | 45000 |
| expected_harvest_date | date | non | 2026-12-15 |

## Sol

| Champ | Type | Obligatoire | Exemple |
|---|---:|---:|---|
| soil_texture | categorie | non | argileux / sableux / limoneux |
| soil_ph | decimal | non | 6.2 |
| organic_matter_percent | decimal | non | 2.4 |
| nitrogen_mg_kg | decimal | non | 35 |
| phosphorus_mg_kg | decimal | non | 18 |
| potassium_mg_kg | decimal | non | 120 |
| soil_moisture_percent | decimal | non | 21 |

## Climat et pratiques

| Champ | Type | Obligatoire | Exemple |
|---|---:|---:|---|
| rainfall_mm | decimal | non | 850 |
| temperature_avg_c | decimal | non | 26 |
| fertilizer_kg_ha | decimal | non | 120 |
| irrigation | booleen | oui | false |
| pest_pressure | categorie | oui | low / medium / high |
| disease_pressure | categorie | oui | low / medium / high |

## Resultat reel

| Champ | Type | Obligatoire | Exemple |
|---|---:|---:|---|
| harvest_date | date | non | 2026-12-20 |
| actual_yield_t_ha | decimal | oui apres recolte | 3.1 |
| actual_total_tons | decimal | non | 6.2 |
| loss_percent | decimal | non | 4 |
| notes | texte | non | Stress hydrique observe en floraison |

## Endpoints API V1

| Action | Methode | Endpoint |
|---|---:|---|
| Creer une observation terrain | POST | `/api/v1/field-observations` |
| Lister les observations | GET | `/api/v1/field-observations` |
| Filtrer par culture | GET | `/api/v1/field-observations?crop=maize` |
| Filtrer par province | GET | `/api/v1/field-observations?province=Province%20Demo` |
| Lire une observation | GET | `/api/v1/field-observations/{id}` |
| Ajouter le rendement reel apres recolte | PATCH | `/api/v1/field-observations/{id}/yield-result` |
