alter table public.planillas_vacantes add constraint vacantes_persona_sin_duplicados exclude using gist (
 proyecto_id with =,
 expediente_anterior_id extensions.gist_text_ops with =,
 daterange(fecha_inicio,fecha_fin,'[]') with &&
) where (expediente_anterior_id is not null);