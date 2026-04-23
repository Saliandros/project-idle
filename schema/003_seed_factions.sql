-- Seed factions used by the app.
-- Add more rows in the values list when new factions are introduced.

insert into public.factions (name)
select seed.name
from (
  values
    ('Lizardmen'),
    ('Humen'),
    ('Elves')
) as seed(name)
where not exists (
  select 1
  from public.factions existing
  where lower(existing.name) = lower(seed.name)
);
