-- Solo ajusta la tabla nueva y vacía de este módulo; no toca índices históricos.
do $$ begin if exists(select 1 from public.planillas_backup_registros) then raise exception 'Revisar datos antes de ampliar complementos por día'; end if; end $$;
drop index public.backup_complemento_movimiento_unico;
alter table public.planillas_backup_registros add constraint backup_complemento_movimiento_por_dia exclude using gist(
 origen_movimiento_id with =,
 daterange(fecha_inicio,coalesce(fecha_fin,fecha_inicio),'[]') with &&
) where (estado='activo' and origen_movimiento_id is not null);