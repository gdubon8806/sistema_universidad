USE UniTrackDB;
GO

-- Índices para mejorar rendimiento de búsquedas y relaciones

IF NOT EXISTS (
    SELECT name FROM sys.indexes
    WHERE name = 'idx_estudiante_correo' AND object_id = OBJECT_ID('ESTUDIANTE')
)
    CREATE INDEX idx_estudiante_correo ON ESTUDIANTE(Correo_Electronico);

IF NOT EXISTS (
    SELECT name FROM sys.indexes
    WHERE name = 'idx_admisiones_estudiante' AND object_id = OBJECT_ID('ADMISIONES')
)
    CREATE INDEX idx_admisiones_estudiante ON ADMISIONES(ID_Estudiante);

IF NOT EXISTS (
    SELECT name FROM sys.indexes
    WHERE name = 'idx_admisiones_carrera' AND object_id = OBJECT_ID('ADMISIONES')
)
    CREATE INDEX idx_admisiones_carrera ON ADMISIONES(ID_Carrera);

IF NOT EXISTS (
    SELECT name FROM sys.indexes
    WHERE name = 'idx_matricula_estudiante' AND object_id = OBJECT_ID('MATRICULA')
)
    CREATE INDEX idx_matricula_estudiante ON MATRICULA(ID_Estudiante);

IF NOT EXISTS (
    SELECT name FROM sys.indexes
    WHERE name = 'idx_matricula_seccion' AND object_id = OBJECT_ID('MATRICULA')
)
    CREATE INDEX idx_matricula_seccion ON MATRICULA(ID_Seccion);

IF NOT EXISTS (
    SELECT name FROM sys.indexes
    WHERE name = 'idx_seccion_curso' AND object_id = OBJECT_ID('SECCION')
)
    CREATE INDEX idx_seccion_curso ON SECCION(ID_Curso);

IF NOT EXISTS (
    SELECT name FROM sys.indexes
    WHERE name = 'idx_calificacion_matricula' AND object_id = OBJECT_ID('CALIFICACION')
)
    CREATE INDEX idx_calificacion_matricula ON CALIFICACION(ID_Matricula);
