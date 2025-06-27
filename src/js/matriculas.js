document.addEventListener('DOMContentLoaded', () => {
    protegerRuta();

    // Botón cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../../pages/Login/index.html';
        });
    }
    // Abrir y cerrar modal
    const openBtn = document.getElementById('abrir-modal');
    const modal = document.getElementById('modal-nueva-matricula');
    const closeBtn = document.getElementById('cerrar-modal-nueva-matricula');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }



    // Enviar formulario para agregar matrícula
    document.getElementById('form-nueva-matricula').addEventListener('submit', async function (e) {
        e.preventDefault();

        const fecha = document.getElementById('fecha-matricula').value;
        if (!fecha || !estudianteSeleccionado || !periodoActivo) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Recolectar secciones seleccionadas
        const seccionesSeleccionadas = [];
        document.querySelectorAll('#cursos-disponibles-contenedor select').forEach(select => {
            if (select.value) {
                seccionesSeleccionadas.push(select.value);
            }
        });

        if (seccionesSeleccionadas.length === 0) {
            alert('Debes seleccionar al menos una sección.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/matriculas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha,
                    idEstudiante: estudianteSeleccionado,
                    idPeriodo: periodoActivo.ID_Periodo,
                    secciones: seccionesSeleccionadas
                })
            });

            if (res.ok) {
                alert('Matrícula agregada correctamente');
                document.getElementById('modal-nueva-matricula').classList.add('hidden');
                this.reset();
                renderizarTablaMatriculas();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al agregar la matrícula');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });
});

async function renderizarTablaMatriculas() {
    try {
        const res = await fetch('http://localhost:3000/matriculas');
        const matriculas = await res.json();

        const contenedor = document.getElementById('matriculas-contenedor');
        contenedor.innerHTML = '';

        const tabla = document.createElement('table');
        tabla.className = 'matriculas-table';

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Estudiante</th>
                    <th>DNI</th>
                    <th>Sección</th>
                    <th>Curso</th>
                    <th>Periodo Académico</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${matriculas.map(m => `
                    <tr>
                        <td>${m.ID_Matricula}</td>
                        <td>${m.Fecha_Matricula ? m.Fecha_Matricula.split('T')[0] : ''}</td>
                        <td>${m.Estudiante}</td>
                        <td>${m.DNI}</td>
                        <td>${m.Seccion}</td>
                        <td>${m.Curso}</td>
                        <td>${m.Nombre}</td>
                        <td>${m.Activo ? 'Sí' : 'No'}</td>
                        <td>
                            ${m.Activo ? `<button class="btn-inactivar" data-id="${m.ID_Matricula}">Inactivar</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar matrículas:', error);
    }
}

// Llama la función al cargar la página
document.addEventListener('DOMContentLoaded', renderizarTablaMatriculas);

// async function llenarSelectSecciones(idEstudiante, idPeriodo) {
//     if (!idEstudiante || !idPeriodo) return;
//     try {
//         const res = await fetch(`http://localhost:3000/secciones-disponibles?idEstudiante=${idEstudiante}&idPeriodo=${idPeriodo}`);
//         const secciones = await res.json();
//         const select = document.getElementById('seccion-matricula');
//         select.innerHTML = '<option value="">Seleccione una sección</option>';
//         secciones.forEach(s => {
//             select.innerHTML += `<option value="${s.ID_Seccion}">${s.Codigo} - ${s.Modalidad} - ${s.Hora} (${s.Nombre_Curso})</option>`;
//         });
//     } catch (error) {
//         console.error('Error al cargar secciones disponibles:', error);
//     }
// }


document.getElementById('abrir-modal').addEventListener('click', async function () {
    document.getElementById('modal-seleccionar-estudiante').classList.remove('hidden');
    // Llenar selector de estudiantes
    const select = document.getElementById('selector-estudiante-matricula');
    select.innerHTML = '<option value="">Seleccione un estudiante</option>';
    const res = await fetch('http://localhost:3000/estudiantes');
    const estudiantes = await res.json();
    estudiantes
        .filter(e => e.Activo) // Solo activos
        .forEach(e => {
            const option = document.createElement('option');
            option.value = e.ID_Estudiante;
            option.textContent = `${e.Nombres} ${e.Apellidos} (${e.DNI})`;
            select.appendChild(option);
        });
    document.getElementById('mensaje-matricula-existe').textContent = '';
    document.getElementById('continuar-matricula').disabled = true;
});

// Cerrar modales
document.getElementById('cerrar-modal-seleccionar-estudiante').onclick = function () {
    document.getElementById('modal-seleccionar-estudiante').classList.add('hidden');
};
document.getElementById('cerrar-modal-nueva-matricula').onclick = function () {
    document.getElementById('modal-nueva-matricula').classList.add('hidden');
};

// Verificar matrícula al seleccionar estudiante
document.getElementById('selector-estudiante-matricula').addEventListener('change', async function () {
    const idEstudiante = this.value;
    const mensaje = document.getElementById('mensaje-matricula-existe');
    const btnContinuar = document.getElementById('continuar-matricula');
    mensaje.textContent = '';
    btnContinuar.disabled = false;
    // if (idEstudiante) {
    //     const res = await fetch(`http://localhost:3000/matricula-existe?idEstudiante=${idEstudiante}`);
    //     const data = await res.json();
    //     console.log(data);
    //     if (data.existe) {
    //         mensaje.textContent = 'Ya matriculó este periodo.';
    //     } else {
    //         mensaje.textContent = '';
    //         btnContinuar.disabled = false;
    //     }
    // }
});

// Al dar continuar, abrir el modal de matrícula
document.getElementById('continuar-matricula').addEventListener('click', async function () {
    const idEstudiante = document.getElementById('selector-estudiante-matricula').value;
    if (!idEstudiante) return;
    estudianteSeleccionado = idEstudiante;
    console.log('Estudiante seleccionado:', estudianteSeleccionado);

    // Obtener periodo académico activo
    const res = await fetch('http://localhost:3000/periodo-academico-activo');
    const periodo = await res.json();
    periodoActivo = periodo;

    document.getElementById('modal-seleccionar-estudiante').classList.add('hidden');
    document.getElementById('modal-nueva-matricula').classList.remove('hidden');
    document.getElementById('encabezado-matricula').textContent = `Matrícula de periodo académico "${periodo.Nombre}"`;

    // Llenar secciones disponibles para este estudiante y periodo
    // llenarSelectSecciones(estudianteSeleccionado, periodoActivo.ID_Periodo);
    mostrarCursosYSecciones(estudianteSeleccionado, periodoActivo.ID_Periodo);
});

async function mostrarCursosYSecciones(idEstudiante, idPeriodo) {
    const contenedor = document.getElementById('cursos-disponibles-contenedor');
    contenedor.innerHTML = '<p>Cargando cursos...</p>';
    try {
        const res = await fetch(`http://localhost:3000/cursos-disponibles-con-secciones?idEstudiante=${idEstudiante}&idPeriodo=${idPeriodo}`);
        const cursos = await res.json();
        if (!cursos.length) {
            contenedor.innerHTML = '<p>No hay cursos disponibles para matricular en este periodo.</p>';
            return;
        }
        contenedor.innerHTML = '';
        cursos.forEach(curso => {
            const div = document.createElement('div');
            div.className = 'curso-matricula-item';
            div.innerHTML = `
                <label><strong>${curso.Codigo} - ${curso.Nombre}</strong></label>
                <select name="seccion-curso-${curso.ID_Curso}" data-id-curso="${curso.ID_Curso}">
                    <option value="">Seleccione una sección</option>
                    ${curso.secciones.map(s => `
                        <option value="${s.ID_Seccion}">${s.Codigo} - ${s.Modalidad} - ${s.Hora}</option>
                    `).join('')}
                </select>
            `;
            contenedor.appendChild(div);
        });
    } catch (error) {
        contenedor.innerHTML = '<p>Error al cargar cursos disponibles.</p>';
        console.error(error);
    }
}

let estudianteSeleccionado = null;
let periodoActivo = null;

// Delegación para botón Inactivar
document.getElementById('matriculas-contenedor').addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-inactivar')) {
        const id = e.target.getAttribute('data-id');
        document.getElementById('id-matricula-inactivar').value = id;
        document.getElementById('motivo-inactivar').value = '';
        document.getElementById('modal-inactivar-matricula').classList.remove('hidden');
    }
});

// Cerrar modal
document.getElementById('cerrar-modal-inactivar-matricula').onclick = function () {
    document.getElementById('modal-inactivar-matricula').classList.add('hidden');
};

// Enviar motivo de inactivación
document.getElementById('form-inactivar-matricula').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('id-matricula-inactivar').value;

    const motivo = document.getElementById('motivo-inactivar').value.trim();
    if (!motivo) {
        alert('Debes ingresar un motivo.');
        return;
    }
    try {
        const res = await fetch(`http://localhost:3000/matriculas/${id}/inactivar`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motivo })
        });
        if (res.ok) {
            alert('Matrícula inactivada correctamente');
            document.getElementById('modal-inactivar-matricula').classList.add('hidden');
            renderizarTablaMatriculas();
        } else {
            const data = await res.json();
            alert(data.error || 'Error al inactivar matrícula');
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
        console.error(error);
    }
});