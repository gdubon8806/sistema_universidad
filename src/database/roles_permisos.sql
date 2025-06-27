-- 1. Crear el LOGIN a nivel de servidor
CREATE LOGIN Admin1 WITH PASSWORD = 'Admin123';

-- 2. Usar la base de datos UniTrackDB
USE UniTrackDB;

-- 3. Crear el USER en esta base de datos
CREATE USER Admin1 FOR LOGIN Admin1;

-- 4. Asignar permisos de lectura, inserción y actualización en todas las tablas
GRANT SELECT, INSERT, UPDATE TO Admin1;
GRANT EXECUTE ON SCHEMA::dbo TO Admin1;

-- 5. Denegar permiso para eliminar datos
DENY DELETE TO Admin1;


