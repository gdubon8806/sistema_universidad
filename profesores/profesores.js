const formulario = document.getElementById('form-profesor');
const tabla = document.querySelector('#tabla-profesores tbody');
const filtro = document.getElementById('filtro');

let profesores = [];
let editando = false;
let indexEditando = null;

formulario.addEventListener('submit', function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const especialidad = document.getElementById('especialidad').value.trim();
  const disponibilidad = document.getElementById('disponibilidad').value.trim();

  if (!nombre || !especialidad || !disponibilidad) return;

  if (editando) {
    profesores[indexEditando] = { nombre, especialidad, disponibilidad };
    editando = false;
    indexEditando = null;
  } else {
    profesores.push({ nombre, especialidad, disponibilidad });
  }

  formulario.reset();
  renderTabla();
});

function renderTabla(filtroEspecialidad = '') {
  tabla.innerHTML = '';

  profesores
    .filter(p => p.especialidad.toLowerCase().includes(filtroEspecialidad.toLowerCase()))
    .forEach((profesor, index) => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td>${profesor.nombre}</td>
        <td>${profesor.especialidad}</td>
        <td>${profesor.disponibilidad}</td>
        <td>
          <button onclick="editarProfesor(${index})">Editar</button>
          <button onclick="eliminarProfesor(${index})">Eliminar</button>
        </td>
      `;

      tabla.appendChild(fila);
    });
}

function editarProfesor(index) {
  const profesor = profesores[index];
  document.getElementById('nombre').value = profesor.nombre;
  document.getElementById('especialidad').value = profesor.especialidad;
  document.getElementById('disponibilidad').value = profesor.disponibilidad;

  editando = true;
  indexEditando = index;
}

function eliminarProfesor(index) {
  if (confirm('¿Estás seguro de eliminar este profesor?')) {
    profesores.splice(index, 1);
    renderTabla();
  }
}

filtro.addEventListener('input', function () {
  renderTabla(this.value);
});
