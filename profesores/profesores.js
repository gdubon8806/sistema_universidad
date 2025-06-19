document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modalProfesor");
    const abrir = document.getElementById("abrirModal");
    const cerrar = document.getElementById("cerrarModal");
    const form = document.getElementById("form-profesor");
    const tabla = document.querySelector("#tabla-profesores tbody");
  
    const modalConfirm = document.getElementById("modalConfirmacion");
    const btnCancelarEliminar = document.getElementById("cancelarEliminar");
    const btnConfirmarEliminar = document.getElementById("confirmarEliminar");
    let filaAEliminar = null;
  
    abrir.addEventListener("click", () => modal.classList.remove("hidden"));
    cerrar.addEventListener("click", () => modal.classList.add("hidden"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.add("hidden");
      if (e.target === modalConfirm) modalConfirm.classList.add("hidden");
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const especialidad = document.getElementById("especialidad").value;
      const disponibilidad = document.getElementById("disponibilidad").value;
  
      const fila = document.createElement("tr");
  
      fila.innerHTML = `
        <td>${nombre}</td>
        <td>${especialidad}</td>
        <td>${disponibilidad}</td>
        <td>
          <button class="btn-eliminar">Eliminar</button>
        </td>
      `;
  
      tabla.appendChild(fila);
      form.reset();
      modal.classList.add("hidden");
    });
  
    // Delegar clic para botón eliminar
    tabla.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-eliminar")) {
        filaAEliminar = e.target.closest("tr");
        modalConfirm.classList.remove("hidden");
      }
    });
  
    btnCancelarEliminar.addEventListener("click", () => {
      modalConfirm.classList.add("hidden");
      filaAEliminar = null;
    });
  
    btnConfirmarEliminar.addEventListener("click", () => {
      if (filaAEliminar) {
        filaAEliminar.remove();
        filaAEliminar = null;
      }
      modalConfirm.classList.add("hidden");
    });
  });
  