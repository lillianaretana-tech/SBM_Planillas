create or replace function public.planillas_validar_movimiento()
 returns trigger language plpgsql set search_path to 'public' as $function$
declare v_codigo text; v_tipo text; v_nombre text; v_proyecto text; v_expediente jsonb;
begin
 select codigo_vacaciones,tipo into v_codigo,v_tipo from public.planillas_proyectos where id=new.proyecto_id;
 if new.expediente_id is null then raise exception 'Debe seleccionar colaborador'; end if;
 select expediente->>'nombre',proyecto,expediente into v_nombre,v_proyecto,v_expediente from public.vacaciones_expedientes_v2 where id=new.expediente_id;
 if v_nombre is null or v_proyecto is distinct from v_codigo then raise exception 'Colaborador no pertenece al proyecto'; end if;
 if v_tipo='backup' and not (upper(v_nombre) like '%JUANA%' and upper(v_nombre) like '%DIAZ%' or upper(v_nombre) like '%JUANA%' and upper(v_nombre) like '%DÍAZ%') then raise exception 'Backup solo permite a Juana'; end if;
 if v_tipo='backup' and new.tipo<>'ASIGNACION' then raise exception 'Backup requiere asignacion'; end if;
 if v_expediente->>'planillasHistorico'='true' and new.estado<>'anulado' then
   if nullif(v_expediente->>'planillasDesde','') is null or nullif(v_expediente->>'fechaSalida','') is null then raise exception 'Falta período del expediente histórico'; end if;
   if new.fecha_inicio < (v_expediente->>'planillasDesde')::date or coalesce(new.fecha_fin,new.fecha_inicio) > (v_expediente->>'fechaSalida')::date then
     raise exception 'El movimiento debe estar dentro del período histórico: % al %',v_expediente->>'planillasDesde',v_expediente->>'fechaSalida';
   end if;
 end if;
 return new;
end $function$;