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

    // // Llenar select de carreras dinámicamente
    // fetch('http://localhost:3000/carreras')
    //     .then(res => res.json())
    //     .then(carreras => {
    //         const select = document.getElementById('carrera-curso');
    //         select.innerHTML = '<option value="">Seleccione una carrera</option>';
    //         carreras.forEach(carrera => {
    //             const option = document.createElement('option');
    //             option.value = carrera.ID_Carrera || carrera.idCarrera;
    //             option.textContent = carrera.nombre || carrera.Nombre;
    //             select.appendChild(option);
    //         });
    //     })
    //     .catch(err => {
    //         console.error('Error al cargar carreras:', err);
    //     });

    // Enviar formulario para agregar curso
    document.getElementById('form-nuevo-curso').addEventListener('submit', async function (e) {
        e.preventDefault();

        const codigo = document.getElementById('codigo-curso').value.trim();
        const nombre = document.getElementById('nombre-curso').value.trim();
        const creditos = document.getElementById('creditos-curso').value;
        const requisitos = document.getElementById('requisitos-curso').value.trim();

        if (!codigo || !nombre || !creditos) {
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

    // Función para renderizar la tabla de cursos
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

    // Llama la función al cargar la página
    renderizarTablaCursos();

    // Asociar curso a carrera
    document.getElementById('abrir-modal-asociar').onclick = function () {
        document.getElementById('modal-asociar-curso-carrera').classList.remove('hidden');

        // Llenar cursos
        fetch('http://localhost:3000/cursos')
            .then(res => res.json())
            .then(cursos => {
                const select = document.getElementById('select-curso');
                select.innerHTML = '<option value="">Seleccione un curso</option>';
                cursos.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.ID_Curso;
                    option.textContent = `${c.Codigo} - ${c.Nombre}`;
                    select.appendChild(option);
                });
            });

        // Llenar carreras
        fetch('http://localhost:3000/carreras')
            .then(res => res.json())
            .then(carreras => {
                const select = document.getElementById('carrera-curso');
                console.log(select);    
                select.innerHTML = '<option value="">Seleccione una carrera</option>';
                console.log(carreras);
                carreras.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.ID_Carrera;
                    option.textContent = c.nombre;
                    select.appendChild(option);
                });
            });
    };

    document.getElementById('cerrar-modal-asociar').onclick = function () {
        document.getElementById('modal-asociar-curso-carrera').classList.add('hidden');
    };
    window.addEventListener('click', function (e) {
        if (e.target === document.getElementById('modal-asociar-curso-carrera')) {
            document.getElementById('modal-asociar-curso-carrera').classList.add('hidden');
        }
    });

    // Enviar asociación
    document.getElementById('form-asociar-curso-carrera').addEventListener('submit', async function (e) {
        e.preventDefault();
        const idCurso = document.getElementById('select-curso').value;
        const idCarrera = document.getElementById('carrera-curso').value;
        if (!idCurso || !idCarrera) {
            alert('Seleccione ambos campos.');
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/cursos-carreras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idCurso, idCarrera })
            });
            if (res.ok) {
                alert('Curso asociado correctamente');
                document.getElementById('modal-asociar-curso-carrera').classList.add('hidden');
                this.reset();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al asociar');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });
});