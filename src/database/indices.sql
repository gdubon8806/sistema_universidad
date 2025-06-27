-- Índice 1: Optimiza filtros por estado (Aprobado, Reprobado, etc.)
CREATE INDEX IX_Calificacion_Estado
ON CALIFICACION(Estado);

-- Índice 2: Optimiza las consultas por estudiante (ver matrículas, calificaciones, etc.)
CREATE INDEX IX_Matricula_ID_Estudiante
ON MATRICULA(ID_Estudiante);

-- Índice 3: Optimiza la consulta de secciones por curso y periodo académico
CREATE INDEX IX_Seccion_ID_Curso_ID_Periodo
ON SECCION(ID_Curso, ID_Periodo);

-- Índice 4a: Optimiza la consulta para saber qué carrera estudia un alumno
CREATE INDEX IX_Admisiones_ID_Estudiante
ON ADMISIONES(ID_Estudiante);

-- Índice 4b: Optimiza la consulta inversa, para saber todos los estudiantes de una carrera
CREATE INDEX IX_Admisiones_ID_Carrera
ON ADMISIONES(ID_Carrera);

-- Índice 5: Optimiza la obtención de cursos por carrera
CREATE INDEX IX_CursosCarreras_ID_Carrera
ON CURSOS_CARRERAS(ID_Carrera);

-- Índice 6a: Optimiza la validación de prerrequisitos de un curso
CREATE INDEX IX_Prerequisito_ID_Curso
ON PRERREQUISITO(ID_Curso);

-- Índice 6b: Optimiza la verificación del curso prerrequisito cumplido
CREATE INDEX IX_Prerequisito_ID_CursoPrereq
ON PRERREQUISITO(ID_Curso_Prerequisito);

-- Índice 7: Mejora el JOIN entre CALIFICACION y MATRICULA
CREATE INDEX IX_Calificacion_ID_Matricula
ON CALIFICACION(ID_Matricula);

-- Índice 8: Permite consultar rápidamente las secciones asignadas a un profesor
CREATE INDEX IX_Seccion_ID_Profesor
ON SECCION(ID_Profesor);

-- Índice 9: Acelera la consulta de matrículas por sección (útil para dashboards y reportes)
CREATE INDEX IX_Matricula_ID_Seccion
ON MATRICULA(ID_Seccion);

-- Índice 10: Mejora las búsquedas por DNI del estudiante
CREATE INDEX IX_Estudiante_DNI
ON ESTUDIANTE(DNI);

-- Índice 11: Facilita la consulta del periodo académico activo
CREATE INDEX IX_PeriodoAcademico_Activo
ON PERIODO_ACADEMICO(Activo);
