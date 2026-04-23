-- Read-only lookup tables used by the app.
-- Safe to rerun when policies need to be refreshed.

alter table public.factions enable row level security;
alter table public.champions enable row level security;

drop policy if exists "authenticated can read factions" on public.factions;
create policy "authenticated can read factions"
on public.factions
for select
to authenticated
using (true);

drop policy if exists "authenticated can read champions" on public.champions;
create policy "authenticated can read champions"
on public.champions
for select
to authenticated
using (true);
