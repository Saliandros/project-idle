-- Seed champions used by the app.
-- Add more rows in the VALUES list when new champions are introduced.
-- faction_name must match a row in public.factions.

insert into public.champions (name, faction_id, base_income)
select seed.name, factions.id, seed.base_income
from (
  values
    ('Saliandros', 'Lizardmen', 0),
    ('Kroxigar', 'Lizardmen', 0)
) as seed(name, faction_name, base_income)
join public.factions factions
  on lower(factions.name) = lower(seed.faction_name)
where not exists (
  select 1
  from public.champions existing
  where lower(existing.name) = lower(seed.name)
);
