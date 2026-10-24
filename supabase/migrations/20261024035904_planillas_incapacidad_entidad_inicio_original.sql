alter table public.planillas_movimientos add column if not exists incapacidad_entidad text, add column if not exists incapacidad_inicio date;
alter table public.planillas_movimientos
  add constraint planillas_incapacidad_entidad_valida check (incapacidad_entidad is null or (tipo='INC' and incapacidad_entidad in ('CCSS','INS'))),
  add constraint planillas_incapacidad_inicio_valido check (incapacidad_inicio is null or (tipo='INC' and incapacidad_inicio<=fecha_inicio));
comment on column public.planillas_movimientos.incapacidad_entidad is 'Entidad de incapacidad: CCSS o INS; null en otros movimientos o registros históricos sin clasificar.';
comment on column public.planillas_movimientos.incapacidad_inicio is 'Inicio original de la incapacidad, para contar correctamente los primeros tres días de CCSS en continuaciones.';
