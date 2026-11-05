(() => {
  const names = [
    'Diluir químicos', 'Limpiar equipo eléctrico', 'Estaciones de trabajo',
    'Áreas controladas y semicontroladas', 'Usar equipo eléctrico', 'Usar baldes escurridores',
    'Consultorio médico', 'Vidrios y espejos', 'Gradas', 'Cuarto de limpieza / Janitorial',
    'Cuartos de soporte', 'Lockers', 'Baños', 'Ascensores', 'Pasillos',
    'Fluidos biológicos y punzocortantes', 'Salas de reunión', 'Recepción / Lobby',
    'Cafeterías', 'Cuarto de lactancia', 'Gimnasio', 'Limpiar pisos',
    'Desinfección por COVID / enfermedades transmisibles', 'Filtros HEPA de aspiradoras',
    'Cómo funciona la operación SBM', 'Cuartos limpios ISO Clase 8'
  ];
  const official = 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=kRvUG74MskSPl6i7JRdwWX5fq9q7WWhEkpJzYFggpV1UNjlPRVU4TFhSWjhKQVJTTEs0VFVLMFlZNC4u';
  const dialog = document.createElement('dialog');
  dialog.style.width = 'min(850px, 95vw)';
  dialog.style.maxHeight = '90vh';
  dialog.innerHTML = `
    <form method="dialog"><button>Cerrar</button></form>
    <h2>Seguimiento OP-F-09</h2>
    <p>Seleccioná el proyecto y el funcionario para consultar el seguimiento.</p>
    <label>Fuente <select data-field="source"><option value="planillas">Planillas Inteligentes</option><option value="excel">Excel</option></select></label>
    <section data-field="import" hidden>
      <a href="data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAMo5ZV3lrKYl3wAAALkBAAAPAAAAeGwvd29ya2Jvb2sueG1stdGxTsMwEAbgV7FuJ04iE0VR3S5duiHewLHPjVXbF/lcyOMjCmoREwvb6R9+ffpvd9hSFG9YOFDW0DUtCMyWXMhnDdfqn0Y47Hfb9E7lMhNdxJZi5mnTsNS6TlKyXTAZbmjFvKXoqSRTuaFylrwWNI4XxJqi7Nt2kMmEDJ99t5Tvl8gmoYYXLEzZRBC39OQ0dCDKFJyGV6NGZ4ZWjQpnNVgF35byFwt5HyweyV4T5vqFKRhNDZR5CSuDkL81p8y1XK0NlJF/kPo7yXnVPdvO9LMf1TwO/0CSj63k4w37D1BLAwQUAAAACADKOWVdlu8ehLQBAABQBgAADQAAAHhsL3N0eWxlcy54bWzFlU2L2zAQhv+K0L3xx27aEqJsacDQy162h15lW3YEI42RlMXpry/6sKMGtu2W0vVF7wyaZ0bitb1/mBWQZ2GsRM1otSkpEbrDXuqR0bMb3n2kD4f9vLPuAuLpJIQjswJtdzOjJ+emXVHY7iQUtxuchJ4VDGgUd3aDZizsZATvrS9TUNRl+b5QXGrqifqsGuUs6fCsHaNVliRx+dIzWpclJRF5xF4w+omS4rAv1npfNaC+gu7okgpzfyfPHBitqlA37zRXIqaO3IB0uPCWihcrOwQ0xIwto016Xsts4/5/h04i3oIEuL0FCeDXiTsnjG4kAEn662USjGrUYiWmzb8tGg2/VPX21XUWQfZxrvGYn7j6cH+/vVt4WX3GTyKctEXTC3NjnZj0CsTg4u0ZOZ6SdDhF0aJzqKLuJR9Rc0idF8QqQ7dOADx5+38bblrOQ+bU4FO9SgmQZESlIDbKkUuLjL79W/o8XNv8EaB+CcCnCS6PZ9UK04S3z585ZhvUeSQBrtHnAAvxL0eo3n6E+o1GqOMX7T8PkUyX+S3478bQa5747w6jj74f/Oyr3L42hNd/w+EHUEsDBBQAAAAIAMs5ZV36XAFZAwMAANoNAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbL1X23KbMBT8FUbvDTdz84RkEsduH9Jpp8kPyCBAjRAeSY6dv+8gbgKM4zR27AdLYs/ZReewwte3+5xor4hxXNAQmFcG0BCNihjTNARbkXzzwe3NNZyLDOVIozBHIVhkUHz//Qy0fU4on8MQZEJs5rrOowzlkF8VG0T3OUkKlkPBrwqW6jGDO0zTnOiWYbh6DjEFbd4lQTmigpcLEWFP0QGy8lr8YpY//I0vCNNeIQnBDtO42D2jvQAagVwsCAuBIT9A02+u9TaKiIlgJXAlP01gHRG/WDKQpes20lha/szsGCSCiDFw6ZffLqNEwChCtJajgk3HNXyrASuoangge+CZ9iBAYbDHDIF7b836ARJVDWfjG10FywenHyBR1dAZBdwZ1n1g9wMkqhq6o4DZ8s6zlv0AicoIpi9juOv5vtvAW0xSkB8H8YHrGt5Dg+9gutJqVQIqeo33K0lwhGTf5fBvwVYFFbLKUGCqibcNSmBUNigkeM2w9ojTTEgeOEfwHUDEjwL0AWeO6bsCjlAfIW3pOgZd3Qy5NbmYfCQTTMiTeCPokUtxvCA4XmFC5ERGtaXYZAvCGsIeMGWwG/M6Vcq1TcFDYIDJXNJBMBXVmus1Tz2ck23+s4jrpjdbO4BzDkV3wXAUn2gZ5CzlqoYSd7IOz57Q0dENddgn6pB3crIQ3/ywkOCoEF0pD8FUg+Up4cxqu+URJCguC1Yn6JX1LCUOZlN3ZH12a08oMc9gjJq8xpSSqWbruvAMRVakeP5hJUEwIaTcqksUWR/bAaH9mbYr+b3m7v7LLDaMiwfIswonL7XnK1VoAsP5Ahqr3JnL0ejDPURJgiIxsdJNH7mosxy8/Fl0OSm2ArGnLN5pa7Jlf2AcAsczHQNoMeaiKYAWY9a1z/j9oluHZJPB2sl7D22Fl+OWUxEr5Qyl9+e14nW6Ostx9X7UwLWm7NabfhIvcD4Gyrmk+Efgf9RTK6s897Gp6lDlTRqtPSHPvpDRdl35dYY6bNnSY5vXMTkb/IFqVm7+AVBLAwQUAAAACADLOWVdDR656GUAAABzAAAAFAAAAHhsL3NoYXJlZFN0cmluZ3MueG1sBcFRCsMgDADQq0j+Z9w+xpDankXatAomFpMNj7/3lm1ycz8aWrskePoAjmTvR5UrwdfOxwe2dZlR1dzkJhpngmJ2R0TdC3FW32+Sye3sg7Op7+NCvQflQwuRccNXCG/kXAUcrn9QSwMEFAAAAAgAyzllXVQexldYAQAAywIAABgAAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWyVkttOwzAMhl/F8j1t13LStA5xEOIGhLjhOmvcg2jqKvHW8mrc8mIo6ShimoS4chz785/fyupqNC3syLqGuxwXUYJAXcG66aoct1KeXOLVejUuB7ZvriYSGE3bueWYYy3SL+PYFTUZ5SLuqRtNW7I1SlzEtopdb0npgJk2TpPkPDaq6dAPDLf3ofnZgqZSbVt54eGBmqqWHBdnCLFvLLh1+wim8Y9EMGoMcWi01DlmCULdaE1djglCsXXC5nWqLX7GTHi6x9MZT7N/4Nkez2b8NP0Lj39cBNt3SpRPLA9gQ5N3nJ5/w/MOwqYK33O9QHBBVXJ0YkNlt362/E6FsJfYTUIzcjMhpwfI0+eHIcugCcj0LSl9lL49LvjEZmMJCvbogW4cHIX4y2avKnpUtmo6By2VkmMSXSDYyWQ4C/fhdIawYRE231lNSpP1WYZQMsucTHud/+X6C1BLAwQUAAAACADLOWVdvp5ZiF0CAAAKBgAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQyLnhtbIWUzW7bMAzHX4XQeY0dp0m3om7RrSt26RZsGHZmbNpWJ4mGpHy06AvtsNNuu+bFBjlu6npuc7JI8U/+KMk8u9hoBSuyTrJJxXgUCyCTcS5NmYqlL47eiovzs83pmu1PVxF52Ghl3OkmFZX39WkUuawijW7ENZmNVgVbjd6N2JaRqy1h3si0ipI4nkUapREhYeO9boLnFnIqcKn8V15/IllWPhXjqYAoBGasXPsFLQOkAI2b5ruWua9SkcwEVDLPyaQiFpAtnWf9Y7c3fkqzkyetPNnL304OyaMnjIb7Cj0Gw/IabAhqKoTl5ViAS8VEgE+F87bZWZ1/QFsi5AQ1WccGVUi52iXea98Pa79RuZRakvEMX+ZH10fxu2fqqOHo4CQdnKSX7Gr7x+QESpFBOwjRV3x3BAqh4luEeUsPObmQBaGQCiEZvQ406QD1u7tCzw54oWSJnq1kN0jVl80t31Hm+Q2Y7V9NlsPhkq4VYc5wB4b1whJkHFyeDwAedwCP+/2btsua7eP1DSL2hZ8ZLNXSI5AapMzJ+MYVXqbTDHXb1AHaaYd22i/6f51B2L7uo8vs9vcCFYczY/C08Qw1WoSMjSO7QgsZWXYgjcwkKnIHMGcdzFm/3G2gYyhk5mUmhxlnL9w5PKofII7HyRQe4NIgzLe/LN3DDVt8HeykA3bSBzMZLuge8xfeYT/+Bo0nUyIodu2jc+HwFTrwYZ2xWmqDrfP5bzR8gFFvyNRY0g3aUhoHigqfinh0IsDu5mSz9lw3q6mABXvP+tGqCHOywZoIKJj93thNtf1YP/8HUEsDBBQAAAAAAMs5ZV3/IfMjKAEAACgBAAALAAAAX3JlbHMvLnJlbHPvu788P3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJ1dGYtOCI/PjxSZWxhdGlvbnNoaXBzIHhtbG5zPSJodHRwOi8vc2NoZW1hcy5vcGVueG1sZm9ybWF0cy5vcmcvcGFja2FnZS8yMDA2L3JlbGF0aW9uc2hpcHMiPjxSZWxhdGlvbnNoaXAgVHlwZT0iaHR0cDovL3NjaGVtYXMub3BlbnhtbGZvcm1hdHMub3JnL29mZmljZURvY3VtZW50LzIwMDYvcmVsYXRpb25zaGlwcy9vZmZpY2VEb2N1bWVudCIgVGFyZ2V0PSIveGwvd29ya2Jvb2sueG1sIiBJZD0iUmVlNmYzMDBkMDgyZjRlN2IiIC8+PC9SZWxhdGlvbnNoaXBzPlBLAwQUAAAACADLOWVd5/CguyIBAACRAwAAGgAAAHhsL19yZWxzL3dvcmtib29rLnhtbC5yZWxzzdMxTsMwFAbgq1jeie3UcQ1q2oWFtfQCjv2cRI3tyHYhPRsDR+IKiIJQghhYKrG84X/Sr89P8tvL62Y3uQE9QUx98DVmBcUIvA6m922NT9neSLzbbvYwqNwHn7p+TGhyg0817nIe7whJugOnUhFG8JMbbIhO5VSE2JJR6aNqgZSUChLnHXjZiQ7nEf7SGKztNdwHfXLg8y/FJOXzAAmjg4ot5BqTafjKiskNGD2YGu9LqUpmV40GAC6qW4zI1UC5AwdLzyX6nGymgkqtK0PXFdeMV7y6pip1KoJ5zLH37c9rzVcznmTCCAuG6lvK9Upek/cc4jF1AHlJ+44/HgCQ59dTXBolKJccGi40/we8csYzlrNKM1U2VvJGiguPLD7W9h1QSwMEFAAAAAgAyzllXaE7z04bAQAA3AMAABMAAABbQ29udGVudF9UeXBlc10ueG1stZNBTsMwEEWvEnmLYrddIISSdgFsAQkuYDmTxKo9tjyTkp6NBUfiCqguqgAhRVXbjWczfu//xXy+f1Sr0btiA4lswFrM5UwUgCY0FrtaDNyWN2K1rF63EagYvUOqRc8cb5Ui04PXJEMEHL1rQ/KaSYbUqajNWnegFrPZtTIBGZBL3jHEsrqHVg+Oi4eRAffa0TtR3O33dqpa6BidNZptQLXB5o+kDG1rDTTBDB6QJcUEuqEegL2TeUqvLV5lsPrXmcDRcdLvVjKByzvU20gHxdMGUrINFM868aP2UAs1OkW8dUDyzA0zdErNPXjYv/OTA2TMZNleJ2heOFnszt75J3sqyFtI6/yRVB6n9/8d5sA/Nsji4kFUvtXlF1BLAQIUAxQAAAAIAMo5ZV3lrKYl3wAAALkBAAAPAAAAAAAAAAAAAACkgQAAAAB4bC93b3JrYm9vay54bWxQSwECFAMUAAAACADKOWVdlu8ehLQBAABQBgAADQAAAAAAAAAAAAAApIEMAQAAeGwvc3R5bGVzLnhtbFBLAQIUAxQAAAAIAMs5ZV36XAFZAwMAANoNAAATAAAAAAAAAAAAAACkgesCAAB4bC90aGVtZS90aGVtZTEueG1sUEsBAhQDFAAAAAgAyzllXQ0euehlAAAAcwAAABQAAAAAAAAAAAAAAKSBHwYAAHhsL3NoYXJlZFN0cmluZ3MueG1sUEsBAhQDFAAAAAgAyzllXVQexldYAQAAywIAABgAAAAAAAAAAAAAAKSBtgYAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLAQIUAxQAAAAIAMs5ZV2+nlmIXQIAAAoGAAAYAAAAAAAAAAAAAACkgUQIAAB4bC93b3Jrc2hlZXRzL3NoZWV0Mi54bWxQSwECFAMUAAAAAADLOWVd/yHzIygBAAAoAQAACwAAAAAAAAAAAAAApIHXCgAAX3JlbHMvLnJlbHNQSwECFAMUAAAACADLOWVd5/CguyIBAACRAwAAGgAAAAAAAAAAAAAApIEoDAAAeGwvX3JlbHMvd29ya2Jvb2sueG1sLnJlbHNQSwECFAMUAAAACADLOWVdoTvPThsBAADcAwAAEwAAAAAAAAAAAAAApIGCDQAAW0NvbnRlbnRfVHlwZXNdLnhtbFBLBQYAAAAACQAJAEkCAADODgAAAAA=" download="Plantilla_personal_OP-F-09.xlsx">Descargar plantilla</a>
      <label>Importar personal <input type="file" accept=".xlsx"></label>
    </section>
    <label>Proyecto <select data-field="project"></select></label>
    <label>Funcionario <select data-field="person"></select></label>
    <p role="status"></p>
    <p data-field="progress"></p>
    <a href="https://lillianaretana-tech.github.io/SBM_procedimientos_operativos/" target="_blank" rel="noopener noreferrer">Consultar material de apoyo</a>
    <table><thead><tr><th>Procedimiento</th><th>Última evaluación</th><th>Acción</th></tr></thead><tbody></tbody></table>
    <form data-field="evaluation" hidden>
      <h3></h3>
      <p>Registrá la evaluación después de enviar el formulario oficial.</p>
      <label>Fecha <input type="date" name="date" required></label>
      <label>Plan de acción <textarea name="plan"></textarea></label>
      <label>Fecha de cumplimiento <input type="date" name="due"></label>
      <button>Guardar evaluación</button>
    </form>`;
  document.body.append(dialog);
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Seguimiento OP-F-09';
  const app = document.getElementById('app');
  const accessMessage = document.createElement('p');
  accessMessage.id = 'op-f09-access-message';
  accessMessage.setAttribute('role','status');
  app.prepend(button, accessMessage);
  const field = name => dialog.querySelector(`[data-field="${name}"]`);
  const status = message => { dialog.querySelector('[role=status]').textContent = message; };
  const source = field('source'), project = field('project'), person = field('person');
  const evaluation = field('evaluation'), body = dialog.querySelector('tbody');
  const today = () => new Intl.DateTimeFormat('sv-SE', {timeZone:'America/Costa_Rica'}).format(new Date());
  let userId, selected, request = 0;
  let staff = [], records = {};
  const options = (select, rows) => select.replaceChildren(...rows.map(([id, label]) => new Option(label,id)));
  const scope = () => source.value === 'excel'
    ? {propietario:userId, proyecto_importado:project.value, codigo_importado:person.value}
    : {proyecto_id:project.value, expediente_id:person.value};

  async function loadHistory() {
    const currentRequest = ++request;
    records = {};
    render();
    if (!person.value) return;
    const result = await db.from('op_f09_evaluaciones').select('id,procedimiento,fecha,plan,vencimiento,cerrado')
      .match(scope()).order('fecha').order('id');
    if (currentRequest !== request) return;
    if (result.error) throw result.error;
    result.data.forEach(row => {
      const code = `OP-P-${String(row.procedimiento).padStart(2,'0')}`;
      (records[code] ??= []).push({id:row.id,date:row.fecha,plan:row.plan,due:row.vencimiento,closed:row.cerrado});
    });
    render();
  }

  function render() {
    evaluation.hidden = true;
    field('progress').textContent = person.value ? `${Object.keys(records).length} de 26 evaluados` : '';
    body.replaceChildren();
    if (!person.value) return;
    names.forEach((name, index) => {
      const code = `OP-P-${String(index+1).padStart(2,'0')}`;
      const rows = records[code] || [];
      const last = rows.at(-1);
      const row = body.insertRow();
      row.insertCell().textContent = `${code} · ${name}`;
      const state = row.insertCell();
      const openPlans = rows.filter(entry => entry.plan && !entry.closed).length;
      state.textContent = last ? last.date : 'Pendiente';
      if (openPlans) state.append(` · ${openPlans} plan(es) abierto(s)`);
      if (last) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = `Historial (${rows.length})`;
        details.append(summary);
        rows.forEach(entry => {
          const item = document.createElement('p');
          item.textContent = [entry.date, entry.plan, entry.due].filter(Boolean).join(' · ');
          if (entry.plan && !entry.closed) {
            const close = document.createElement('button');
            close.textContent = 'Cerrar plan';
            close.onclick = safe(async () => {
              const {data,error} = await db.from('op_f09_evaluaciones')
                .update({cerrado:today()}).eq('id',entry.id).is('cerrado',null).select('id');
              if (error) throw error;
              if (!data.length) throw Error('El plan ya fue cerrado o el acceso cambió.');
              await loadHistory();
              status('Plan cerrado.');
            });
            item.append(' ', close);
          } else if (entry.closed) {
            item.append(` · Cerrado el ${entry.closed}`);
          }
          details.append(item);
        });
        state.append(details);
      }
      const actions = row.insertCell();
      const open = document.createElement('a');
      open.href = official;
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.textContent = 'Abrir formulario oficial';
      const register = document.createElement('button');
      register.textContent = last ? 'Registrar reevaluación' : 'Registrar evaluación';
      const edit = () => {
        selected = code;
        evaluation.reset();
        evaluation.querySelector('h3').textContent = `${code} · ${name}`;
        evaluation.elements.date.value = today();
        evaluation.hidden = false;
      };
      open.onclick = edit;
      register.onclick = () => { edit(); evaluation.scrollIntoView({block:'nearest'}); };
      actions.append(open, ' ', register);
    });
  }

  async function loadPeople() {
    const currentRequest = ++request;
    options(person, []);
    records = {};
    render();
    if (!project.value) return;
    let people;
    if (source.value === 'excel') {
      people = staff.filter(row => row.project === project.value).map(row => [row.code,row.name]);
    } else {
      const selectedProject = projects.find(row => String(row.id) === project.value);
      const {data,error} = await db.from('vacaciones_expedientes_v2')
        .select('id,nombre:expediente->>nombre,historico:expediente->>planillasHistorico')
        .eq('proyecto', selectedProject.codigo_vacaciones).order('id');
      if (currentRequest !== request) return;
      if (error) throw error;
      people = data.filter(row => row.historico !== 'true' && row.nombre).map(row => [row.id,row.nombre]);
    }
    options(person, [['','Seleccioná un funcionario'], ...people.sort((a,b) => a[1].localeCompare(b[1],'es'))]);
    if (!people.length) status('Este proyecto no tiene personal disponible.');
  }

  async function loadProjects() {
    const imported = source.value === 'excel';
    field('import').hidden = !imported;
    if (imported) {
      staff = [];
      for (let offset = 0; ; offset += 500) {
        const {data,error} = await db.from('op_f09_personal_importado').select('proyecto,codigo,nombre')
          .order('proyecto').order('codigo').range(offset,offset+499);
        if (error) throw error;
        staff.push(...data.map(row => ({project:row.proyecto,code:row.codigo,name:row.nombre})));
        if (data.length < 500) break;
      }
    }
    const rows = imported
      ? [...new Set(staff.map(row => row.project))].map(name => [name,name])
      : projects.filter(row => row.tipo !== 'backup').map(row => [row.id,row.nombre]);
    options(project, rows);
    await loadPeople();
  }

  const safe = fn => async (...args) => {
    status('');
    try { await fn(...args); } catch (error) { const message = error.message || 'No se pudo completar la operación.';
      if (dialog.open) status(message);
      else document.getElementById('op-f09-access-message')?.replaceChildren(message); }
  };
  button.onclick = safe(async () => {
    const {data:{user}} = await db.auth.getUser();
    if (!user) return;
    userId = user.id;
    const {data,error} = await db.from('op_f09_externos').select('usuario').maybeSingle();
    if (error) throw error;
    const standalone = document.body.hasAttribute('data-op-f09-external');
    if (standalone !== Boolean(data)) throw Error('Esta cuenta no tiene acceso a esta entrada.');
    source.value = standalone ? 'excel' : 'planillas';
    source.closest('label').hidden = true;
    dialog.showModal();
    await loadProjects();
  });
  source.onchange = safe(loadProjects);
  project.onchange = safe(loadPeople);
  person.onchange = safe(loadHistory);
  dialog.querySelector('input[type=file]').onchange = safe(async event => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    const sheet = workbook.getWorksheet('Personal');
    const columns = ['Proyecto','Número de empleado','Nombre completo'];
    if (!sheet || columns.some((label,i) => sheet.getCell(1,i+1).text.trim() !== label)) {
      throw Error('Usá la hoja Personal y los encabezados de la plantilla.');
    }
    const imported = new Map();
    sheet.eachRow((row,n) => {
      if (n === 1) return;
      const [project,code,name] = columns.map((_,i) => row.getCell(i+1).text.trim());
      if (!project && !code && !name) return;
      if (!project || !code || !name) throw Error(`Fila ${n}. Completá proyecto, código oficial y nombre.`);
      const id = JSON.stringify([project,code.toUpperCase()]);
      if (imported.has(id)) throw Error(`Fila ${n}. Código de empleado repetido dentro del proyecto.`);
      imported.set(id,{project,code:code.toUpperCase(),name});
    });
    if (!imported.size) throw Error('La hoja Personal está vacía.');
    const {data,error} = await db.from('op_f09_personal_importado')
      .upsert([...imported.values()].map(row => ({propietario:userId, proyecto:row.project, codigo:row.code, nombre:row.name})),
        {onConflict:'propietario,proyecto,codigo',ignoreDuplicates:true}).select('codigo');
    if (error) throw error;
    await loadProjects();
    status(`${data.length} altas. ${imported.size-data.length} códigos ya registrados.`);
  });

  evaluation.onsubmit = safe(async event => {
    event.preventDefault();
    const {date,plan,due} = Object.fromEntries(new FormData(evaluation));
    if (new TextEncoder().encode(plan.trim()).length > 1200) throw Error('El plan de acción supera el largo permitido.');
    if (Boolean(plan.trim()) !== Boolean(due)) throw Error('Completá el plan y su fecha de cumplimiento juntos.');
    if (due && due < date) throw Error('La fecha de cumplimiento debe ser igual o posterior a la evaluación.');
    const {error} = await db.from('op_f09_evaluaciones').insert({
      ...scope(), procedimiento:Number(selected.slice(-2)), fecha:date, plan:plan.trim(), vencimiento:due || null
    });
    if (error?.code === '23505') throw Error('Ya existe una evaluación con esos mismos datos.');
    if (error) throw error;
    await loadHistory();
    status('Evaluación guardada.');
  });
})();
