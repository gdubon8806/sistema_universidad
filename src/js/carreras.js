document.addEventListener('DOMContentLoaded', () => {
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
    try {
        const res = await fetch('http://localhost:3000/carreras');
        const carreras = await res.json();
        console.log(carreras);
        const contenedor = document.getElementById('tabla-carreras-contenedor');
        contenedor.innerHTML = ''; // Limpia el contenedor

        let tabla = document.createElement('table');
        tabla.id = 'tabla-carreras';
        tabla.className = 'carreras-table';

        // Encabezado
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Código carrera</th>
                <th>Nombre de carrera</th>
                <th>Nombre de facultad</th>
            </tr>
        `;
        tabla.appendChild(thead);

        // Cuerpo
        const tbody = document.createElement('tbody');
        carreras.forEach(carrera => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${carrera.codigo}</td>
                <td>${carrera.nombre}</td>
                <td>${carrera.facultad}</td>
            `;
            tbody.appendChild(tr);
        });
        tabla.appendChild(tbody);

        contenedor.appendChild(tabla);
    } catch (error) {
        console.error('Error al cargar las carreras:', error);
    }
}

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