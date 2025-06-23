document.addEventListener('DOMContentLoaded', () => {
    protegerRuta();

    // Botón cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../../pages/Login/index.html';
        });
    
    renderizarTablaProfesores();
}
    // Abrir y cerrar modal para nuevo profesor
    const openBtn = document.getElementById('openModalProfesor');
    const modal = document.getElementById('modal-nuevo-profesor');
    const closeBtn = document.getElementById('cerrar-modal-nuevo-profesor');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Enviar formulario para agregar profesor
    document.getElementById('form-nuevo-profesor').addEventListener('submit', async function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre-profesor').value.trim();
        const apellido = document.getElementById('apellido-profesor').value.trim();
        const dni = document.getElementById('dni-profesor').value.trim();
        const correo = document.getElementById('correo-profesor').value.trim();
        const telefono = document.getElementById('telefono-profesor').value.trim();

        if (!nombre || !apellido || !dni || !correo || !telefono) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/profesores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    dni,
                    correo,
                    telefono
                })
            });

            if (res.ok) {
                alert('Profesor agregado correctamente');
                modal.classList.add('hidden');
                this.reset();
                renderizarTablaProfesores();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al agregar el profesor');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });
});

// Función para renderizar la tabla de profesores
async function renderizarTablaProfesores() {
    try {
        const res = await fetch('http://localhost:3000/profesores');
        const profesores = await res.json();

        const contenedor = document.getElementById('tabla-profesores-contenedor');
        contenedor.innerHTML = '';

        const tabla = document.createElement('table');
        tabla.className = 'profesores-table';

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${profesores.map(p => `
                    <tr>
                        <td>${p.ID_Profesor}</td>
                        <td>${p.Nombre}</td>
                        <td>${p.Apellido}</td>
                        <td>${p.DNI}</td>
                        <td>${p.Correo_Electronico || ''}</td>
                        <td>${p.Telefono || ''}</td>
                        <td>
                            <button class="btn-actualizar-profesor"
                                data-id="${p.ID_Profesor}"
                                data-nombre="${p.Nombre}"
                                data-apellido="${p.Apellido}"
                                data-dni="${p.DNI}"
                                data-correo="${p.Correo_Electronico || ''}"
                                data-telefono="${p.Telefono || ''}">
                                Actualizar
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar profesores:', error);
    }
}

// Abrir modal y llenar datos para actualizar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-actualizar-profesor')) {
        const btn = e.target;
        document.getElementById('actualizar-id-profesor').value = btn.dataset.id;
        document.getElementById('actualizar-nombre-profesor').value = btn.dataset.nombre;
        document.getElementById('actualizar-apellido-profesor').value = btn.dataset.apellido;
        document.getElementById('actualizar-dni-profesor').value = btn.dataset.dni;
        document.getElementById('actualizar-correo-profesor').value = btn.dataset.correo;
        document.getElementById('actualizar-telefono-profesor').value = btn.dataset.telefono;
        document.getElementById('modal-actualizar-profesor').classList.remove('hidden');
    }
});

// Cerrar modal de actualizar
document.getElementById('cerrar-modal-actualizar-profesor').onclick = function() {
    document.getElementById('modal-actualizar-profesor').classList.add('hidden');
};
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('modal-actualizar-profesor')) {
        document.getElementById('modal-actualizar-profesor').classList.add('hidden');
    }
});

// Enviar actualización
document.getElementById('form-actualizar-profesor').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('actualizar-id-profesor').value;
    const nombre = document.getElementById('actualizar-nombre-profesor').value.trim();
    const apellido = document.getElementById('actualizar-apellido-profesor').value.trim();
    const dni = document.getElementById('actualizar-dni-profesor').value.trim();
    const correo = document.getElementById('actualizar-correo-profesor').value.trim();
    const telefono = document.getElementById('actualizar-telefono-profesor').value.trim();

    try {
        const res = await fetch(`http://localhost:3000/profesores/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                apellido,
                dni,
                correo,
                telefono
            })
        });
        if (res.ok) {
            alert('Profesor actualizado correctamente');
            document.getElementById('modal-actualizar-profesor').classList.add('hidden');
            renderizarTablaProfesores();
        } else {
            const data = await res.json();
            alert(data.error || 'Error al actualizar');
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
        console.error(error);
    }
});
