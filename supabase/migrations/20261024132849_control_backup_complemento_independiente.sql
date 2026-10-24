-- Complemento independiente de Backup. No modifica tablas, índices ni permisos existentes.
create table public.planillas_backup_registros (
 id uuid primary key default gen_random_uuid(),
 proyecto_id uuid not null references public.planillas_proyectos(id),
 expediente_id text not null references public.vacaciones_expedientes_v2(id),
 origen_movimiento_id uuid references public.planillas_movimientos(id),
 origen_cobertura_id uuid references public.planillas_coberturas(id),
 origen_firma text,
 fecha_inicio date not null,
 fecha_fin date,
 estado_dia text not null check(estado_dia in ('Trabajó','LIBRE','Sin asignación','Vacaciones','Incapacidad','Permiso','Ausencia')),
 sitio text,
 persona_cubierta text,
 entrada time,
 salida time,
 horas numeric,
 observacion text not null default '',
 gps text,
 estado text not null default 'activo' check(estado in ('activo','anulado')),
 creado_por uuid not null default auth.uid() references auth.users(id),
 creado timestamptz not null default now(),
 actualizado timestamptz not null default now(),
 historial jsonb not null default '[]'::jsonb,
 constraint backup_un_origen check(origen_movimiento_id is null or origen_cobertura_id is null),
 constraint backup_periodo check(fecha_fin is null or (fecha_fin>=fecha_inicio and fecha_fin-fecha_inicio<=31)),
 constraint backup_horas_validas check(
 (estado_dia='Trabajó' and nullif(btrim(sitio),'') is not null and nullif(btrim(persona_cubierta),'') is not null and entrada is not null and salida is not null and entrada<>salida and horas is not null and horas>0 and horas<=24 and horas<=extract(epoch from(salida-entrada))/3600+case when salida<entrada then 24 else 0 end)
 or (estado_dia<>'Trabajó' and entrada is null and salida is null and coalesce(horas,0)=0))
);
alter table public.planillas_backup_registros enable row level security;
grant select,insert,update on public.planillas_backup_registros to authenticated;
revoke all on public.planillas_backup_registros from anon;
create policy backup_leer on public.planillas_backup_registros for select to authenticated using(public.planillas_puede_ver(proyecto_id));
create policy backup_insertar on public.planillas_backup_registros for insert to authenticated with check(
 creado_por=(select auth.uid()) and public.planillas_puede_ver(proyecto_id) and exists(
 select 1 from public.planillas_proyectos p join public.vacaciones_expedientes_v2 e on e.proyecto=p.codigo_vacaciones
 where p.id=planillas_backup_registros.proyecto_id and p.tipo='backup' and e.id=planillas_backup_registros.expediente_id and upper(e.expediente->>'nombre') like '%JUANA%' and upper(e.expediente->>'nombre') like '%CARRERO%'));
create policy backup_actualizar on public.planillas_backup_registros for update to authenticated using(public.planillas_puede_ver(proyecto_id)) with check(public.planillas_puede_ver(proyecto_id));
create unique index backup_complemento_movimiento_unico on public.planillas_backup_registros(origen_movimiento_id) where estado='activo' and origen_movimiento_id is not null;
create unique index backup_complemento_cobertura_unico on public.planillas_backup_registros(origen_cobertura_id) where estado='activo' and origen_cobertura_id is not null;
create unique index backup_dia_sin_repetir on public.planillas_backup_registros(
 proyecto_id,expediente_id,fecha_inicio,(coalesce(fecha_fin,fecha_inicio)),estado_dia,
 (md5(lower(btrim(coalesce(sitio,''))))),(md5(lower(btrim(coalesce(persona_cubierta,''))))),
 (coalesce(entrada,time '00:00')),(coalesce(salida,time '00:00')),(coalesce(horas,-1))
) where estado='activo';
create index backup_persona_periodo on public.planillas_backup_registros(proyecto_id,expediente_id,fecha_inicio);
create function public.planillas_backup_auditar() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if (select auth.uid()) is null then raise exception 'Se requiere una sesión autenticada'; end if;
 if tg_op='INSERT' then new.historial='[]'::jsonb; return new; end if;
 if new.proyecto_id is distinct from old.proyecto_id or new.expediente_id is distinct from old.expediente_id or new.creado_por is distinct from old.creado_por or new.creado is distinct from old.creado or new.origen_movimiento_id is distinct from old.origen_movimiento_id or new.origen_cobertura_id is distinct from old.origen_cobertura_id then raise exception 'No se puede cambiar equipo, colaboradora ni origen del registro'; end if;
 new.actualizado=clock_timestamp();
 new.historial=old.historial||jsonb_build_array(jsonb_build_object('fecha',new.actualizado,'usuario',auth.uid(),'antes',to_jsonb(old)-'historial','despues',to_jsonb(new)-'historial'));
 return new;
end $$;
revoke all on function public.planillas_backup_auditar() from public;
create trigger backup_auditoria before insert or update on public.planillas_backup_registros for each row execute function public.planillas_backup_auditar();
