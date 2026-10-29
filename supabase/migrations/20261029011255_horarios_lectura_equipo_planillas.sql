create policy horarios_planillas_equipo_leer
on public.vacaciones_horarios_v2
for select to authenticated
using (
 (select auth.uid()) is not null
 and exists (
  select 1
  from public.vacaciones_expedientes_v2 e
  join public.planillas_proyectos p on p.codigo_vacaciones=e.proyecto
  where e.id=vacaciones_horarios_v2.expediente_id
    and public.planillas_puede_ver(p.id)
 )
);
comment on policy horarios_planillas_equipo_leer on public.vacaciones_horarios_v2 is
'Consulta de horarios para generar planillas: solo expedientes visibles y proyectos autorizados por planillas_puede_ver; no otorga escritura ni acceso a otros equipos.';