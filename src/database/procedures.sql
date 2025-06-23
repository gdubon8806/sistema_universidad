//para crear una admision
CREATE PROCEDURE sp_crear_admision
    @Nombres NVARCHAR(100),
    @Apellidos NVARCHAR(100),
    @DNI NVARCHAR(20),
    @Correo NVARCHAR(100),
    @Telefono NVARCHAR(20),
    @FechaNacimiento DATE,
    @ID_Carrera INT,
    @FechaIngreso DATE
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @ID_Estudiante INT;

        -- Buscar estudiante por DNI
        SELECT @ID_Estudiante = ID_Estudiante FROM ESTUDIANTE WHERE DNI = @DNI;

        -- Si no existe, insertar
        IF @ID_Estudiante IS NULL
        BEGIN
            INSERT INTO ESTUDIANTE (Nombres, Apellidos, DNI, Correo_Electronico, Telefono, Fecha_Nacimiento)
            VALUES (@Nombres, @Apellidos, @DNI, @Correo, @Telefono, @FechaNacimiento);

            SET @ID_Estudiante = SCOPE_IDENTITY();
        END

        -- Insertar admisión
        INSERT INTO ADMISIONES (ID_Estudiante, ID_Carrera, Fecha_Ingreso)
        VALUES (@ID_Estudiante, @ID_Carrera, @FechaIngreso);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END



CREATE OR ALTER PROCEDURE ObtenerSeccionesDisponibles
  @ID_Estudiante INT,
  @ID_PeriodoActual INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT 
    S.*,           
    C.Nombre AS Nombre_Curso
  FROM SECCION S
  JOIN CURSO C ON C.ID_Curso = S.ID_Curso

  -- Relacionar con cursos de la carrera del estudiante
  WHERE S.ID_Periodo = @ID_PeriodoActual
    AND C.ID_Curso IN (
      SELECT CC.ID_Curso
      FROM CURSOS_CARRERAS CC
      JOIN ADMISIONES A ON CC.ID_Carrera = A.ID_Carrera
      WHERE A.ID_Estudiante = @ID_Estudiante
    )

    --  Excluir cursos ya aprobados
    AND S.ID_Curso NOT IN (
      SELECT SC.ID_Curso
      FROM CALIFICACION CAL
      JOIN MATRICULA M ON CAL.ID_Matricula = M.ID_Matricula
      JOIN SECCION SC ON SC.ID_Seccion = M.ID_Seccion
      WHERE M.ID_Estudiante = @ID_Estudiante
        AND CAL.Estado = 'Aprobado'
    )

    --  Excluir si no cumple prerrequisitos
    AND NOT EXISTS (
      SELECT 1
      FROM PRERREQUISITO PR
      WHERE PR.ID_Curso = S.ID_Curso
        AND NOT EXISTS (
          SELECT 1
          FROM CALIFICACION CAL
          JOIN MATRICULA M ON CAL.ID_Matricula = M.ID_Matricula
          JOIN SECCION SC ON SC.ID_Seccion = M.ID_Seccion
          WHERE M.ID_Estudiante = @ID_Estudiante
            AND CAL.Estado = 'Aprobado'
            AND SC.ID_Curso = PR.ID_Curso_Prerequisito
        )
    );
END;

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