document.addEventListener('DOMContentLoaded', async () => {
    protegerRuta();

    // Botón cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '../pages/Login/index.html';
        });
    }
    try {
        const res = await fetch('http://localhost:3000/dashboard-metrics');
        const data = await res.json();

        document.getElementById('metric-estudiantes-activos').textContent = `Activos: ${data.estudiantes.activos ?? 0}`;
        document.getElementById('metric-estudiantes-inactivos').textContent = `Inactivos: ${data.estudiantes.inactivos ?? 0}`;
        document.getElementById('metric-docentes-activos').textContent = `Activos: ${data.docentes.activos ?? 0}`;
        document.getElementById('metric-docentes-inactivos').textContent = `Inactivos: ${data.docentes.inactivos ?? 0}`;
        document.getElementById('metric-materias-activos').textContent = `Activas: ${data.materias.activos ?? 0}`;
        document.getElementById('metric-materias-inactivas').textContent = `Inactivas: ${data.materias.inactivos ?? 0}`;
        document.getElementById('metric-secciones-activos').textContent = `Abiertas: ${data.secciones.activos ?? 0}`;
        document.getElementById('metric-secciones-inactivos').textContent = `Cerradas: ${data.secciones.inactivos ?? 0}`;
        document.getElementById('metric-matriculas-activos').textContent = `Activas: ${data.matriculas.activos ?? 0}`;
        document.getElementById('metric-matriculas-inactivas').textContent = `Inactivas: ${data.matriculas.inactivos ?? 0}`;
    } catch (error) {
        console.error('Error al cargar métricas:', error);
    }
});

async function setPeriodoActivoEnWidgets() {
    try {
        const res = await fetch('http://localhost:3000/periodo-academico-activo');
        const periodo = await res.json();
        if (periodo && periodo.Nombre) {
            document.getElementById('periodo-secciones').textContent = periodo.Nombre;
            document.getElementById('periodo-matriculas').textContent = periodo.Nombre;
        } else {
            document.getElementById('periodo-secciones').textContent = '';
            document.getElementById('periodo-matriculas').textContent = '';
        }
    } catch (error) {
        document.getElementById('periodo-secciones').textContent = '';
        document.getElementById('periodo-matriculas').textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await setPeriodoActivoEnWidgets();
    // ...tu código para métricas...
});