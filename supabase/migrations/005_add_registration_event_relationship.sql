begin;

alter table public.registrations
  add column if not exists "eventId" bigint;

update public.registrations
set "eventId" = case id
  when 1 then 1
  when 2 then 3
  when 3 then 1
  when 4 then 1
  when 5 then 2
  when 6 then 3
  when 7 then 2
  when 8 then 8
  when 9 then 3
  when 10 then 3
  when 11 then 9
end
where id between 1 and 11;

alter table public.registrations
  alter column "eventId" set not null;

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

create index if not exists registrations_event_id_idx
  on public.registrations ("eventId");

commit;
