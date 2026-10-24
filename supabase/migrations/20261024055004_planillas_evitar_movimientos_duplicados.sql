create extension if not exists btree_gist with schema extensions;
alter table public.planillas_movimientos
 add constraint planillas_movimientos_sin_duplicados
 exclude using gist (
   expediente_id extensions.gist_text_ops with =,
   tipo extensions.gist_text_ops with =,
   daterange(fecha_inicio,coalesce(fecha_fin,fecha_inicio),'[]') with &&
 )
 where (estado <> 'anulado' and tipo in ('PP','AJ','AI','INC','VAC','CITA'));