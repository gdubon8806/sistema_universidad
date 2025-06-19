document.addEventListener("DOMContentLoaded", async () => {
    const reservasContainer = document.getElementById("reservas-container");
    const reservaTemplate = document.getElementById("reserva-plantilla").content;
    const modal = document.getElementById("modal");
    const openModalBtn = document.getElementById("abrir-modal");
    const cerrarModalBtn = document.getElementById("cerrar-modal");
    const backButton = document.getElementById("back-button");
    const clienteDropdown = document.getElementById("nombre");
    const habitacionDropdown = document.getElementById("habitacion");
    const fechaInicioInput = document.getElementById("fecha-inicio");
    const fechaSalidaInput = document.getElementById("fecha-salida");
    const precioInput = document.getElementById("precio");
    const reservaForm = document.getElementById("reserva-form");

    let habitaciones = [];

    // Abrir modal
    openModalBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    // Cerrar modal con el botón "X"
    cerrarModalBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Cerrar modal con el botón "Atrás"
    backButton.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });

    //PARA CARGAR RESERVAS 
    async function cargarMatriculas() {
        try {
            // Simulando una petición a tu backend
            const respuesta = await fetch("http://localhost:3000/reservas"); // Ajusta la URL según tu servidor
            const reservas = await respuesta.json(); // Suponiendo que el backend devuelve JSON con clientes
            // console.log(reservas);
            if (reservas.length === 0) {
                // Mostrar mensaje si no hay reservas
                const mensaje = document.createElement("p");
                mensaje.textContent = "No hay ninguna reserva.";
                mensaje.classList.add("no-reservas"); // Clase opcional para estilos
                reservasContainer.appendChild(mensaje);
            } else {

                reservas.forEach(reserva => {
                    let fechaLLegada = formatearFecha(reserva.fecha_llegada);
                    let fechaSalida = formatearFecha(reserva.fecha_salida);
                    const clone = document.importNode(reservaTemplate, true);
                    clone.querySelector(".tarjeta-titulo").textContent = "Reserva No. " + reserva.reserva_id;
                    clone.querySelector(".tarjeta-nombre-cliente").textContent = "Nombre de cliente: " + reserva.nombre + " " + reserva.apellido;

                    clone.querySelector(".tarjeta-fecha-inicio-reserva").textContent = "Fecha de inicio: " + fechaLLegada;

                    clone.querySelector(".tarjeta-fecha-salida-reserva").textContent = "Fecha de salida: " + fechaSalida;

                    clone.querySelector(".tarjeta-num-habitacion").textContent = "Número de habitación: " + reserva.numero_habitacion;
                    clone.querySelector(".tarjeta-piso").textContent = "Piso " + reserva.piso;
                    clone.querySelector(".tarjeta-precio_total").textContent = "L. " + reserva.precio_total;
                    clone.querySelector(".tarjeta-estado").textContent = reserva.estado;

                    const deleteButton = clone.querySelector(".btn-eliminar");
                    deleteButton.setAttribute("data-id", reserva.reserva_id);
                    // Agregar el evento de eliminación al botón
                    deleteButton.addEventListener("click", eliminarReserva);

                    reservasContainer.appendChild(clone);
                });
            }
        } catch (error) {
            console.error("Error al obtener reservas:", error);
        }
    }

    // Función para cargar los clientes desde la API al modal
    const cargarClientes = async () => {
        try {
            const response = await fetch('http://localhost:3000/clientes'); // Asegúrate de que el endpoint sea correcto
            if (!response.ok) {
                throw new Error('Error al obtener los clientes');
            }
            const clientes = await response.json();

            // Llenar el dropdown con los clientes
            clientes.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.cliente_id; // Usar el ID del cliente como valor
                option.textContent = cliente.nombre + " " + cliente.apellido; // Mostrar el nombre del cliente
                clienteDropdown.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    };

    cargarClientes();

    // Función para cargar las habitaciones desde la API al modal
    const cargarHabitaciones = async () => {
        try {
            const response = await fetch('http://localhost:3000/habitaciones'); // Asegúrate de que el endpoint sea correcto
            if (!response.ok) {
                throw new Error('Error al obtener las habitaciones');
            }
            habitaciones = await response.json();

            // Llenar el dropdown con las habitaciones
            habitaciones.forEach(habitacion => {
                const option = document.createElement("option");
                option.value = habitacion.habitacion_id;
                option.textContent = `Habitación ${habitacion.numero_habitacion} - Piso ${habitacion.piso}`;
                habitacionDropdown.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Función para calcular el precio total al modal
    const calcularPrecio = () => {
        const fechaInicio = new Date(fechaInicioInput.value);
        const fechaSalida = new Date(fechaSalidaInput.value);
        const habitacionSeleccionada = habitaciones.find((habitacion) => {
            return habitacion.habitacion_id == habitacionDropdown.value
        }
        );

        if (fechaInicio && fechaSalida && habitacionSeleccionada) {
            const diferenciaTiempo = fechaSalida - fechaInicio;
            const noches = diferenciaTiempo / (1000 * 60 * 60 * 24); // Convertir milisegundos a días

            if (noches > 0) {
                const precioTotal = noches * habitacionSeleccionada.precio_noche;
                precioInput.value = precioTotal.toFixed(2); // Mostrar con 2 decimales
            } else {
                precioInput.value = 0; // Si las fechas no son válidas
            }
        }
    };
    cargarHabitaciones();
    // Escuchar cambios en las fechas y la habitación seleccionada
    fechaInicioInput.addEventListener("change", calcularPrecio);
    fechaSalidaInput.addEventListener("change", calcularPrecio);
    habitacionDropdown.addEventListener("change", calcularPrecio);



    // Función para enviar la reserva a la API
    const enviarReserva = async (event) => {
        event.preventDefault();
        // Capturar los datos del formulario
        const nuevaReserva = {
            cliente_id: document.getElementById("nombre").value, // ID del cliente seleccionado
            habitacion_id: document.getElementById("habitacion").value, // ID de la habitación seleccionada
            fecha_inicio: document.getElementById("fecha-inicio").value,
            fecha_salida: document.getElementById("fecha-salida").value,
            precio_total: document.getElementById("precio").value,
            estado: document.getElementById("estado").value,
            numero_adultos: document.getElementById("numero-adultos").value,
            numero_niños: document.getElementById("numero-ninos").value
        };

        try {
            // Enviar los datos a la API
            const response = await fetch('http://localhost:3000/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaReserva)
            });

            if (response.ok) {
                alert('Reserva creada correctamente');
                // Opcional: cerrar el modal después de enviar la reserva
                document.getElementById("modal").classList.add("hidden");
                reservaForm.reset(); // Limpiar el formulario
                // Recargar la página para mostrar la nueva reserva
                location.reload();
            } else {
                alert('Error al crear la reserva');
            }
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            alert('Error al crear la reserva');
        }
    };

    // Agregar el event listener al formulario
    reservaForm.addEventListener("submit", enviarReserva);

    const eliminarReserva = async (event) => {
        const reservaId = event.target.getAttribute("data-id"); // Obtener el ID de la reserva

        if (confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
            try {
                const response = await fetch(`http://localhost:3000/reservas/${reservaId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Reserva eliminada correctamente');
                    location.reload() // Recargar las reservas dinámicamente
                } else {
                    alert('Error al eliminar la reserva');
                }
            } catch (error) {
                console.error('Error al eliminar la reserva:', error);
                alert('Error al eliminar la reserva');
            }
        }
    };
});

