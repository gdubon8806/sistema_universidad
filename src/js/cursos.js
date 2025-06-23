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
    const modal = document.getElementById('modal-nuevo-curso');
    const closeBtn = document.getElementById('cerrar-modal-nuevo-curso');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Llenar select de carreras
    fetch('http://localhost:3000/carreras')
        .then(res => res.json())
        .then(carreras => {
            const select = document.getElementById('carrera-curso');
            select.innerHTML = '<option value="">Seleccione una carrera</option>';
            carreras.forEach(carrera => {
                const option = document.createElement('option');
                option.value = carrera.ID_Carrera || carrera.idCarrera;
                option.textContent = carrera.nombre || carrera.Nombre;
                select.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error al cargar carreras:', err);
        });

    // Enviar formulario
    document.getElementById('form-nuevo-curso').addEventListener('submit', async function (e) {
        e.preventDefault();

        const codigo = document.getElementById('codigo-curso').value.trim();
        const nombre = document.getElementById('nombre-curso').value.trim();
        const creditos = document.getElementById('creditos-curso').value;
        const idCarrera = document.getElementById('carrera-curso').value;
        const requisitos = document.getElementById('requisitos-curso').value.trim();

        if (!codigo || !nombre || !creditos || !idCarrera) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/cursos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo,
                    nombre,
                    creditos,
                    idCarrera,
                    requisitos
                })
            });

            if (res.ok) {
                alert('Curso agregado correctamente');
                modal.classList.add('hidden');
                this.reset();
                renderizarTablaCursos();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al agregar el curso');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });

    // Renderizar cursos
    renderizarTablaCursos();
});

async function renderizarTablaCursos() {
    try {
        const res = await fetch('http://localhost:3000/cursos');
        const cursos = await res.json();

        const contenedor = document.getElementById('tabla-cursos-contenedor');
        contenedor.innerHTML = '';

        const tabla = document.createElement('table');
        tabla.className = 'cursos-table';

        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nombre del curso</th>
                    <th>Créditos</th>
                    <th>Carrera</th>
                    <th>Requisitos</th>
                </tr>
            </thead>
            <tbody>
                ${cursos.map(c => `
                    <tr>
                        <td>${c.ID_Curso}</td>
                        <td>${c.Codigo}</td>
                        <td>${c.Nombre}</td>
                        <td>${c.Creditos}</td>
                        <td>${c.Carrera}</td>
                        <td>${c.Requisitos || ''}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar cursos:', error);
    }
}
