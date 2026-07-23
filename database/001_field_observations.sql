create table if not exists field_observations (
    id bigserial primary key,
    observation_code varchar(50) not null unique,
    observation_date date not null,
    agent_name varchar(150) not null,

    province varchar(120) not null,
    territory varchar(120),
    village varchar(120),
    latitude double precision not null,
    longitude double precision not null,
    altitude_m double precision,

    farm_name varchar(180),
    plot_code varchar(80) not null,
    surface_ha double precision not null check (surface_ha > 0),
    slope_percent double precision check (slope_percent is null or slope_percent >= 0),
    drainage varchar(30),
    previous_crop varchar(80),

    crop varchar(80) not null,
    seed_variety varchar(120),
    planting_date date not null,
    planting_density_ha double precision check (planting_density_ha is null or planting_density_ha >= 0),
    expected_harvest_date date,

    soil_texture varchar(50),
    soil_ph double precision check (soil_ph is null or soil_ph between 3.0 and 10.0),
    organic_matter_percent double precision check (
        organic_matter_percent is null or organic_matter_percent between 0 and 20
    ),
    nitrogen_mg_kg double precision check (nitrogen_mg_kg is null or nitrogen_mg_kg >= 0),
    phosphorus_mg_kg double precision check (phosphorus_mg_kg is null or phosphorus_mg_kg >= 0),
    potassium_mg_kg double precision check (potassium_mg_kg is null or potassium_mg_kg >= 0),
    soil_moisture_percent double precision check (
        soil_moisture_percent is null or soil_moisture_percent between 0 and 100
    ),

    rainfall_mm double precision check (rainfall_mm is null or rainfall_mm >= 0),
    temperature_avg_c double precision check (temperature_avg_c is null or temperature_avg_c between 0 and 50),
    fertilizer_kg_ha double precision check (fertilizer_kg_ha is null or fertilizer_kg_ha >= 0),
    irrigation boolean not null default false,
    pest_pressure varchar(20) not null default 'low',
    disease_pressure varchar(20) not null default 'low',

    harvest_date date,
    actual_yield_t_ha double precision check (actual_yield_t_ha is null or actual_yield_t_ha >= 0),
    actual_total_tons double precision check (actual_total_tons is null or actual_total_tons >= 0),
    loss_percent double precision check (loss_percent is null or loss_percent between 0 and 100),
    notes text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint field_observations_latitude_check check (latitude between -90 and 90),
    constraint field_observations_longitude_check check (longitude between -180 and 180),
    constraint field_observations_drainage_check check (
        drainage is null or drainage in ('good', 'medium', 'poor')
    ),
    constraint field_observations_soil_texture_check check (
        soil_texture is null or soil_texture in ('clay', 'sandy', 'loamy', 'silty', 'mixed')
    ),
    constraint field_observations_pressure_check check (
        pest_pressure in ('low', 'medium', 'high')
        and disease_pressure in ('low', 'medium', 'high')
    )
);

create index if not exists idx_field_observations_crop on field_observations (crop);
create index if not exists idx_field_observations_province on field_observations (province);
create index if not exists idx_field_observations_plot_code on field_observations (plot_code);
create index if not exists idx_field_observations_observation_date on field_observations (observation_date desc);

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_field_observations_updated_at on field_observations;
create trigger trg_field_observations_updated_at
before update on field_observations
for each row
execute function set_updated_at();
