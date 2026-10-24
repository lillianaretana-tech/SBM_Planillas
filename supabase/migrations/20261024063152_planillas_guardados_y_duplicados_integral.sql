create unique index coberturas_movimiento_sin_duplicados on public.planillas_coberturas(movimiento_id,cubre_expediente_id,fecha,turno,tipo_hora) where estado='activo' and movimiento_id is not null;
create unique index coberturas_vacante_sin_duplicados on public.planillas_coberturas(vacante_id,cubre_expediente_id,fecha,turno,tipo_hora) where estado='activo' and vacante_id is not null;
create unique index movimientos_adicionales_sin_duplicados on public.planillas_movimientos(
 proyecto_id,expediente_id,tipo,fecha_inicio,(coalesce(fecha_fin,fecha_inicio)),(coalesce(horas,-1)),
 (md5(lower(btrim(regexp_replace(coalesce(ubicacion,''),'[[:space:]]+',' ','g'))))),
 (md5(lower(btrim(regexp_replace(coalesce(detalle,''),'[[:space:]]+',' ','g')))))
) where estado<>'anulado' and tipo in ('HE','ORD','ASIGNACION','OTRO');
alter table public.planillas_vacantes add constraint vacantes_sin_duplicados exclude using gist (
 proyecto_id with =,
 (case when nullif(btrim(nombre_anterior),'') is not null then 'nombre:'||lower(btrim(regexp_replace(nombre_anterior,'[[:space:]]+',' ','g')))
 when expediente_anterior_id is not null then 'id:'||expediente_anterior_id
 else 'plaza:'||lower(btrim(regexp_replace(posicion,'[[:space:]]+',' ','g'))) end) extensions.gist_text_ops with =,
 daterange(fecha_inicio,fecha_fin,'[]') with &&
);
alter table public.planillas_documentos add column contenido_sha256 text not null;
alter table public.planillas_documentos add constraint documento_hash_valido check(contenido_sha256 ~ '^[a-f0-9]{64}$');
create unique index documentos_contenido_sin_duplicados on public.planillas_documentos(movimiento_id,contenido_sha256);