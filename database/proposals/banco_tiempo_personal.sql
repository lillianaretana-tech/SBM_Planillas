-- Control personal independiente. No escribe movimientos, coberturas ni reportes RH.
create table public.planillas_banco_tiempo (
 id uuid primary key default gen_random_uuid(),
 propietario uuid not null default auth.uid() references auth.users(id),
 proyecto_id uuid not null references public.planillas_proyectos(id),
 expediente_id text not null references public.vacaciones_expedientes_v2(id),
 fecha date not null,
 tipo text not null check (tipo in ('credito','debito')),
 horas numeric(10,2) not null check (horas>0 and horas<=10000),
 detalle text not null check (length(btrim(detalle)) between 3 and 2000),
 estado text not null default 'activo' check (estado in ('activo','anulado')),
 creado timestamptz not null default now(),
 anulado timestamptz,
 motivo_anulacion text,
 check ((estado='activo' and anulado is null and motivo_anulacion is null)
  or (estado='anulado' and anulado is not null and length(btrim(motivo_anulacion)) between 3 and 2000))
);
alter table public.planillas_banco_tiempo enable row level security;
revoke all on public.planillas_banco_tiempo from anon,authenticated;
grant select,insert on public.planillas_banco_tiempo to authenticated;
grant update(estado,motivo_anulacion) on public.planillas_banco_tiempo to authenticated;
create policy banco_tiempo_personal_leer on public.planillas_banco_tiempo for select to authenticated
 using (propietario=(select auth.uid()) and (select public.planillas_es_admin()));
create policy banco_tiempo_personal_insertar on public.planillas_banco_tiempo for insert to authenticated
 with check (propietario=(select auth.uid()) and (select public.planillas_es_admin()) and estado='activo');
create policy banco_tiempo_personal_anular on public.planillas_banco_tiempo for update to authenticated
 using (propietario=(select auth.uid()) and (select public.planillas_es_admin()))
 with check (propietario=(select auth.uid()) and (select public.planillas_es_admin()));
create index banco_tiempo_saldos on public.planillas_banco_tiempo(propietario,expediente_id,fecha);
create unique index banco_tiempo_no_duplicados on public.planillas_banco_tiempo
 (propietario,proyecto_id,expediente_id,fecha,tipo,horas,md5(lower(regexp_replace(btrim(detalle),'\s+',' ','g')))) where estado='activo';
create function public.planillas_banco_tiempo_validar() returns trigger
 language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null or not public.planillas_es_admin() or new.propietario<>auth.uid() then
  raise exception 'Banco de tiempo reservado a su administradora propietaria';
 end if;
 if TG_OP='INSERT' then
  if new.estado<>'activo' then raise exception 'El registro debe iniciar activo'; end if;
  if not exists(select 1 from public.vacaciones_expedientes_v2 e join public.planillas_proyectos p on p.codigo_vacaciones=e.proyecto where e.id=new.expediente_id and p.id=new.proyecto_id and public.planillas_puede_ver(p.id)) then
   raise exception 'El colaborador no pertenece al proyecto';
  end if;
  new.creado=now();new.anulado=null;new.motivo_anulacion=null;
 else
  if old.estado<>'activo' or new.estado<>'anulado' then raise exception 'Solo se permite anular un registro activo'; end if;
  if (to_jsonb(new)-'estado'-'anulado'-'motivo_anulacion') is distinct from (to_jsonb(old)-'estado'-'anulado'-'motivo_anulacion') then
   raise exception 'El registro original se conserva. Anulá y registrá una corrección';
  end if;
  if length(btrim(coalesce(new.motivo_anulacion,'')))<3 then raise exception 'Indicá el motivo de anulación';end if;
  new.anulado=now();
 end if;
 return new;
end $$;
revoke all on function public.planillas_banco_tiempo_validar() from public;
create trigger banco_tiempo_validar before insert or update on public.planillas_banco_tiempo
 for each row execute function public.planillas_banco_tiempo_validar();
comment on table public.planillas_banco_tiempo is 'Libro personal privado de horas acordadas. No participa en RH-F-24, RH-F-27, vacaciones, movimientos ni coberturas. Saldo positivo: horas a favor del colaborador; negativo: tiempo adelantado pendiente de compensar.';
