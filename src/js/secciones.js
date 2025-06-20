// filepath: c:\Users\germa\OneDrive\Escritorio\sistema_universidad\src\js\secciones.js
document.addEventListener('DOMContentLoaded', () => {
    // Abrir y cerrar modal
    const openBtn = document.getElementById('abrir-modal');
    const modal = document.getElementById('modal-nueva-seccion');
    const closeBtn = document.getElementById('cerrar-modal-nueva-seccion');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Llenar select de cursos
    fetch('http://localhost:3000/cursos')
        .then(res => res.json())
        .then(cursos => {
            const select = document.getElementById('curso-seccion');
            select.innerHTML = '<option value="">Seleccione un curso</option>';
            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.ID_Curso || curso.idCurso;
                option.textContent = curso.Nombre || curso.nombre;
                select.appendChild(option);
            });
        });

    // Llenar select de profesores
    fetch('http://localhost:3000/profesores')
        .then(res => res.json())
        .then(profesores => {
            const select = document.getElementById('profesor-seccion');
            select.innerHTML = '<option value="">Seleccione un profesor</option>';
            profesores.forEach(profesor => {
                const option = document.createElement('option');
                option.value = profesor.ID_Profesor || profesor.idProfesor;
                option.textContent = `${profesor.Nombre} ${profesor.Apellido}`;
                select.appendChild(option);
            });
        });

    // Llenar select de aulas
    fetch('http://localhost:3000/aulas')
        .then(res => res.json())
        .then(aulas => {
            const select = document.getElementById('aula-seccion');
            select.innerHTML = '<option value="">Seleccione un aula</option>';
            aulas.forEach(aula => {
                const option = document.createElement('option');
                option.value = aula.ID_Aula || aula.idAula;
                option.textContent = aula.Nombre_Aula || aula.nombreAula;
                select.appendChild(option);
            });
        });

    // Enviar formulario para agregar sección
    document.getElementById('form-nueva-seccion').addEventListener('submit', async function(e) {
        e.preventDefault();

        const codigo = document.getElementById('codigo-seccion').value.trim();
        const idCurso = document.getElementById('curso-seccion').value;
        const modalidad = document.getElementById('modalidad-seccion').value;
        const idProfesor = document.getElementById('profesor-seccion').value;
        const idAula = document.getElementById('aula-seccion').value;
        const hora = document.getElementById('hora-seccion').value.trim();
        const dias = document.getElementById('dias-seccion').value.trim();
        const cupos = document.getElementById('cupos-seccion').value;

        if (!codigo || !idCurso || !modalidad || !idProfesor || !idAula || !hora || !dias || !cupos) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/secciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo,
                    idCurso,
                    modalidad,
                    idProfesor,
                    idAula,
                    hora,
                    dias,
                    cupos
                })
            });

            if (res.ok) {
                alert('Sección agregada correctamente');
                modal.classList.add('hidden');
                this.reset();
                renderizarTablaSecciones();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al agregar la sección');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });

    async function renderizarTablaSecciones() {
        try {
            const res = await fetch('http://localhost:3000/secciones');
            const secciones = await res.json();

            const contenedor = document.getElementById('tabla-secciones-contenedor');
            contenedor.innerHTML = '';

            const tabla = document.createElement('table');
            tabla.className = 'secciones-table';

            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Curso</th>
                        <th>Modalidad</th>
                        <th>Profesor</th>
                        <th>Aula</th>
                        <th>Hora</th>
                        <th>Días</th>
                        <th>Cupos</th>
                    </tr>
                </thead>
                <tbody>
                    ${secciones.map(s => `
                        <tr>
                            <td>${s.ID_Seccion}</td>
                            <td>${s.Codigo}</td>
                            <td>${s.Curso}</td>
                            <td>${s.Modalidad}</td>
                            <td>${s.Profesor}</td>
                            <td>${s.Aula}</td>
                            <td>${s.Hora}</td>
                            <td>${s.Dias}</td>
                            <td>${s.Cupos}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            contenedor.appendChild(tabla);
        } catch (error) {
            console.error('Error al cargar secciones:', error);
        }
    }

    // Llama la función al cargar la página
    renderizarTablaSecciones();
});