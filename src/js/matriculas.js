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

    // 🪟 Modal
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

    // 📥 Llenar estudiantes
    fetch('http://localhost:3000/estudiantes')
        .then(res => res.json())
        .then(estudiantes => {
            const select = document.getElementById('estudiante-matricula');
            select.innerHTML = '<option value="">Seleccione un estudiante</option>';
            estudiantes.forEach(e => {
                const option = document.createElement('option');
                option.value = e.ID_Estudiante;
                option.textContent = `${e.Nombres} ${e.Apellidos} (${e.DNI})`;
                select.appendChild(option);
            });
        });

    // 📥 Llenar secciones
    fetch('http://localhost:3000/secciones')
        .then(res => res.json())
        .then(secciones => {
            const select = document.getElementById('seccion-matricula');
            select.innerHTML = '<option value="">Seleccione una sección</option>';
            secciones.forEach(s => {
                const option = document.createElement('option');
                option.value = s.ID_Seccion;
                option.textContent = `${s.Codigo} - ${s.Curso}`;
                select.appendChild(option);
            });
        });

    // ➕ Enviar matrícula
    document.getElementById('form-nueva-matricula').addEventListener('submit', async function (e) {
        e.preventDefault();

        const fecha = document.getElementById('fecha-matricula').value;
        const idEstudiante = document.getElementById('estudiante-matricula').value;
        const idSeccion = document.getElementById('seccion-matricula').value;

        if (!fecha || !idEstudiante || !idSeccion) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/matriculas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fecha, idEstudiante, idSeccion })
            });

            if (res.ok) {
                alert('Matrícula agregada correctamente');
                modal.classList.add('hidden');
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

    renderizarTablaMatriculas();
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
                </tr>
            </thead>
            <tbody>
                ${matriculas.map(m => `
                    <tr>
                        <td>${m.ID_Matricula}</td>
                        <td>${formatearFecha(m.Fecha_Matricula)}</td>
                        <td>${m.Estudiante}</td>
                        <td>${m.DNI}</td>
                        <td>${m.Seccion}</td>
                        <td>${m.Curso}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar matrículas:', error);
    }
}
