alter table field_observations
    add column if not exists cultivation_practice varchar(80),
    add column if not exists secondary_practice varchar(80),
    add column if not exists vetiver_installed boolean not null default false,
    add column if not exists vetiver_age_months double precision check (
        vetiver_age_months is null or vetiver_age_months >= 0
    ),
    add column if not exists vetiver_spacing_m double precision check (
        vetiver_spacing_m is null or vetiver_spacing_m > 0
    ),
    add column if not exists method_notes text;

alter table field_observations
    drop constraint if exists field_observations_cultivation_practice_check,
    add constraint field_observations_cultivation_practice_check check (
        cultivation_practice is null or cultivation_practice in (
            'vetiver_hedgerows',
            'slash_and_burn',
            'conventional_tillage',
            'no_till',
            'mulching',
            'crop_rotation',
            'intercropping',
            'improved_fallow',
            'agroforestry',
            'contour_farming',
            'terracing',
            'organic_amendment',
            'supplemental_irrigation',
            'other'
        )
    );

alter table field_observations
    drop constraint if exists field_observations_secondary_practice_check,
    add constraint field_observations_secondary_practice_check check (
        secondary_practice is null or secondary_practice in (
            'vetiver_hedgerows',
            'slash_and_burn',
            'conventional_tillage',
            'no_till',
            'mulching',
            'crop_rotation',
            'intercropping',
            'improved_fallow',
            'agroforestry',
            'contour_farming',
            'terracing',
            'organic_amendment',
            'supplemental_irrigation',
            'other'
        )
    );

create index if not exists idx_field_observations_cultivation_practice
    on field_observations (cultivation_practice);

create index if not exists idx_field_observations_vetiver_installed
    on field_observations (vetiver_installed);
