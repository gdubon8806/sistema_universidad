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
                </tr>
            </thead>
            <tbody>
                ${admisiones.map(a => `
                    <tr>
                        <td>${a.estudiante}</td>
                        <td>${a.carrera}</td>
                        <td>${new Date(a.fecha_ingreso).toLocaleDateString()}</td>
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
    document.getElementById('form-nueva-admision').addEventListener('submit', async function(e) {
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
});