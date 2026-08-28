begin;

alter table public.registrations
  add column if not exists "eventId" bigint;

update public.registrations as r
set "eventId" = e.id
from public.events as e
where r."eventId" is null
  and r."eventTitle" = e.title
  and r."eventDate" = e.date;

create index if not exists registrations_event_id_idx
  on public.registrations ("eventId");

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'registrations_event_id_fkey'
      and conrelid = 'public.registrations'::regclass
  ) then
    alter table public.registrations
      add constraint registrations_event_id_fkey
      foreign key ("eventId") references public.events (id);
  end if;
end $$;

commit;
