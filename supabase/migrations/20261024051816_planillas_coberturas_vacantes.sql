alter table public.planillas_coberturas alter column movimiento_id drop not null;
alter table public.planillas_coberturas add column vacante_id uuid references public.planillas_vacantes(id);
alter table public.planillas_coberturas add constraint cobertura_un_solo_origen check ((movimiento_id is not null)::int+(vacante_id is not null)::int=1);
create index planillas_coberturas_vacante_idx on public.planillas_coberturas(vacante_id) where vacante_id is not null;
create function public.planillas_validar_cobertura_vacante() returns trigger language plpgsql security invoker set search_path='' as $$
declare v public.planillas_vacantes%rowtype;
begin
 if new.vacante_id is not null then
   select * into v from public.planillas_vacantes where id=new.vacante_id;
   if not found or v.proyecto_id is distinct from new.proyecto_id then raise exception 'La vacante no pertenece al proyecto de la cobertura'; end if;
   if new.estado='activo' and (new.fecha<v.fecha_inicio or (v.fecha_fin is not null and new.fecha>v.fecha_fin)) then raise exception 'La cobertura debe estar dentro del período de la vacante'; end if;
 end if;
 return new;
end $$;
revoke all on function public.planillas_validar_cobertura_vacante() from public;
create trigger validar_cobertura_vacante before insert or update on public.planillas_coberturas for each row execute function public.planillas_validar_cobertura_vacante();
alter policy coberturas_insertar on public.planillas_coberturas with check (
 public.planillas_puede_ver(proyecto_id) and creado_por=(select auth.uid()) and (
 (movimiento_id is not null and exists(select 1 from public.planillas_movimientos m where m.id=planillas_coberturas.movimiento_id and m.proyecto_id=planillas_coberturas.proyecto_id and m.estado<>'anulado'))
 or (vacante_id is not null and exists(select 1 from public.planillas_vacantes v where v.id=planillas_coberturas.vacante_id and v.proyecto_id=planillas_coberturas.proyecto_id))
 ));
alter policy coberturas_actualizar on public.planillas_coberturas using(public.planillas_puede_ver(proyecto_id)) with check (
 public.planillas_puede_ver(proyecto_id) and (
 (movimiento_id is not null and exists(select 1 from public.planillas_movimientos m where m.id=planillas_coberturas.movimiento_id and m.proyecto_id=planillas_coberturas.proyecto_id))
 or (vacante_id is not null and exists(select 1 from public.planillas_vacantes v where v.id=planillas_coberturas.vacante_id and v.proyecto_id=planillas_coberturas.proyecto_id))
 ));