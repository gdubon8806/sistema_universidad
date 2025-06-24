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
    const openBtn = document.getElementById('abrir-modal-calificacion');
    const modal = document.getElementById('modal-nueva-calificacion');
    const closeBtn = document.getElementById('cerrar-modal-nueva-calificacion');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => {
            llenarSelectMatriculas(); // <-- Solo aquí
            modal.classList.remove('hidden')
        });
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Llenar select de matrículas (estudiante + sección)
    llenarSelectMatriculas();

    // Enviar formulario para agregar calificación
    document.getElementById('form-nueva-calificacion').addEventListener('submit', async function (e) {
        e.preventDefault();

        const idMatricula = document.getElementById('matricula-calificacion').value;
        const nota = document.getElementById('nota-calificacion').value;
        const fecha = document.getElementById('fecha-calificacion').value;

        if (!idMatricula || !nota) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/calificaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idMatricula,
                    nota,
                    fecha
                })
            });

            if (res.ok) {
                alert('Calificación agregada correctamente');
                modal.classList.add('hidden');
                this.reset();
                // Si tienes función para recargar la tabla, llama aquí
                renderizarTablaCalificaciones();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al agregar la calificación');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });
});

async function llenarSelectMatriculas() {
    const res = await fetch('http://localhost:3000/matriculas');
    const matriculas = await res.json();
    const calRes = await fetch('http://localhost:3000/calificaciones');
    const calificaciones = await calRes.json();

    // IDs de matrículas que ya tienen calificación activa
    const matriculasConCalificacion = new Set(
        calificaciones
            .filter(c => c.Activo) // solo activas
            .map(c => c.ID_Matricula)
    );

    const select = document.getElementById('matricula-calificacion');
    select.innerHTML = '<option value="">Seleccione una matrícula</option>';
    matriculas
        .filter(m => m.Activo && !matriculasConCalificacion.has(m.ID_Matricula))
        .forEach(m => {
            select.innerHTML += `<option value="${m.ID_Matricula}">${m.Estudiante} - ${m.Seccion} (${m.Curso})</option>`;
        });
}

async function renderizarTablaCalificaciones() {
    try {
        const res = await fetch('http://localhost:3000/calificaciones');
        const calificaciones = await res.json();
        console.log(calificaciones)

        const contenedor = document.getElementById('calificaciones-contenedor');
        contenedor.innerHTML = '';

        const tabla = document.createElement('table');
        tabla.className = 'calificaciones-table';

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Estudiante</th>
                    <th>DNI</th>
                    <th>Curso</th>
                    <th>Sección</th>
                    <th>Nota</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Activo</th> <!-- Nueva columna -->
                </tr>
            </thead>
            <tbody>
                ${calificaciones.map(c => `
                    <tr>
                        <td>${c.ID_Calificacion}</td>
                        <td>${c.Estudiante}</td>
                        <td>${c.DNI}</td>
                        <td>${c.Curso}</td>
                        <td>${c.Seccion}</td>
                        <td>${c.Nota}</td>
                        <td>${c.Estado}</td>
                        <td>${c.Fecha_Registro ? c.Fecha_Registro.split('T')[0] : ''}</td>
                        <td>${c.Activo ? 'Sí' : 'No'}</td> <!-- Valor de Activo -->
                    </tr>
                `).join('')}
            </tbody>
        `;

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar calificaciones:', error);
    }
}

// Llama la función al cargar la página
document.addEventListener('DOMContentLoaded', renderizarTablaCalificaciones);