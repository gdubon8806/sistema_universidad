-- Procedimiento para insertar usuario con contraseña encriptada
CREATE PROCEDURE InsertarUsuarioEncriptado
    @Usuario NVARCHAR(50),
    @Password NVARCHAR(100),
    @Nombre NVARCHAR(100),
    @Apellido NVARCHAR(100),
    @Rol NVARCHAR(50)
AS
BEGIN
    INSERT INTO Usuario (Usuario, Password, Nombre, Apellido, Rol, Fecha_Creacion)
    VALUES (
        @Usuario,
        CONVERT(VARCHAR(256), ENCRYPTBYPASSPHRASE('ClaveFijaParaUsuarios2025', @Password), 1),
        @Nombre,
        @Apellido,
        @Rol,
        GETDATE()
    );
END
GO

-- Procedimiento para validar login desencriptando la contraseña
CREATE PROCEDURE ValidarLogin
    @Usuario NVARCHAR(50),
    @Password NVARCHAR(100)
AS
BEGIN
    DECLARE @PasswordEncriptado VARBINARY(256);

    SELECT @PasswordEncriptado = CONVERT(VARBINARY(256), Password, 1)
    FROM Usuario
    WHERE Usuario = @Usuario;

    IF @PasswordEncriptado IS NOT NULL AND
       CONVERT(NVARCHAR(100), DECRYPTBYPASSPHRASE('ClaveFijaParaUsuarios2025', @PasswordEncriptado)) = @Password
    BEGIN
        SELECT * FROM Usuario WHERE Usuario = @Usuario;
    END
    ELSE
    BEGIN
        SELECT NULL AS Usuario;
    END
END
GO

--Ejemplo de inserción de usuario
EXEC InsertarUsuarioEncriptado
    @Usuario = 'admin1',
    @Password = 'admin123',
    @Nombre = 'Juan',
    @Apellido = 'Pérez',
    @Rol = 'Administrador';