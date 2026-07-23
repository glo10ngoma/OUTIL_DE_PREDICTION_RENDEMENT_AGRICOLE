import React from "react";
import ReactDOM from "react-dom/client";
import { AlertTriangle, BarChart3, CheckCircle2, Database, Leaf, Loader2, Plus, RefreshCw, Sprout } from "lucide-react";
import "./styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

type PressureLevel = "low" | "medium" | "high";
type DrainageLevel = "good" | "medium" | "poor";
type SoilTexture = "clay" | "sandy" | "loamy" | "silty" | "mixed";

type FieldObservationForm = {
  observation_code: string;
  observation_date: string;
  agent_name: string;
  province: string;
  territory: string;
  village: string;
  latitude: number;
  longitude: number;
  altitude_m: number | "";
  farm_name: string;
  plot_code: string;
  surface_ha: number;
  slope_percent: number | "";
  drainage: DrainageLevel;
  previous_crop: string;
  crop: string;
  seed_variety: string;
  planting_date: string;
  planting_density_ha: number | "";
  expected_harvest_date: string;
  soil_texture: SoilTexture;
  soil_ph: number | "";
  organic_matter_percent: number | "";
  nitrogen_mg_kg: number | "";
  phosphorus_mg_kg: number | "";
  potassium_mg_kg: number | "";
  soil_moisture_percent: number | "";
  rainfall_mm: number | "";
  temperature_avg_c: number | "";
  fertilizer_kg_ha: number | "";
  irrigation: boolean;
  pest_pressure: PressureLevel;
  disease_pressure: PressureLevel;
  notes: string;
};

type FieldObservation = FieldObservationForm & {
  id: number;
  harvest_date: string | null;
  actual_yield_t_ha: number | null;
  actual_total_tons: number | null;
  loss_percent: number | null;
  created_at: string;
  updated_at: string;
};

type YieldPrediction = {
  crop: string;
  province: string;
  estimated_yield_t_ha: number;
  estimated_total_tons: number;
  confidence_score: number;
  risk_level: string;
  main_factors: string[];
  recommendation: string;
  model_version: string;
};

const today = new Date().toISOString().slice(0, 10);

const initialForm: FieldObservationForm = {
  observation_code: `OBS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
  observation_date: today,
  agent_name: "Agent Demo",
  province: "Province Demo",
  territory: "Territoire Demo",
  village: "Village Demo",
  latitude: -4.123,
  longitude: 15.456,
  altitude_m: 120,
  farm_name: "Ferme Demo",
  plot_code: "PLOT-DEMO-001",
  surface_ha: 1,
  slope_percent: 3,
  drainage: "good",
  previous_crop: "manioc",
  crop: "maize",
  seed_variety: "locale amelioree",
  planting_date: today,
  planting_density_ha: 50000,
  expected_harvest_date: today,
  soil_texture: "loamy",
  soil_ph: 6.2,
  organic_matter_percent: 3,
  nitrogen_mg_kg: 25,
  phosphorus_mg_kg: 15,
  potassium_mg_kg: 120,
  soil_moisture_percent: 45,
  rainfall_mm: 850,
  temperature_avg_c: 27,
  fertilizer_kg_ha: 100,
  irrigation: false,
  pest_pressure: "low",
  disease_pressure: "low",
  notes: "Observation terrain test",
};

function cleanPayload(form: FieldObservationForm) {
  return Object.fromEntries(
    Object.entries(form).filter(([, value]) => value !== "" && value !== null && value !== undefined),
  );
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? `Erreur API ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function App() {
  const [form, setForm] = React.useState<FieldObservationForm>(initialForm);
  const [observations, setObservations] = React.useState<FieldObservation[]>([]);
  const [selected, setSelected] = React.useState<FieldObservation | null>(null);
  const [prediction, setPrediction] = React.useState<YieldPrediction | null>(null);
  const [apiStatus, setApiStatus] = React.useState<"checking" | "ok" | "error">("checking");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const loadObservations = React.useCallback(async () => {
    const data = await apiRequest<FieldObservation[]>("/field-observations?limit=20");
    setObservations(data);
    setSelected((current) => current ?? data[0] ?? null);
  }, []);

  React.useEffect(() => {
    apiRequest<{ status: string }>("/health")
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("error"));
    loadObservations().catch(() => undefined);
  }, [loadObservations]);

  function updateField<K extends keyof FieldObservationForm>(key: K, value: FieldObservationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function createObservation(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const created = await apiRequest<FieldObservation>("/field-observations", {
        method: "POST",
        body: JSON.stringify(cleanPayload(form)),
      });
      setSelected(created);
      setPrediction(null);
      await loadObservations();
      setMessage(`Observation ${created.observation_code} enregistree.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Creation impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function predictFromObservation(observation = selected) {
    if (!observation) {
      setMessage("Cree ou selectionne une observation avant de lancer la prediction.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const result = await apiRequest<YieldPrediction>("/predictions/yield", {
        method: "POST",
        body: JSON.stringify({
          crop: observation.crop,
          province: observation.province,
          surface_ha: observation.surface_ha,
          soil_ph: observation.soil_ph,
          organic_matter_percent: observation.organic_matter_percent,
          rainfall_mm: observation.rainfall_mm,
          temperature_avg_c: observation.temperature_avg_c,
          fertilizer_kg_ha: observation.fertilizer_kg_ha,
          irrigation: observation.irrigation,
          pest_pressure: observation.pest_pressure,
          disease_pressure: observation.disease_pressure,
          planting_density_ha: observation.planting_density_ha,
          seed_variety: observation.seed_variety,
          previous_yield_t_ha: observation.actual_yield_t_ha,
        }),
      });
      setPrediction(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Prediction impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <div>
          <p className="eyebrow">RD Congo · Agriculture intelligente</p>
          <h1>Prediction de rendement agricole</h1>
        </div>
        <div className={`status ${apiStatus}`}>
          {apiStatus === "checking" && <Loader2 size={16} className="spin" />}
          {apiStatus === "ok" && <CheckCircle2 size={16} />}
          {apiStatus === "error" && <AlertTriangle size={16} />}
          API {apiStatus === "ok" ? "connectee" : apiStatus === "error" ? "indisponible" : "verification"}
        </div>
      </header>

      <section className="summary-grid">
        <Metric icon={<Database size={20} />} label="Observations" value={observations.length.toString()} />
        <Metric icon={<Sprout size={20} />} label="Culture active" value={selected?.crop ?? form.crop} />
        <Metric icon={<BarChart3 size={20} />} label="Rendement estime" value={prediction ? `${prediction.estimated_yield_t_ha} t/ha` : "-"} />
      </section>

      {message && <div className="message">{message}</div>}

      <div className="workspace">
        <form className="panel form-panel" onSubmit={createObservation}>
          <div className="panel-title">
            <Leaf size={20} />
            <h2>Nouvelle observation terrain</h2>
          </div>

          <div className="section-title">Identification</div>
          <div className="grid two">
            <TextInput label="Code observation" value={form.observation_code} onChange={(value) => updateField("observation_code", value)} />
            <TextInput label="Date observation" type="date" value={form.observation_date} onChange={(value) => updateField("observation_date", value)} />
            <TextInput label="Agent" value={form.agent_name} onChange={(value) => updateField("agent_name", value)} />
            <TextInput label="Province" value={form.province} onChange={(value) => updateField("province", value)} />
            <TextInput label="Territoire" value={form.territory} onChange={(value) => updateField("territory", value)} />
            <TextInput label="Village" value={form.village} onChange={(value) => updateField("village", value)} />
          </div>

          <div className="section-title">Parcelle</div>
          <div className="grid three">
            <NumberInput label="Latitude" value={form.latitude} onChange={(value) => updateField("latitude", value === "" ? 0 : value)} />
            <NumberInput label="Longitude" value={form.longitude} onChange={(value) => updateField("longitude", value === "" ? 0 : value)} />
            <NumberInput label="Altitude m" value={form.altitude_m} onChange={(value) => updateField("altitude_m", value)} />
            <TextInput label="Ferme" value={form.farm_name} onChange={(value) => updateField("farm_name", value)} />
            <TextInput label="Code parcelle" value={form.plot_code} onChange={(value) => updateField("plot_code", value)} />
            <NumberInput label="Surface ha" value={form.surface_ha} onChange={(value) => updateField("surface_ha", value === "" ? 1 : value)} />
            <NumberInput label="Pente %" value={form.slope_percent} onChange={(value) => updateField("slope_percent", value)} />
            <SelectInput label="Drainage" value={form.drainage} options={["good", "medium", "poor"]} onChange={(value) => updateField("drainage", value as DrainageLevel)} />
            <TextInput label="Culture precedente" value={form.previous_crop} onChange={(value) => updateField("previous_crop", value)} />
          </div>

          <div className="section-title">Culture et sol</div>
          <div className="grid three">
            <TextInput label="Culture" value={form.crop} onChange={(value) => updateField("crop", value)} />
            <TextInput label="Variete" value={form.seed_variety} onChange={(value) => updateField("seed_variety", value)} />
            <TextInput label="Date semis" type="date" value={form.planting_date} onChange={(value) => updateField("planting_date", value)} />
            <NumberInput label="Densite / ha" value={form.planting_density_ha} onChange={(value) => updateField("planting_density_ha", value)} />
            <TextInput label="Recolte prevue" type="date" value={form.expected_harvest_date} onChange={(value) => updateField("expected_harvest_date", value)} />
            <SelectInput label="Texture sol" value={form.soil_texture} options={["clay", "sandy", "loamy", "silty", "mixed"]} onChange={(value) => updateField("soil_texture", value as SoilTexture)} />
            <NumberInput label="pH sol" value={form.soil_ph} onChange={(value) => updateField("soil_ph", value)} />
            <NumberInput label="Matiere organique %" value={form.organic_matter_percent} onChange={(value) => updateField("organic_matter_percent", value)} />
            <NumberInput label="Humidite sol %" value={form.soil_moisture_percent} onChange={(value) => updateField("soil_moisture_percent", value)} />
            <NumberInput label="Azote mg/kg" value={form.nitrogen_mg_kg} onChange={(value) => updateField("nitrogen_mg_kg", value)} />
            <NumberInput label="Phosphore mg/kg" value={form.phosphorus_mg_kg} onChange={(value) => updateField("phosphorus_mg_kg", value)} />
            <NumberInput label="Potassium mg/kg" value={form.potassium_mg_kg} onChange={(value) => updateField("potassium_mg_kg", value)} />
          </div>

          <div className="section-title">Climat et risques</div>
          <div className="grid three">
            <NumberInput label="Pluie mm" value={form.rainfall_mm} onChange={(value) => updateField("rainfall_mm", value)} />
            <NumberInput label="Temperature C" value={form.temperature_avg_c} onChange={(value) => updateField("temperature_avg_c", value)} />
            <NumberInput label="Engrais kg/ha" value={form.fertilizer_kg_ha} onChange={(value) => updateField("fertilizer_kg_ha", value)} />
            <SelectInput label="Ravageurs" value={form.pest_pressure} options={["low", "medium", "high"]} onChange={(value) => updateField("pest_pressure", value as PressureLevel)} />
            <SelectInput label="Maladies" value={form.disease_pressure} options={["low", "medium", "high"]} onChange={(value) => updateField("disease_pressure", value as PressureLevel)} />
            <label className="check-row">
              <input type="checkbox" checked={form.irrigation} onChange={(event) => updateField("irrigation", event.target.checked)} />
              Irrigation disponible
            </label>
          </div>

          <label className="field full">
            <span>Notes</span>
            <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} />
          </label>

          <button className="primary" type="submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
            Enregistrer observation
          </button>
        </form>

        <aside className="side">
          <section className="panel">
            <div className="panel-title row-between">
              <h2>Observations recentes</h2>
              <button className="ghost" type="button" onClick={() => loadObservations()} title="Actualiser">
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="list">
              {observations.length === 0 && <p className="empty">Aucune observation pour le moment.</p>}
              {observations.map((observation) => (
                <button
                  key={observation.id}
                  className={`list-item ${selected?.id === observation.id ? "active" : ""}`}
                  type="button"
                  onClick={() => {
                    setSelected(observation);
                    setPrediction(null);
                  }}
                >
                  <strong>{observation.observation_code}</strong>
                  <span>{observation.crop} · {observation.province}</span>
                  <small>{observation.surface_ha} ha · {observation.observation_date}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">
              <BarChart3 size={20} />
              <h2>Prediction</h2>
            </div>
            {selected ? (
              <>
                <div className="selected-box">
                  <span>Observation selectionnee</span>
                  <strong>{selected.observation_code}</strong>
                  <p>{selected.crop} sur {selected.surface_ha} ha a {selected.province}</p>
                </div>
                <button className="primary wide" type="button" onClick={() => predictFromObservation()} disabled={loading}>
                  {loading ? <Loader2 size={16} className="spin" /> : <BarChart3 size={16} />}
                  Predire le rendement
                </button>
              </>
            ) : (
              <p className="empty">Selectionne une observation pour lancer la prediction.</p>
            )}

            {prediction && (
              <div className="prediction-card">
                <div>
                  <span>Rendement estime</span>
                  <strong>{prediction.estimated_yield_t_ha} t/ha</strong>
                </div>
                <div>
                  <span>Production totale</span>
                  <strong>{prediction.estimated_total_tons} t</strong>
                </div>
                <div>
                  <span>Confiance</span>
                  <strong>{Math.round(prediction.confidence_score * 100)}%</strong>
                </div>
                <div>
                  <span>Risque</span>
                  <strong className={`risk ${prediction.risk_level}`}>{prediction.risk_level}</strong>
                </div>
                <ul>
                  {prediction.main_factors.map((factor) => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
                <p>{prediction.recommendation}</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="metric">
      {icon}
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function TextInput({ label, value, onChange, type = "text" }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number | ""; onChange: (value: number | "") => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" step="any" value={value} onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))} />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
