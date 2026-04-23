-- Convenience seed script for Supabase SQL Editor.
-- This intentionally duplicates the seed statements because SQL Editor does not
-- support importing sibling files.

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
