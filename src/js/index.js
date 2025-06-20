document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('http://localhost:3000/dashboard-metrics');
        const data = await res.json();

        document.getElementById('metric-estudiantes').textContent = data.estudiantes ?? '-';
        document.getElementById('metric-docentes').textContent = data.docentes ?? '-';
        document.getElementById('metric-materias').textContent = data.materias ?? '-';
        document.getElementById('metric-secciones').textContent = data.secciones ?? '-';
        document.getElementById('metric-matriculas').textContent = data.matriculas ?? '-';
    } catch (error) {
        console.error('Error al cargar métricas:', error);
    }
});