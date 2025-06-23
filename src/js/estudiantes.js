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

    renderizarTablaEstudiantes();
});

async function renderizarTablaEstudiantes() {
    try {
        const res = await fetch('http://localhost:3000/estudiantes');
        const estudiantes = await res.json();

        const contenedor = document.getElementById('estudiantes-contenedor');
        contenedor.innerHTML = '';

        const tabla = document.createElement('table');
        tabla.className = 'estudiantes-table';
        console.log(estudiantes);

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Fecha Nacimiento</th>
                    <th>Carrera</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${estudiantes.map(e => `
                    <tr data-id-estudiante="${e.ID_Estudiante}" data-nombre-estudiante="${e.Nombres}">
                        <td>${e.ID_Estudiante}</td>
                        <td>${e.Nombres}</td>
                        <td>${e.Apellidos}</td>
                        <td>${e.DNI}</td>
                        <td>${e.Correo_Electronico || ''}</td>
                        <td>${e.Telefono || ''}</td>
                        <td>${e.Fecha_Nacimiento ? e.Fecha_Nacimiento.split('T')[0] : ''}</td>
                        <td>${e.Carrera || ''}</td>
                        <td>
                            <button class="btn-actualizar-estudiante" 
                                data-id="${e.ID_Estudiante}"
                                data-nombres="${e.Nombres}"
                                data-apellidos="${e.Apellidos}"
                                data-dni="${e.DNI}"
                                data-correo="${e.Correo_Electronico || ''}"
                                data-telefono="${e.Telefono || ''}"
                                data-fecha="${e.Fecha_Nacimiento ? e.Fecha_Nacimiento.split('T')[0] : ''}"
                                data-carrera="${e.ID_Carrera || ''}">
                                Actualizar
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }
}

// Llama la función al cargar la página
document.addEventListener('DOMContentLoaded', renderizarTablaEstudiantes);

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-actualizar-estudiante')) {
        const btn = e.target;
        document.getElementById('actualizar-id-estudiante').value = btn.dataset.id;
        document.getElementById('actualizar-nombre-estudiante').value = btn.dataset.nombres;
        document.getElementById('actualizar-apellido-estudiante').value = btn.dataset.apellidos;
        document.getElementById('actualizar-dni-estudiante').value = btn.dataset.dni;
        document.getElementById('actualizar-correo-estudiante').value = btn.dataset.correo;
        document.getElementById('actualizar-telefono-estudiante').value = btn.dataset.telefono;
        document.getElementById('actualizar-fecha-nacimiento-estudiante').value = btn.dataset.fecha;
        document.getElementById('modal-actualizar-estudiante').classList.remove('hidden');
    }
});

// Cerrar modal
document.getElementById('cerrar-modal-actualizar-estudiante').onclick = function() {
    document.getElementById('modal-actualizar-estudiante').classList.add('hidden');
};
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('modal-actualizar-estudiante')) {
        document.getElementById('modal-actualizar-estudiante').classList.add('hidden');
    }
});

// Enviar actualización
document.getElementById('form-actualizar-estudiante').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('actualizar-id-estudiante').value;
    const nombres = document.getElementById('actualizar-nombre-estudiante').value.trim();
    const apellidos = document.getElementById('actualizar-apellido-estudiante').value.trim();
    const dni = document.getElementById('actualizar-dni-estudiante').value.trim();
    const correo = document.getElementById('actualizar-correo-estudiante').value.trim();
    const telefono = document.getElementById('actualizar-telefono-estudiante').value.trim();
    const fechaNacimiento = document.getElementById('actualizar-fecha-nacimiento-estudiante').value;

    try {
        const res = await fetch(`http://localhost:3000/estudiantes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombres,
                apellidos,
                dni,
                correo,
                telefono,
                fechaNacimiento
            })
        });
        if (res.ok) {
            alert('Estudiante actualizado correctamente');
            document.getElementById('modal-actualizar-estudiante').classList.add('hidden');
            renderizarTablaEstudiantes();
        } else {
            const data = await res.json();
            alert(data.error || 'Error al actualizar');
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
        console.error(error);
    }
});

// Evento para abrir historial al hacer clic en una fila
document.addEventListener('DOMContentLoaded', () => {
    // Delegación de evento para filas de estudiantes
    document.getElementById('estudiantes-contenedor').addEventListener('click', async function(e) {
        const fila = e.target.closest('tr[data-id-estudiante]');
        if (fila) {
            const idEstudiante = fila.getAttribute('data-id-estudiante');
            const nombre = fila.getAttribute('data-nombre-estudiante');
            document.getElementById('titulo-historial-estudiante').textContent = `Historial Académico de ${nombre}`;
            document.getElementById('modal-historial-estudiante').classList.remove('hidden');
            // Cargar historial
            try {
                const res = await fetch(`http://localhost:3000/estudiantes/${idEstudiante}/historial`);
                const historial = await res.json();
                if (!historial.length) {
                    document.getElementById('historial-estudiante-contenido').innerHTML = "<p>No hay calificaciones registradas.</p>";
                } else {
                    document.getElementById('historial-estudiante-contenido').innerHTML = `
                        <table>
                            <thead>
                                <tr>
                                    <th>Edificio</th>
                                    <th>Año</th>
                                    <th>Periodo</th>
                                    <th>Sección</th>
                                    <th>Código Clase</th>
                                    <th>Nombre Clase</th>
                                    <th>Nota</th>
                                    <th>Estado</th>
                                    <th>UV</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${historial.map(h => `
                                    <tr>
                                        <td>${h.Edificio || ''}</td>
                                        <td>${h.Anio || ''}</td>
                                        <td>${h.Periodo || ''}</td>
                                        <td>${h.Seccion || ''}</td>
                                        <td>${h.CodigoClase || ''}</td>
                                        <td>${h.NombreClase || ''}</td>
                                        <td>${h.Nota}</td>
                                        <td>${h.Estado}</td>
                                        <td>${h.Creditos}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
                }
            } catch (error) {
                document.getElementById('historial-estudiante-contenido').innerHTML = "<p>Error al cargar historial.</p>";
            }
        }
    });

    // Cerrar modal
    document.getElementById('cerrar-modal-historial-estudiante').onclick = function() {
        document.getElementById('modal-historial-estudiante').classList.add('hidden');
    };
    window.addEventListener('click', function(e) {
        if (e.target === document.getElementById('modal-historial-estudiante')) {
            document.getElementById('modal-historial-estudiante').classList.add('hidden');
        }
    });
});