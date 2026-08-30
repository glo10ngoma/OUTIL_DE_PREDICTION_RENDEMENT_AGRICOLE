import React from "react";
import ReactDOM from "react-dom/client";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  FileText,
  Leaf,
  Loader2,
  Plus,
  RefreshCw,
  Sprout,
} from "lucide-react";
import "./styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

type View = "dashboard" | "observations" | "new-observation" | "prediction";
type PressureLevel = "low" | "medium" | "high";
type DrainageLevel = "good" | "medium" | "poor";
type SoilTexture = "clay" | "sandy" | "loamy" | "silty" | "mixed";
type CultivationPractice =
  | "vetiver_hedgerows"
  | "slash_and_burn"
  | "conventional_tillage"
  | "no_till"
  | "mulching"
  | "crop_rotation"
  | "intercropping"
  | "improved_fallow"
  | "agroforestry"
  | "contour_farming"
  | "terracing"
  | "organic_amendment"
  | "supplemental_irrigation"
  | "other";

type FieldObservationForm = {
  observation_code: string;
  observation_date: string;
  agent_name: string;
  province: string;
  territory: string;
  village: string;
  latitude: number | "";
  longitude: number | "";
  altitude_m: number | "";
  farm_name: string;
  plot_code: string;
  surface_ha: number | "";
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
  cultivation_practice: CultivationPractice;
  secondary_practice: CultivationPractice | "";
  vetiver_installed: boolean;
  vetiver_age_months: number | "";
  vetiver_spacing_m: number | "";
  method_notes: string;
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

type YieldResultForm = {
  harvest_date: string;
  actual_yield_t_ha: number | "";
  actual_total_tons: number | "";
  loss_percent: number | "";
  notes: string;
};

const today = new Date().toISOString().slice(0, 10);

const cropOptions = [
  "cassava",
  "maize",
  "rice",
  "beans",
  "groundnut",
  "soybean",
  "sweet_potato",
  "plantain",
  "banana",
  "sorghum",
  "watermelon",
  "palm",
  "rubber",
];

const cropLabels: Record<string, string> = {
  cassava: "Manioc",
  maize: "Mais",
  rice: "Riz",
  beans: "Haricot",
  groundnut: "Arachide",
  soybean: "Soja",
  sweet_potato: "Patate douce",
  plantain: "Plantain",
  banana: "Banane",
  sorghum: "Sorgho",
  watermelon: "Pasteque",
  palm: "Palmier a huile",
  rubber: "Hevea",
};

const practiceOptions: CultivationPractice[] = [
  "vetiver_hedgerows",
  "mulching",
  "crop_rotation",
  "intercropping",
  "organic_amendment",
  "no_till",
  "agroforestry",
  "contour_farming",
  "terracing",
  "improved_fallow",
  "supplemental_irrigation",
  "conventional_tillage",
  "slash_and_burn",
  "other",
];

const secondaryPracticeOptions = ["", ...practiceOptions];

const practiceLabels: Record<string, string> = {
  "": "Aucune",
  vetiver_hedgerows: "Haies vives de vetiver",
  slash_and_burn: "Culture sur brulis",
  conventional_tillage: "Labour classique",
  no_till: "Semis direct / non-labour",
  mulching: "Paillage / couverture du sol",
  crop_rotation: "Rotation culturale",
  intercropping: "Association culturale",
  improved_fallow: "Jachere amelioree",
  agroforestry: "Agroforesterie",
  contour_farming: "Culture en courbes de niveau",
  terracing: "Terrasses anti-erosives",
  organic_amendment: "Compost / fumier",
  supplemental_irrigation: "Irrigation complementaire",
  other: "Autre",
};

function createYieldResultForm(observation?: FieldObservation | null): YieldResultForm {
  return {
    harvest_date: observation?.harvest_date ?? today,
    actual_yield_t_ha: observation?.actual_yield_t_ha ?? "",
    actual_total_tons: observation?.actual_total_tons ?? "",
    loss_percent: observation?.loss_percent ?? "",
    notes: observation?.notes ?? "",
  };
}

function createInitialForm(): FieldObservationForm {
  return {
    observation_code: `OBS-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    observation_date: today,
    agent_name: "",
    province: "",
    territory: "",
    village: "",
    latitude: "",
    longitude: "",
    altitude_m: "",
    farm_name: "",
    plot_code: "",
    surface_ha: "",
    slope_percent: "",
    drainage: "good",
    previous_crop: "",
    crop: "cassava",
    seed_variety: "",
    planting_date: today,
    planting_density_ha: "",
    expected_harvest_date: "",
    soil_texture: "loamy",
    soil_ph: "",
    organic_matter_percent: "",
    nitrogen_mg_kg: "",
    phosphorus_mg_kg: "",
    potassium_mg_kg: "",
    soil_moisture_percent: "",
    rainfall_mm: "",
    temperature_avg_c: "",
    fertilizer_kg_ha: "",
    irrigation: false,
    pest_pressure: "low",
    disease_pressure: "low",
    cultivation_practice: "vetiver_hedgerows",
    secondary_practice: "",
    vetiver_installed: true,
    vetiver_age_months: "",
    vetiver_spacing_m: "",
    method_notes: "",
    notes: "",
  };
}

function cleanPayload(form: Record<string, unknown>) {
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
  const [view, setView] = React.useState<View>("dashboard");
  const [form, setForm] = React.useState<FieldObservationForm>(() => createInitialForm());
  const [observations, setObservations] = React.useState<FieldObservation[]>([]);
  const [selected, setSelected] = React.useState<FieldObservation | null>(null);
  const [prediction, setPrediction] = React.useState<YieldPrediction | null>(null);
  const [yieldForm, setYieldForm] = React.useState<YieldResultForm>(() => createYieldResultForm());
  const [apiStatus, setApiStatus] = React.useState<"checking" | "ok" | "error">("checking");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [observationsError, setObservationsError] = React.useState("");

  const loadObservations = React.useCallback(async () => {
    try {
      setObservationsError("");
      const data = await apiRequest<FieldObservation[]>("/field-observations?limit=50");
      setObservations(data);
      setSelected((current) => current ?? data[0] ?? null);
    } catch (error) {
      setObservationsError(error instanceof Error ? error.message : "Chargement des observations impossible.");
    }
  }, []);

  React.useEffect(() => {
    apiRequest<{ status: string }>("/health")
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("error"));
    loadObservations();
  }, [loadObservations]);

  function updateField<K extends keyof FieldObservationForm>(key: K, value: FieldObservationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function selectObservation(observation: FieldObservation) {
    setSelected(observation);
    setPrediction(null);
    setYieldForm(createYieldResultForm(observation));
  }

  function updateYieldField<K extends keyof YieldResultForm>(key: K, value: YieldResultForm[K]) {
    setYieldForm((current) => ({ ...current, [key]: value }));
  }

  async function createObservation(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const requiredFields: Array<[keyof FieldObservationForm, string]> = [
      ["agent_name", "Agent"],
      ["province", "Province"],
      ["latitude", "Latitude"],
      ["longitude", "Longitude"],
      ["plot_code", "Code parcelle"],
      ["surface_ha", "Surface ha"],
      ["crop", "Culture"],
      ["planting_date", "Date semis"],
      ["cultivation_practice", "Technique principale"],
    ];
    const missing = requiredFields
      .filter(([key]) => form[key] === "" || form[key] === null || form[key] === undefined)
      .map(([, label]) => label);
    if (missing.length > 0) {
      setMessage(`Complete les champs obligatoires : ${missing.join(", ")}.`);
      setLoading(false);
      return;
    }
    try {
      const created = await apiRequest<FieldObservation>("/field-observations", {
        method: "POST",
        body: JSON.stringify(cleanPayload(form as unknown as Record<string, unknown>)),
      });
      setSelected(created);
      setYieldForm(createYieldResultForm(created));
      setPrediction(null);
      await loadObservations();
      setForm(createInitialForm());
      setView("observations");
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
      setView("observations");
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
          slope_percent: observation.slope_percent,
          cultivation_practice: observation.cultivation_practice,
          secondary_practice: observation.secondary_practice,
          vetiver_installed: observation.vetiver_installed,
          vetiver_age_months: observation.vetiver_age_months,
          vetiver_spacing_m: observation.vetiver_spacing_m,
        }),
      });
      setPrediction(result);
      setView("prediction");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Prediction impossible.");
    } finally {
      setLoading(false);
    }
  }

  async function updateYieldResult(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) {
      setMessage("Selectionne une observation avant de renseigner le rendement reel.");
      return;
    }
    if (!yieldForm.harvest_date || yieldForm.actual_yield_t_ha === "") {
      setMessage("Complete la date de recolte et le rendement reel t/ha.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const updated = await apiRequest<FieldObservation>(`/field-observations/${selected.id}/yield-result`, {
        method: "PATCH",
        body: JSON.stringify(cleanPayload(yieldForm as unknown as Record<string, unknown>)),
      });
      setSelected(updated);
      setYieldForm(createYieldResultForm(updated));
      await loadObservations();
      setMessage(`Rendement reel enregistre pour ${updated.observation_code}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Mise a jour du rendement impossible.");
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

      <nav className="app-nav" aria-label="Navigation principale">
        <NavButton active={view === "dashboard"} onClick={() => setView("dashboard")} icon={<Leaf size={16} />} label="Accueil" />
        <NavButton active={view === "observations"} onClick={() => setView("observations")} icon={<Database size={16} />} label="Observations" />
        <NavButton active={view === "new-observation"} onClick={() => setView("new-observation")} icon={<Plus size={16} />} label="Nouvelle observation" />
        <NavButton active={view === "prediction"} onClick={() => setView("prediction")} icon={<BarChart3 size={16} />} label="Prediction" />
      </nav>

      {message && <div className="message">{message}</div>}

      {view === "dashboard" && (
        <DashboardPage
          observations={observations}
          selected={selected}
          latestPredictionLabel={prediction ? `${prediction.estimated_yield_t_ha} t/ha` : "-"}
          onCreate={() => setView("new-observation")}
          onObservations={() => setView("observations")}
          onPredict={() => setView("prediction")}
        />
      )}

      {view === "observations" && (
        <ObservationsPage
          observations={observations}
          selected={selected}
          yieldForm={yieldForm}
          observationsError={observationsError}
          loading={loading}
          onRefresh={loadObservations}
          onCreate={() => setView("new-observation")}
          onSelect={selectObservation}
          onYieldChange={updateYieldField}
          onYieldSubmit={updateYieldResult}
          onPredict={(observation) => {
            selectObservation(observation);
            setView("prediction");
          }}
        />
      )}

      {view === "new-observation" && (
        <ObservationForm form={form} loading={loading} onSubmit={createObservation} onChange={updateField} />
      )}

      {view === "prediction" && (
        <PredictionPage
          observations={observations}
          selected={selected}
          prediction={prediction}
          loading={loading}
          onSelect={(observation) => {
            selectObservation(observation);
          }}
          onPredict={() => predictFromObservation()}
          onCreate={() => setView("new-observation")}
        />
      )}
    </main>
  );
}

function DashboardPage({
  observations,
  selected,
  latestPredictionLabel,
  onCreate,
  onObservations,
  onPredict,
}: {
  observations: FieldObservation[];
  selected: FieldObservation | null;
  latestPredictionLabel: string;
  onCreate: () => void;
  onObservations: () => void;
  onPredict: () => void;
}) {
  return (
    <>
      <section className="summary-grid">
        <Metric icon={<Database size={20} />} label="Observations" value={observations.length.toString()} />
        <Metric icon={<Sprout size={20} />} label="Culture active" value={selected?.crop ?? "-"} />
        <Metric icon={<BarChart3 size={20} />} label="Derniere prediction" value={latestPredictionLabel} />
      </section>

      <section className="dashboard-grid">
        <button className="action-card primary-card" type="button" onClick={onCreate}>
          <span className="card-icon"><Plus size={22} /></span>
          <strong>Nouvelle observation</strong>
          <p>Saisir les donnees terrain d'une parcelle avant analyse.</p>
          <ArrowRight size={18} />
        </button>
        <button className="action-card" type="button" onClick={onObservations}>
          <span className="card-icon"><FileText size={22} /></span>
          <strong>Liste des observations</strong>
          <p>Consulter les observations deja enregistrees et choisir une parcelle.</p>
          <ArrowRight size={18} />
        </button>
        <button className="action-card" type="button" onClick={onPredict}>
          <span className="card-icon"><BarChart3 size={22} /></span>
          <strong>Faire une prediction</strong>
          <p>Selectionner une observation et estimer le rendement agricole.</p>
          <ArrowRight size={18} />
        </button>
      </section>
    </>
  );
}

function ObservationsPage({
  observations,
  selected,
  yieldForm,
  observationsError,
  loading,
  onRefresh,
  onCreate,
  onSelect,
  onYieldChange,
  onYieldSubmit,
  onPredict,
}: {
  observations: FieldObservation[];
  selected: FieldObservation | null;
  yieldForm: YieldResultForm;
  observationsError: string;
  loading: boolean;
  onRefresh: () => void;
  onCreate: () => void;
  onSelect: (observation: FieldObservation) => void;
  onYieldChange: <K extends keyof YieldResultForm>(key: K, value: YieldResultForm[K]) => void;
  onYieldSubmit: (event: React.FormEvent) => void;
  onPredict: (observation: FieldObservation) => void;
}) {
  return (
    <section className="panel page-panel">
      <div className="panel-title row-between">
        <div>
          <h2>Observations terrain</h2>
          <p className="muted">Toutes les observations recentes enregistrees dans la base.</p>
        </div>
        <div className="toolbar">
          <button className="ghost" type="button" onClick={onRefresh} title="Actualiser">
            <RefreshCw size={16} />
          </button>
          <button className="primary compact" type="button" onClick={onCreate}>
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {observationsError ? (
        <div className="empty-state error-state">
          <AlertTriangle size={28} />
          <strong>Impossible de charger les observations.</strong>
          <p>{observationsError}</p>
          <button className="primary compact" type="button" onClick={onRefresh}>Reessayer</button>
        </div>
      ) : observations.length === 0 ? (
        <div className="empty-state">
          <Database size={28} />
          <strong>Aucune observation pour le moment.</strong>
          <p>Ajoute une premiere observation terrain pour commencer les analyses.</p>
          <button className="primary compact" type="button" onClick={onCreate}>Nouvelle observation</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Culture</th>
                <th>Methode</th>
                <th>Province</th>
                <th>Surface</th>
                <th>Date</th>
                <th>Rendement reel</th>
                <th>Risque</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {observations.map((observation) => (
                <tr key={observation.id} className={selected?.id === observation.id ? "selected-row" : ""}>
                  <td>
                    <button className="text-button" type="button" onClick={() => onSelect(observation)}>
                      {observation.observation_code}
                    </button>
                  </td>
                  <td>{observation.crop}</td>
                  <td>{practiceLabels[observation.cultivation_practice] ?? observation.cultivation_practice ?? "-"}</td>
                  <td>{observation.province}</td>
                  <td>{observation.surface_ha} ha</td>
                  <td>{observation.observation_date}</td>
                  <td>{observation.actual_yield_t_ha ? `${observation.actual_yield_t_ha} t/ha` : "-"}</td>
                  <td>{observation.pest_pressure}/{observation.disease_pressure}</td>
                  <td>
                    <div className="table-actions">
                      <button className="secondary" type="button" onClick={() => onSelect(observation)}>
                        Rendement
                      </button>
                      <button className="secondary" type="button" onClick={() => onPredict(observation)}>
                        Predire
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <form className="yield-panel" onSubmit={onYieldSubmit}>
          <div className="panel-title row-between">
            <div>
              <h2>Rendement reel apres recolte</h2>
              <p className="muted">
                Observation {selected.observation_code} - {selected.crop} sur {selected.surface_ha} ha.
              </p>
            </div>
            <button className="primary compact" type="submit" disabled={loading}>
              {loading ? <Loader2 size={16} className="spin" /> : <CheckCircle2 size={16} />}
              Enregistrer rendement
            </button>
          </div>
          <div className="grid four">
            <TextInput
              label="Date recolte *"
              type="date"
              value={yieldForm.harvest_date}
              onChange={(value) => onYieldChange("harvest_date", value)}
            />
            <NumberInput
              label="Rendement reel t/ha *"
              value={yieldForm.actual_yield_t_ha}
              onChange={(value) => onYieldChange("actual_yield_t_ha", value)}
            />
            <NumberInput
              label="Production totale tonnes"
              value={yieldForm.actual_total_tons}
              onChange={(value) => onYieldChange("actual_total_tons", value)}
            />
            <NumberInput
              label="Pertes %"
              value={yieldForm.loss_percent}
              onChange={(value) => onYieldChange("loss_percent", value)}
            />
          </div>
          <label className="field full">
            <span>Notes de recolte</span>
            <textarea value={yieldForm.notes} onChange={(event) => onYieldChange("notes", event.target.value)} />
          </label>
        </form>
      )}
    </section>
  );
}

function ObservationForm({
  form,
  loading,
  onSubmit,
  onChange,
}: {
  form: FieldObservationForm;
  loading: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onChange: <K extends keyof FieldObservationForm>(key: K, value: FieldObservationForm[K]) => void;
}) {
  const usesVetiver =
    form.cultivation_practice === "vetiver_hedgerows" || form.secondary_practice === "vetiver_hedgerows";

  function clearVetiverFields() {
    onChange("vetiver_installed", false);
    onChange("vetiver_age_months", "");
    onChange("vetiver_spacing_m", "");
  }

  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <div className="panel-title">
        <Leaf size={20} />
        <div>
          <h2>Nouvelle observation terrain</h2>
          <p className="muted">Renseigne la parcelle, la culture, le sol et les conditions terrain.</p>
        </div>
      </div>

      <div className="section-title">Identification</div>
      <div className="grid two">
        <TextInput label="Code observation" value={form.observation_code} onChange={(value) => onChange("observation_code", value)} />
        <TextInput label="Date observation" type="date" value={form.observation_date} onChange={(value) => onChange("observation_date", value)} />
        <TextInput label="Agent *" value={form.agent_name} onChange={(value) => onChange("agent_name", value)} />
        <TextInput label="Province *" value={form.province} onChange={(value) => onChange("province", value)} />
        <TextInput label="Territoire" value={form.territory} onChange={(value) => onChange("territory", value)} />
        <TextInput label="Village" value={form.village} onChange={(value) => onChange("village", value)} />
      </div>

      <div className="section-title">Parcelle</div>
      <div className="grid three">
        <NumberInput label="Latitude *" value={form.latitude} onChange={(value) => onChange("latitude", value)} />
        <NumberInput label="Longitude *" value={form.longitude} onChange={(value) => onChange("longitude", value)} />
        <NumberInput label="Altitude m" value={form.altitude_m} onChange={(value) => onChange("altitude_m", value)} />
        <TextInput label="Ferme" value={form.farm_name} onChange={(value) => onChange("farm_name", value)} />
        <TextInput label="Code parcelle *" value={form.plot_code} onChange={(value) => onChange("plot_code", value)} />
        <NumberInput label="Surface ha *" value={form.surface_ha} onChange={(value) => onChange("surface_ha", value)} />
        <NumberInput label="Pente %" value={form.slope_percent} onChange={(value) => onChange("slope_percent", value)} />
        <SelectInput label="Drainage" value={form.drainage} options={["good", "medium", "poor"]} onChange={(value) => onChange("drainage", value as DrainageLevel)} />
        <TextInput label="Culture precedente" value={form.previous_crop} onChange={(value) => onChange("previous_crop", value)} />
      </div>

      <div className="section-title">Culture et sol</div>
      <div className="grid three">
        <SelectInput label="Culture *" value={form.crop} options={cropOptions} labels={cropLabels} onChange={(value) => onChange("crop", value)} />
        <TextInput label="Variete" value={form.seed_variety} onChange={(value) => onChange("seed_variety", value)} />
        <TextInput label="Date semis *" type="date" value={form.planting_date} onChange={(value) => onChange("planting_date", value)} />
        <NumberInput label="Densite / ha" value={form.planting_density_ha} onChange={(value) => onChange("planting_density_ha", value)} />
        <TextInput label="Recolte prevue" type="date" value={form.expected_harvest_date} onChange={(value) => onChange("expected_harvest_date", value)} />
        <SelectInput label="Texture sol" value={form.soil_texture} options={["clay", "sandy", "loamy", "silty", "mixed"]} onChange={(value) => onChange("soil_texture", value as SoilTexture)} />
        <NumberInput label="pH sol" value={form.soil_ph} onChange={(value) => onChange("soil_ph", value)} />
        <NumberInput label="Matiere organique %" value={form.organic_matter_percent} onChange={(value) => onChange("organic_matter_percent", value)} />
        <NumberInput label="Humidite sol %" value={form.soil_moisture_percent} onChange={(value) => onChange("soil_moisture_percent", value)} />
        <NumberInput label="Azote mg/kg" value={form.nitrogen_mg_kg} onChange={(value) => onChange("nitrogen_mg_kg", value)} />
        <NumberInput label="Phosphore mg/kg" value={form.phosphorus_mg_kg} onChange={(value) => onChange("phosphorus_mg_kg", value)} />
        <NumberInput label="Potassium mg/kg" value={form.potassium_mg_kg} onChange={(value) => onChange("potassium_mg_kg", value)} />
      </div>

      <div className="section-title">Climat et risques</div>
      <div className="grid three">
        <NumberInput label="Pluie mm" value={form.rainfall_mm} onChange={(value) => onChange("rainfall_mm", value)} />
        <NumberInput label="Temperature C" value={form.temperature_avg_c} onChange={(value) => onChange("temperature_avg_c", value)} />
        <NumberInput label="Engrais kg/ha" value={form.fertilizer_kg_ha} onChange={(value) => onChange("fertilizer_kg_ha", value)} />
        <SelectInput label="Ravageurs" value={form.pest_pressure} options={["low", "medium", "high"]} onChange={(value) => onChange("pest_pressure", value as PressureLevel)} />
        <SelectInput label="Maladies" value={form.disease_pressure} options={["low", "medium", "high"]} onChange={(value) => onChange("disease_pressure", value as PressureLevel)} />
        <label className="check-row">
          <input type="checkbox" checked={form.irrigation} onChange={(event) => onChange("irrigation", event.target.checked)} />
          Irrigation disponible
        </label>
      </div>

      <div className="section-title">Methode culturale</div>
      <div className="grid three">
        <SelectInput
          label="Technique principale *"
          value={form.cultivation_practice}
          options={practiceOptions}
          labels={practiceLabels}
          onChange={(value) => {
            const practice = value as CultivationPractice;
            onChange("cultivation_practice", practice);
            if (practice === "vetiver_hedgerows") {
              onChange("vetiver_installed", true);
            } else if (form.secondary_practice !== "vetiver_hedgerows") {
              clearVetiverFields();
            }
          }}
        />
        <SelectInput
          label="Technique secondaire"
          value={form.secondary_practice}
          options={secondaryPracticeOptions}
          labels={practiceLabels}
          onChange={(value) => {
            const practice = value as CultivationPractice | "";
            onChange("secondary_practice", practice);
            if (practice === "vetiver_hedgerows") {
              onChange("vetiver_installed", true);
            } else if (form.cultivation_practice !== "vetiver_hedgerows") {
              clearVetiverFields();
            }
          }}
        />
        <label className="check-row">
          <input
            type="checkbox"
            checked={usesVetiver && form.vetiver_installed}
            disabled={!usesVetiver}
            onChange={(event) => onChange("vetiver_installed", event.target.checked)}
          />
          Vetiver installe
        </label>
        <NumberInput
          label="Age du vetiver mois"
          value={form.vetiver_age_months}
          disabled={!usesVetiver}
          onChange={(value) => onChange("vetiver_age_months", value)}
        />
        <NumberInput
          label="Distance bandes vetiver m"
          value={form.vetiver_spacing_m}
          disabled={!usesVetiver}
          onChange={(value) => onChange("vetiver_spacing_m", value)}
        />
      </div>

      <label className="field full">
        <span>Notes sur la methode</span>
        <textarea value={form.method_notes} onChange={(event) => onChange("method_notes", event.target.value)} />
      </label>

      <label className="field full">
        <span>Notes</span>
        <textarea value={form.notes} onChange={(event) => onChange("notes", event.target.value)} />
      </label>

      <button className="primary" type="submit" disabled={loading}>
        {loading ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
        Enregistrer observation
      </button>
    </form>
  );
}

function PredictionPage({
  observations,
  selected,
  prediction,
  loading,
  onSelect,
  onPredict,
  onCreate,
}: {
  observations: FieldObservation[];
  selected: FieldObservation | null;
  prediction: YieldPrediction | null;
  loading: boolean;
  onSelect: (observation: FieldObservation) => void;
  onPredict: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="prediction-layout">
      <section className="panel">
        <div className="panel-title">
          <BarChart3 size={20} />
          <div>
            <h2>Prediction de rendement</h2>
            <p className="muted">Choisis une observation, puis lance l'estimation.</p>
          </div>
        </div>

        {observations.length === 0 ? (
          <div className="empty-state">
            <Sprout size={28} />
            <strong>Aucune observation disponible.</strong>
            <p>La prediction se base sur une observation terrain enregistree.</p>
            <button className="primary compact" type="button" onClick={onCreate}>Creer une observation</button>
          </div>
        ) : (
          <>
            <label className="field">
              <span>Observation a analyser</span>
              <select
                value={selected?.id ?? ""}
                onChange={(event) => {
                  const next = observations.find((observation) => observation.id === Number(event.target.value));
                  if (next) onSelect(next);
                }}
              >
                <option value="" disabled>Selectionner une observation</option>
                {observations.map((observation) => (
                  <option key={observation.id} value={observation.id}>
                    {observation.observation_code} - {observation.crop} - {practiceLabels[observation.cultivation_practice] ?? "methode non precisee"}
                  </option>
                ))}
              </select>
            </label>

            {selected && (
              <div className="selected-box spacious">
                <span>Observation selectionnee</span>
                <strong>{selected.observation_code}</strong>
                <p>{selected.crop} sur {selected.surface_ha} ha a {selected.province}</p>
                <small>
                  Methode {practiceLabels[selected.cultivation_practice] ?? "-"}, sol {selected.soil_texture}, pluie {selected.rainfall_mm ?? "-"} mm
                </small>
              </div>
            )}

            <button className="primary wide" type="button" onClick={onPredict} disabled={loading || !selected}>
              {loading ? <Loader2 size={16} className="spin" /> : <BarChart3 size={16} />}
              Predire le rendement
            </button>
          </>
        )}
      </section>

      <section className="panel result-panel">
        <div className="panel-title">
          <FileText size={20} />
          <h2>Resultat</h2>
        </div>
        {prediction ? (
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
        ) : (
          <p className="empty">Aucune prediction lancee pour le moment.</p>
        )}
      </section>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button className={`nav-button ${active ? "active" : ""}`} type="button" onClick={onClick}>
      {icon}
      {label}
    </button>
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

function NumberInput({
  label,
  value,
  disabled = false,
  onChange,
}: {
  label: string;
  value: number | "";
  disabled?: boolean;
  onChange: (value: number | "") => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        step="any"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{labels?.[option] ?? option}</option>
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
