alter table public.planillas_movimientos add column con_cotizacion boolean not null default false, add column cotizacion_referencia text;
alter table public.planillas_movimientos add constraint movimiento_cotizacion_solo_horas check(not con_cotizacion or tipo in ('HE','ORD'));
alter table public.planillas_coberturas add column con_cotizacion boolean not null default false, add column cotizacion_referencia text;
drop function public.planillas_historial_coberturas(uuid,text,date,date,integer,integer);
drop function planillas_privado.historial_coberturas(uuid,text,date,date,integer,integer);
revoke all on schema planillas_privado from public;
grant usage on schema planillas_privado to authenticated;
create function planillas_privado.historial_coberturas(
 p_proyecto_id uuid default null,p_expediente_id text default null,p_desde date default null,p_hasta date default null,p_limite integer default 200,p_offset integer default 0
) returns table(id uuid,proyecto_id uuid,proyecto_cubierto text,proyecto_origen text,expediente_id text,nombre text,fecha date,tipo_hora text,turno text,horas numeric,detalle text,estado text,movimiento_id uuid,vacante_id uuid,con_cotizacion boolean,cotizacion_referencia text,total bigint)
language plpgsql stable security definer set search_path='' as $$
begin
 if (select auth.uid()) is null then raise exception 'Se requiere una sesión autenticada'; end if;
 if p_desde is not null and p_hasta is not null and p_desde>p_hasta then raise exception 'El período no es válido'; end if;
 if p_offset<0 then raise exception 'Página no válida'; end if;
 return query
 select c.id,c.proyecto_id,d.nombre,
 coalesce((select string_agg(distinct h.nombre,' / ' order by h.nombre) from public.planillas_proyectos h where h.codigo_vacaciones=e.proyecto),e.proyecto),
 c.cubre_expediente_id,e.expediente->>'nombre',c.fecha,c.tipo_hora,c.turno,c.horas,c.detalle,c.estado,c.movimiento_id,c.vacante_id,c.con_cotizacion,c.cotizacion_referencia,count(*) over()
 from public.planillas_coberturas c
 join public.planillas_proyectos d on d.id=c.proyecto_id
 join public.vacaciones_expedientes_v2 e on e.id=c.cubre_expediente_id
 where (
 public.planillas_puede_ver(c.proyecto_id)
 or exists(select 1 from public.planillas_proyectos h where h.codigo_vacaciones=e.proyecto and public.planillas_puede_ver(h.id))
 )
 and (p_proyecto_id is null or c.proyecto_id=p_proyecto_id or exists(select 1 from public.planillas_proyectos h where h.id=p_proyecto_id and h.codigo_vacaciones=e.proyecto))
 and (p_expediente_id is null or c.cubre_expediente_id=p_expediente_id)
 and (p_desde is null or c.fecha>=p_desde) and (p_hasta is null or c.fecha<=p_hasta)
 order by c.fecha desc,c.creado desc,c.id
 limit least(greatest(coalesce(p_limite,200),1),200) offset coalesce(p_offset,0);
end $$;
revoke all on function planillas_privado.historial_coberturas(uuid,text,date,date,integer,integer) from public;
grant execute on function planillas_privado.historial_coberturas(uuid,text,date,date,integer,integer) to authenticated;
create function public.planillas_historial_coberturas(
 p_proyecto_id uuid default null,p_expediente_id text default null,p_desde date default null,p_hasta date default null,p_limite integer default 200,p_offset integer default 0
) returns table(id uuid,proyecto_id uuid,proyecto_cubierto text,proyecto_origen text,expediente_id text,nombre text,fecha date,tipo_hora text,turno text,horas numeric,detalle text,estado text,movimiento_id uuid,vacante_id uuid,con_cotizacion boolean,cotizacion_referencia text,total bigint)
language sql stable security invoker set search_path='' as $$
 select * from planillas_privado.historial_coberturas(p_proyecto_id,p_expediente_id,p_desde,p_hasta,p_limite,p_offset);
$$;
revoke all on function public.planillas_historial_coberturas(uuid,text,date,date,integer,integer) from public;
grant execute on function public.planillas_historial_coberturas(uuid,text,date,date,integer,integer) to authenticated;
comment on function public.planillas_historial_coberturas(uuid,text,date,date,integer,integer) is 'Read-only coverage history for authorized destination projects or workers in authorized home projects. Does not grant access to foreign absence records or mutation rights.';