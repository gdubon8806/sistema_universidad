// Ejemplo de función para renderizar la tabla de admisiones
async function renderizarTablaAdmisiones() {
    try {
        const res = await fetch('http://localhost:3000/admisiones');
        const admisiones = await res.json();

        const contenedor = document.getElementById('tabla-admisiones-contenedor');
        contenedor.innerHTML = '';

        let tabla = document.createElement('table');
        tabla.className = 'admisiones-table';

        // Encabezado
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>Nombre de estudiante</th>
                    <th>Carrera</th>
                    <th>Fecha de ingreso</th>
                    <th>Activo</th> <!-- Nueva columna -->
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${admisiones.map(admision => `
                    <tr>
                        <td>${admision.estudiante}</td>
                        <td>${admision.carrera}</td>
                        <td>${new Date(admision.fecha_ingreso).toLocaleDateString()}</td>
                        <td>${admision.Activo ? 'Sí' : 'No'}</td> <!-- Valor de Activo -->
                        <td>
                          ${admision.Activo ? `<button class="btn-inactivar-admision" data-id="${admision.ID_Admision}" data-id-estudiante="${admision.ID_Estudiante}">Inactivar</button>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar las admisiones:', error);
    }
}

// Llama la función al cargar la página
renderizarTablaAdmisiones();

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
    const openBtn = document.getElementById('openModal');
    const modal = document.getElementById('modal-nueva-admision');
    const closeBtn = document.getElementById('cerrar-modal-nueva-admision');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Llenar select de carreras dinámicamente
    fetch('http://localhost:3000/carreras')
        .then(res => res.json())
        .then(carreras => {
            const select = document.getElementById('carrera-alumno');
            select.innerHTML = '<option value="">Seleccione una carrera</option>';
            carreras.forEach(carrera => {
                // Usa SIEMPRE el ID numérico
                const option = document.createElement('option');
                option.value = carrera.ID_Carrera || carrera.idCarrera; // <-- SOLO el ID numérico
                option.textContent = carrera.nombre || carrera.Nombre;
                select.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error al cargar carreras:', err);
        });

    // Enviar formulario de admisión
    document.getElementById('form-nueva-admision').addEventListener('submit', async function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre-alumno').value.trim();
        const apellido = document.getElementById('apellido-alumno').value.trim();
        const dni = document.getElementById('dni-alumno').value.trim();
        const correo = document.getElementById('email-alumno').value.trim();
        const telefono = document.getElementById('tel-alumno').value.trim();
        const fechaNacimiento = document.getElementById('fecha-nacimiento-alumno').value;
        const idCarrera = document.getElementById('carrera-alumno').value;
        const fechaIngreso = new Date().toISOString().split('T')[0]; // Fecha actual

        if (!nombre || !apellido || !dni || !correo || !fechaNacimiento || !idCarrera) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/admisiones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    dni,
                    correo,
                    telefono,
                    fechaNacimiento,
                    idCarrera,
                    fechaIngreso
                })
            });

            if (res.ok) {
                alert('Admisión creada correctamente');
                modal.classList.add('hidden');
                this.reset();
                // Si tienes función para recargar la tabla, llama aquí
                renderizarTablaAdmisiones();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al crear la admisión');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });

    // Delegación para botón Inactivar admisión
    document.getElementById('tabla-admisiones-contenedor').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-inactivar-admision')) {
            document.getElementById('id-admision-inactivar').value = e.target.getAttribute('data-id');
            document.getElementById('id-estudiante-inactivar').value = e.target.getAttribute('data-id-estudiante');
            document.getElementById('motivo-inactivar-admision').value = '';
            document.getElementById('modal-inactivar-admision').classList.remove('hidden');
        }
    });

    document.getElementById('cerrar-modal-inactivar-admision').onclick = function() {
        document.getElementById('modal-inactivar-admision').classList.add('hidden');
    };

    document.getElementById('form-inactivar-admision').addEventListener('submit', async function(e) {
        e.preventDefault();
        const idAdmision = document.getElementById('id-admision-inactivar').value;
        const idEstudiante = document.getElementById('id-estudiante-inactivar').value;
        const motivo = document.getElementById('motivo-inactivar-admision').value.trim();
        if (!motivo) {
            alert('Debes ingresar un motivo.');
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/admisiones/${idAdmision}/inactivar`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motivo, idEstudiante })
            });
            if (res.ok) {
                alert('Admisión y datos asociados inactivados correctamente');
                document.getElementById('modal-inactivar-admision').classList.add('hidden');
                renderizarTablaAdmisiones();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al inactivar admisión');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });
});