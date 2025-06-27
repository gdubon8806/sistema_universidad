  --CONSULTAS OPTIMIZADAS
  --Dashboard de inicio: datos obtenidos:
  DECLARE @idPeriodo INT;

  SELECT TOP 1 @idPeriodo = ID_Periodo FROM PERIODO_ACADEMICO WHERE Activo = 1;
  SELECT TOP 1 ID_Periodo FROM PERIODO_ACADEMICO WHERE Activo = 1

  -- Total de estudiantes activos e inactivos
  SELECT 
    SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
    SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
  FROM ESTUDIANTE

  -- Total de docentes activos e inactivos
  SELECT 
    SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
    SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
  FROM PROFESOR

  -- Total de cursos activos e inactivos
  SELECT 
    SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
    SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
  FROM CURSO

  -- Total de secciones activas e inactivas
  SELECT 
    SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
    SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
  FROM SECCION
  WHERE ID_Periodo = @idPeriodo

  -- Total de matrículas activas e inactivas
  SELECT 
    SUM(CASE WHEN M.Activo = 1 THEN 1 ELSE 0 END) AS activos,
    SUM(CASE WHEN M.Activo = 0 THEN 1 ELSE 0 END) AS inactivos
  FROM MATRICULA M
  INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
  WHERE S.ID_Periodo = @idPeriodo


  --Para widget de estudiantes activos e inactivos en cada carrera de pagina de estudiantes
  SELECT 
      C.ID_Carrera,
      C.Nombre AS Carrera,
      SUM(CASE WHEN E.Activo = 1 THEN 1 ELSE 0 END) AS Activos,
      SUM(CASE WHEN E.Activo = 0 THEN 1 ELSE 0 END) AS Inactivos
  FROM ADMISIONES A
  INNER JOIN ESTUDIANTE E ON A.ID_Estudiante = E.ID_Estudiante
  INNER JOIN CARRERA C ON A.ID_Carrera = C.ID_Carrera
  GROUP BY C.ID_Carrera, C.Nombre
  ORDER BY C.Nombre;