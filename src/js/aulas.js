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
    const modal = document.getElementById('modal-nueva-aula');
    const closeBtn = document.getElementById('cerrar-modal-nueva-aula');

    if (openBtn && modal && closeBtn) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    // Llenar select de edificios dinámicamente
    fetch('http://localhost:3000/edificios')
        .then(res => res.json())
        .then(edificios => {
            const select = document.getElementById('edificio-aula');
            select.innerHTML = '<option value="">Seleccione un edificio</option>';
            edificios.forEach(edificio => {
                const option = document.createElement('option');
                option.value = edificio.ID_Edificio || edificio.idEdificio;
                option.textContent = edificio.Nombre_Edificio || edificio.nombreEdificio;
                select.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error al cargar edificios:', err);
        });

    // Enviar formulario para agregar aula
    document.getElementById('form-nueva-aula').addEventListener('submit', async function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre-aula').value.trim();
        const idEdificio = document.getElementById('edificio-aula').value;

        if (!nombre || !idEdificio) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/aulas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    idEdificio
                })
            });

            if (res.ok) {
                alert('Aula agregada correctamente');
                modal.classList.add('hidden');
                this.reset();
                // Si tienes función para recargar la tabla, llama aquí
                renderizarTablaAulas();
            } else {
                const data = await res.json();
                alert(data.error || 'Error al agregar el aula');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
            console.error(error);
        }
    });

    async function renderizarTablaAulas() {
        try {
            const res = await fetch('http://localhost:3000/aulas');
            const aulas = await res.json();

            const contenedor = document.getElementById('tabla-aulas-contenedor');
            contenedor.innerHTML = '';

            const tabla = document.createElement('table');
            tabla.className = 'aulas-table';

            tabla.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre del aula</th>
                        <th>Edificio</th>
                    </tr>
                </thead>
                <tbody>
                    ${aulas.map(a => `
                        <tr>
                            <td>${a.ID_Aula}</td>
                            <td>${a.Nombre_Aula}</td>
                            <td>${a.Nombre_Edificio || a.Edificio || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;

            contenedor.appendChild(tabla);
        } catch (error) {
            console.error('Error al cargar aulas:', error);
        }
    }
    renderizarTablaAulas()

});