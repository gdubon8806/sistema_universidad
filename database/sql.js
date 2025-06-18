import {obtenerConexionDB, mssql } from './connection.js';

const obtenerClientes = async () => {
    try {
        const pool = await obtenerConexionDB();
        const result = await pool.request().query("SELECT nombre, telefono FROM clientes");
        console.table(result.recordset);
        console.log("Productos enlistados!");
    } catch (error) {

    }
}

obtenerClientes();