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
    
    const abrirModalBtn = document.getElementById('abrir-modal');
    const modal = document.getElementById('modal');
    const cerrarModalBtn = document.getElementById('cerrar-modal');
    const backButton = document.getElementById('back-button');

    // Abrir modal
    abrirModalBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    // Cerrar modal con la X
    cerrarModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Cerrar modal con el botón "Atrás"
    backButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Cerrar modal haciendo click fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Llenar el select de facultades dinámicamente
    fetch('http://localhost:3000/facultades')
        .then(res => res.json())
        .then(facultades => {
            const select = document.getElementById('facultad-carrera');
            // Limpia las opciones excepto la primera
            select.innerHTML = '<option value="" disabled selected>Seleccione una facultad</option>';
            facultades.forEach(facultad => {
                const option = document.createElement('option');
                option.value = facultad.ID_Facultad;
                option.textContent = facultad.Nombre;
                select.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error al cargar facultades:', err);
        });
});

async function renderizarTablaCarreras() {
    const res = await fetch('http://localhost:3000/carreras');
    const carreras = await res.json();
    const contenedor = document.getElementById('tabla-carreras-contenedor');
    contenedor.innerHTML = '';

    const tabla = document.createElement('table');
    tabla.className = 'carreras-table';
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Facultad</th>
            </tr>
        </thead>
        <tbody>
            ${carreras.map(c => `
                <tr class="fila-carrera" data-id="${c.ID_Carrera}" data-nombre="${c.nombre}">
                    <td>${c.codigo}</td>
                    <td>${c.nombre}</td>
                    <td>${c.facultad}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    contenedor.appendChild(tabla);

    // Evento para abrir modal al hacer clic en una carrera
    tabla.querySelectorAll('.fila-carrera').forEach(row => {
        row.addEventListener('click', async function() {
            const idCarrera = this.dataset.id;
            const nombreCarrera = this.dataset.nombre;
            document.getElementById('titulo-cursos-carrera').textContent = `Cursos de la carrera: ${nombreCarrera}`;
            document.getElementById('modal-cursos-carrera').classList.remove('hidden');
            // Cargar cursos asociados
            const resCursos = await fetch(`http://localhost:3000/carreras/${idCarrera}/cursos`);
            const cursos = await resCursos.json();
            const lista = document.getElementById('lista-cursos-carrera');
            if (cursos.length === 0) {
                lista.innerHTML = "<p>No hay cursos asociados a esta carrera.</p>";
            } else {
                lista.innerHTML = `<ul>${cursos.map(c => `<li>${c.Codigo} - ${c.Nombre}</li>`).join('')}</ul>`;
            }
        });
    });
}

// Cerrar modal
document.getElementById('cerrar-modal-cursos-carrera').onclick = function() {
    document.getElementById('modal-cursos-carrera').classList.add('hidden');
};
window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('modal-cursos-carrera')) {
        document.getElementById('modal-cursos-carrera').classList.add('hidden');
    }
});

function agregarCarrera() {
    const form = document.getElementById('form-carrera');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const codigo = document.getElementById('codigo-carrera').value.trim();
        const nombre = document.getElementById('nombre-carrera').value.trim();
        const idFacultad = document.getElementById('facultad-carrera').value;

        if (!codigo || !nombre || !idFacultad) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/carreras', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    codigo,
                    nombre,
                    idFacultad
                })
            });

            if (res.ok) {
                alert('Carrera agregada correctamente');
                document.getElementById('modal').classList.add('hidden');
                form.reset();
                renderizarTablaCarreras();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al agregar la carrera');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });
}

// Llama la función para activar el submit del formulario
agregarCarrera();

renderizarTablaCarreras();