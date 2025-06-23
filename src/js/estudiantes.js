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

// 🔄 Renderizar tabla de estudiantes
async function renderizarTablaEstudiantes() {
    try {
        const res = await fetch('http://localhost:3000/estudiantes');
        const estudiantes = await res.json();

        const contenedor = document.getElementById('estudiantes-contenedor');
        contenedor.innerHTML = '';

        const tabla = document.createElement('table');
        tabla.className = 'estudiantes-table';

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
                    <tr>
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

// 👆 Cargar datos en modal de actualización
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

// ❌ Cerrar modal
document.getElementById('cerrar-modal-actualizar-estudiante').onclick = function() {
    document.getElementById('modal-actualizar-estudiante').classList.add('hidden');
};
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('modal-actualizar-estudiante')) {
        document.getElementById('modal-actualizar-estudiante').classList.add('hidden');
    }
});

// 💾 Enviar actualización
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
