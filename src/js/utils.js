
function formatearFecha(fechaString) {
    /**
     * Parsea una cadena de fecha en formato ISO 8601 (como "2025-03-27T00:00:00.000Z")
     * al formato de fecha de Honduras "día/mes/año".
    *
    * @param {string} fechaString La cadena de fecha en formato ISO 8601.
    * @returns {string|null} La fecha formateada en "día/mes/año" o null si la entrada no es válida.
    */
    if (!fechaString || typeof fechaString !== 'string') {
        console.error("Error: La entrada debe ser una cadena de texto válida.");
        return null;
    }

    try {
        const fechaObjeto = new Date(fechaString);

        if (isNaN(fechaObjeto.getTime())) {
            console.error("Error: No se pudo crear un objeto Date válido a partir de la entrada.");
            return null;
        }

        const dia = fechaObjeto.getDate();
        const mes = fechaObjeto.getMonth() + 1; // getMonth() devuelve 0-11
        const año = fechaObjeto.getFullYear();

        return `${dia}/${mes}/${año}`;

    } catch (error) {
        console.error("Error al parsear la fecha:", error);
        return null;
    }
}