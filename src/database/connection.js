import mssql from 'mssql';

const connectionSettings = {
    server: "localhost", // O usa "." si es la instancia por defecto
    database: "hotel_reservas",
    user: "sa", // Nombre de usuario de SQL Server
    password: "admin123", // Contraseña de SQL Server
    options: {
        encrypt: true, // Generalmente se usa false para conexiones locales
        trustServerCertificate: true
    }
};

export async function obtenerConexionDB() {
    try {
        const pool = await mssql.connect(connectionSettings);
        console.log("Conectado a SQL Server");
        return pool;
    } catch (err) {
        console.error("Error de conexión:", err);
    }
}


export { mssql };