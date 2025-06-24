import express from "express";
import cors from "cors";
import { obtenerConexionDB } from "./src/database/connection.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors()); // Habilita CORS para permitir solicitudes del frontend
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

console.log("");

// Ruta para obtener las carreras
app.get("/carreras", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT
        C.ID_Carrera,
        C.Codigo_Carrera AS codigo,
        C.Nombre AS nombre,
        F.Nombre AS facultad
      FROM 
        CARRERA C
      INNER JOIN 
        FACULTAD F ON C.ID_Facultad = F.ID_Facultad
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las carreras" });
  }
});

// Ruta para agregar una nueva carrera
app.post("/carreras", async (req, res) => {
  try {
    const { codigo, nombre, idFacultad } = req.body;
    if (!codigo || !nombre || !idFacultad) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const pool = await obtenerConexionDB();
    await pool.request().query(`
      INSERT INTO CARRERA (Codigo_Carrera, Nombre, ID_Facultad)
      VALUES ('${codigo}', '${nombre}', ${idFacultad})
    `);

    res.status(201).json({ message: "Carrera agregada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar la carrera" });
  }
});

// Ruta para obtener las facultades
app.get("/facultades", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query("SELECT ID_Facultad, Nombre FROM FACULTAD");
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las facultades" });
  }
});

// Ruta para obtener los admisiones
app.get("/admisiones", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        E.Nombres + ' ' + E.Apellidos AS estudiante,
        C.Nombre AS carrera,
        A.Fecha_Ingreso AS fecha_ingreso,
        A.Activo,
        A.ID_Admision,
        E.ID_Estudiante
      FROM 
        ADMISIONES A
      INNER JOIN 
        ESTUDIANTE E ON A.ID_Estudiante = E.ID_Estudiante
      INNER JOIN 
        CARRERA C ON A.ID_Carrera = C.ID_Carrera
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las admisiones" });
  }
});

// Ruta para agregar una nueva admisión
app.post("/admisiones", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      correo,
      telefono,
      fechaNacimiento,
      idCarrera,
      fechaIngreso
    } = req.body;

    if (!nombre || !apellido || !dni || !correo || !fechaNacimiento || !idCarrera || !fechaIngreso) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const pool = await obtenerConexionDB();
    await pool.request()
      .input('Nombres', nombre)
      .input('Apellidos', apellido)
      .input('DNI', dni)
      .input('Correo', correo)
      .input('Telefono', telefono)
      .input('FechaNacimiento', fechaNacimiento)
      .input('ID_Carrera', idCarrera)
      .input('FechaIngreso', fechaIngreso)


      .execute('sp_crear_admision');

    res.status(201).json({ message: "Admisión creada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la admisión" });
  }
});

// Ruta para obtener los profesores
app.get("/profesores", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        ID_Profesor,
        Nombre,
        Apellido,
        DNI,
        Correo_Electronico,
        Telefono
      FROM PROFESOR
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los profesores" });
  }
});

// Ruta para agregar un nuevo profesor
app.post("/profesores", async (req, res) => {
  try {
    const { nombre, apellido, dni, correo, telefono } = req.body;
    if (!nombre || !apellido || !dni || !correo || !telefono) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const pool = await obtenerConexionDB();
    await pool.request()
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('dni', dni)
      .input('correo', correo)
      .input('telefono', telefono)
      .query(`
        INSERT INTO PROFESOR (Nombre, Apellido, DNI, Correo_Electronico, Telefono)
        VALUES (@nombre, @apellido, @dni, @correo, @telefono)
      `);

    res.status(201).json({ message: "Profesor agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el profesor" });
  }
});

// Ruta para agregar un nuevo curso
app.post("/cursos", async (req, res) => {
  try {
    const { codigo, nombre, creditos, requisitos } = req.body;
    if (!codigo || !nombre || !creditos) {
      return res.status(400).json({ error: "Todos los campos obligatorios deben ser completados" });
    }

    const pool = await obtenerConexionDB();

    await pool.request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('creditos', creditos)
      .input('requisitos', requisitos || null)
      .query(`
        INSERT INTO CURSO (Codigo, Nombre, Creditos, Requisitos)
        VALUES (@codigo, @nombre, @creditos, @requisitos)
      `);

    res.status(201).json({ message: "Curso agregado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el curso" });
  }
});

// Ruta para obtener los cursos
app.get("/cursos", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        ID_Curso,
        Codigo,
        Nombre,
        Creditos,
        Requisitos
      FROM CURSO
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los cursos" });
  }
});

// Ruta para agregar un nuevo aula
app.post("/aulas", async (req, res) => {
  try {
    const { nombre, idEdificio } = req.body;
    if (!nombre || !idEdificio) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const pool = await obtenerConexionDB();
    await pool.request()
      .input('nombre', nombre)
      .input('idEdificio', idEdificio)
      .query(`
        INSERT INTO AULA (Nombre_Aula, ID_Edificio)
        VALUES (@nombre, @idEdificio)
      `);

    res.status(201).json({ message: "Aula agregada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el aula" });
  }
});

// Ruta para obtener los edificios
app.get("/edificios", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT ID_Edificio, Nombre_Edificio, Ubicacion
      FROM EDIFICIO
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los edificios" });
  }
});

// Ruta para obtener las aulas
app.get("/aulas", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        A.ID_Aula,
        A.Nombre_Aula,
        E.Nombre_Edificio
      FROM AULA A
      INNER JOIN EDIFICIO E ON A.ID_Edificio = E.ID_Edificio
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las aulas" });
  }
});

// Ruta para agregar una nueva sección
app.post("/secciones", async (req, res) => {
  try {
    const {
      codigo,
      idCurso,
      modalidad,
      idProfesor,
      idAula,
      hora,
      dias,
      cupos,
      idPeriodo // <-- Nuevo
    } = req.body;

    if (!codigo || !idCurso || !modalidad || !idProfesor || !idAula || !hora || !dias || !cupos || !idPeriodo) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const pool = await obtenerConexionDB();
    await pool.request()
      .input('codigo', codigo)
      .input('idCurso', idCurso)
      .input('modalidad', modalidad)
      .input('idProfesor', idProfesor)
      .input('idAula', idAula)
      .input('hora', hora)
      .input('dias', dias)
      .input('cupos', cupos)
      .input('idPeriodo', idPeriodo) // <-- Nuevo
      .query(`
        INSERT INTO SECCION (Codigo, ID_Curso, Modalidad, ID_Profesor, ID_Aula, Hora, Dias, Cupos, ID_Periodo)
        VALUES (@codigo, @idCurso, @modalidad, @idProfesor, @idAula, @hora, @dias, @cupos, @idPeriodo)
      `);

    res.status(201).json({ message: "Sección agregada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar la sección" });
  }
});

// Ruta para obtener las secciones
app.get("/secciones", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        S.Codigo,
        C.Nombre AS Curso,
        S.Modalidad,
        P.Nombre + ' ' + P.Apellido AS Profesor,
        A.Nombre_Aula AS Aula,
        PA.Nombre AS PeriodoAcademico,
        S.Hora,
        S.Dias,
        S.Cupos
      FROM SECCION S
      INNER JOIN CURSO C ON S.ID_Curso = C.ID_Curso
      INNER JOIN PROFESOR P ON S.ID_Profesor = P.ID_Profesor
      INNER JOIN AULA A ON S.ID_Aula = A.ID_Aula
      INNER JOIN PERIODO_ACADEMICO PA ON S.ID_Periodo = PA.ID_Periodo
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las secciones" });
  }
});

app.get("/secciones-disponibles", async (req, res) => {
  try {
    const { idEstudiante, idPeriodo } = req.query;
    if (!idEstudiante || !idPeriodo) {
      return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
    const pool = await obtenerConexionDB();
    const result = await pool.request()
      .input('ID_Estudiante', idEstudiante)
      .input('ID_PeriodoActual', idPeriodo)
      .execute('ObtenerSeccionesDisponibles');
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las secciones disponibles" });
  }
});

// Ruta para obtener los estudiantes
app.get("/estudiantes", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        ID_Estudiante,
        Nombres,
        Apellidos,
        DNI,
        Correo_Electronico,
        Telefono,
        Fecha_Nacimiento,
        Activo -- <--- Asegúrate de traer este campo
      FROM ESTUDIANTE
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
});

app.post("/matriculas", async (req, res) => {
  try {
    const { fecha, idEstudiante, idPeriodo, secciones } = req.body;
    if (!fecha || !idEstudiante || !idPeriodo || !Array.isArray(secciones) || secciones.length === 0) {
      return res.status(400).json({ error: "Datos incompletos" });
    }
    const pool = await obtenerConexionDB();

    // // Validar que el estudiante no tenga matrícula previa en el periodo
    // const existe = await pool.request()
    //   .input('idEstudiante', idEstudiante)
    //   .input('idPeriodo', idPeriodo)
    //   .query(`
    //     SELECT COUNT(*) AS total
    //     FROM MATRICULA M
    //     INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
    //     WHERE M.ID_Estudiante = @idEstudiante AND S.ID_Periodo = @idPeriodo
    //   `);
    // if (existe.recordset[0].total > 0) {
    //   return res.status(400).json({ error: "El estudiante ya tiene matrícula en este periodo." });
    // }

    // Insertar una matrícula por cada sección seleccionada
    for (const idSeccion of secciones) {
      await pool.request()
        .input('fecha', fecha)
        .input('idEstudiante', idEstudiante)
        .input('idSeccion', idSeccion)
        .query(`
          INSERT INTO MATRICULA (Fecha_Matricula, ID_Estudiante, ID_Seccion)
          VALUES (@fecha, @idEstudiante, @idSeccion)
        `);
    }

    res.status(201).json({ message: "Matrícula(s) agregada(s) correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar la matrícula" });
  }
});

// Ruta para obtener las matrículas
app.get("/matriculas", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        M.ID_Matricula,
        M.Fecha_Matricula,
        E.Nombres + ' ' + E.Apellidos AS Estudiante,
        E.DNI,
        S.Codigo AS Seccion,
        C.Nombre AS Curso,
        M.Activo,
        PA.Nombre -- <--- Nuevo campo
      FROM MATRICULA M
      INNER JOIN ESTUDIANTE E ON M.ID_Estudiante = E.ID_Estudiante
      INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
      INNER JOIN CURSO C ON S.ID_Curso = C.ID_Curso
      INNER JOIN PERIODO_ACADEMICO PA ON S.ID_Periodo = PA.ID_Periodo -- <--- JOIN nuevo
      ORDER BY M.Fecha_Matricula DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las matrículas" });
  }
});

// Ruta para obtener métricas del dashboard
app.get("/dashboard-metrics", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();

    // Obtén el periodo académico activo
    const periodoResult = await pool.request().query(`
      SELECT TOP 1 ID_Periodo FROM PERIODO_ACADEMICO WHERE Activo = 1
    `);
    const idPeriodo = periodoResult.recordset.length > 0 ? periodoResult.recordset[0].ID_Periodo : null;

    // Promesas para cada métrica
    const [
      estudiantes,
      docentes,
      materias,
      secciones,
      matriculas
    ] = await Promise.all([
      pool.request().query(`
        SELECT 
          SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
          SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
        FROM ESTUDIANTE
      `),
      pool.request().query(`
        SELECT 
          SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
          SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
        FROM PROFESOR
      `),
      pool.request().query(`
        SELECT 
          SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
          SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
        FROM CURSO
      `),
      pool.request().query(`
        SELECT 
          SUM(CASE WHEN Activo = 1 THEN 1 ELSE 0 END) AS activos,
          SUM(CASE WHEN Activo = 0 THEN 1 ELSE 0 END) AS inactivos
        FROM SECCION
        ${idPeriodo ? "WHERE ID_Periodo = " + idPeriodo : ""}
      `),
      idPeriodo
        ? pool.request()
            .input('idPeriodo', idPeriodo)
            .query(`
              SELECT 
                SUM(CASE WHEN M.Activo = 1 THEN 1 ELSE 0 END) AS activos,
                SUM(CASE WHEN M.Activo = 0 THEN 1 ELSE 0 END) AS inactivos
              FROM MATRICULA M
              INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
              WHERE S.ID_Periodo = @idPeriodo
            `)
        : { recordset: [{ activos: 0, inactivos: 0 }] }
    ]);

    res.json({
      estudiantes: estudiantes.recordset[0],
      docentes: docentes.recordset[0],
      materias: materias.recordset[0],
      secciones: secciones.recordset[0],
      matriculas: matriculas.recordset[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener métricas" });
  }
});
// Ruta para obtener las calificaciones
app.get("/calificaciones", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        C.ID_Calificacion,
        C.Nota,
        C.Fecha_Registro,
        E.Nombres + ' ' + E.Apellidos AS Estudiante,
        E.DNI,
        S.Codigo AS Seccion,
        Cu.Nombre AS Curso,
        C.Estado AS Estado,
        C.Activo
      FROM CALIFICACION C
      INNER JOIN MATRICULA M ON C.ID_Matricula = M.ID_Matricula
      INNER JOIN ESTUDIANTE E ON M.ID_Estudiante = E.ID_Estudiante
      INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
      INNER JOIN CURSO CU ON S.ID_Curso = CU.ID_Curso
      ORDER BY C.Fecha_Registro DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las calificaciones" });
  }
});

app.post("/calificaciones", async (req, res) => {
  try {
    const { idMatricula, nota, fecha } = req.body;

    if (!idMatricula || nota === undefined || nota === null) {
      return res.status(400).json({ error: "ID de matrícula y nota son obligatorios" });
    }

    // Determinar estado
    const estado = Number(nota) >= 65 ? 'Aprobado' : 'Reprobado';

    const pool = await obtenerConexionDB();
    await pool.request()
      .input('idMatricula', idMatricula)
      .input('nota', nota)
      .input('fecha', fecha || null)
      .input('estado', estado)
      .query(`
        INSERT INTO CALIFICACION (ID_Matricula, Nota, Fecha_Registro, Estado)
        VALUES (@idMatricula, @nota, ISNULL(@fecha, GETDATE()), @estado)
      `);

    res.status(201).json({ message: "Calificación agregada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar la calificación" });
  }
});

// Ruta para actualizar un estudiante
app.put("/estudiantes/:id", async (req, res) => {
  try {
    const { nombres, apellidos, dni, correo, telefono, fechaNacimiento } = req.body;
    const { id } = req.params;
    if (!nombres || !apellidos || !dni || !correo || !telefono || !fechaNacimiento) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    const pool = await obtenerConexionDB();
    await pool.request()
      .input('id', id)
      .input('nombres', nombres)
      .input('apellidos', apellidos)
      .input('dni', dni)
      .input('correo', correo)
      .input('telefono', telefono)
      .input('fechaNacimiento', fechaNacimiento)
      .query(`
        UPDATE ESTUDIANTE
        SET Nombres = @nombres,
            Apellidos = @apellidos,
            DNI = @dni,
            Correo_Electronico = @correo,
            Telefono = @telefono,
            Fecha_Nacimiento = @fechaNacimiento
        WHERE ID_Estudiante = @id
      `);
    res.json({ message: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el estudiante" });
  }
});

// Ruta para actualizar un profesor
app.put("/profesores/:id", async (req, res) => {
  try {
    const { nombre, apellido, dni, correo, telefono } = req.body;
    const { id } = req.params;
    if (!nombre || !apellido || !dni || !correo || !telefono) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    const pool = await obtenerConexionDB();
    await pool.request()
      .input('id', id)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('dni', dni)
      .input('correo', correo)
      .input('telefono', telefono)
      .query(`
        UPDATE PROFESOR
        SET Nombre = @nombre,
            Apellido = @apellido,
            DNI = @dni,
            Correo_Electronico = @correo,
            Telefono = @telefono
        WHERE ID_Profesor = @id
      `);
    res.json({ message: "Profesor actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el profesor" });
  }
});

// Ruta para asociar un curso a una carrera
app.post("/cursos-carreras", async (req, res) => {
  try {
    const { idCurso, idCarrera } = req.body;
    if (!idCurso || !idCarrera) {
      return res.status(400).json({ error: "Curso y carrera son obligatorios" });
    }
    const pool = await obtenerConexionDB();
    await pool.request()
      .input('idCurso', idCurso)
      .input('idCarrera', idCarrera)
      .query(`
        INSERT INTO CURSOS_CARRERAS (ID_Curso, ID_Carrera)
        VALUES (@idCurso, @idCarrera)
      `);
    res.status(201).json({ message: "Asociación creada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al asociar curso y carrera" });
  }
});

// Ruta para obtener los cursos de una carrera específica
app.get("/carreras/:id/cursos", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await obtenerConexionDB();
    const result = await pool.request()
      .input('idCarrera', id)
      .query(`
        SELECT C.ID_Curso, C.Codigo, C.Nombre
        FROM CURSOS_CARRERAS CC
        INNER JOIN CURSO C ON CC.ID_Curso = C.ID_Curso
        WHERE CC.ID_Carrera = @idCarrera
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los cursos de la carrera" });
  }
});

app.get("/periodos-academicos", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT ID_Periodo, Nombre FROM PERIODO_ACADEMICO
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los periodos académicos" });
  }
});

// Ruta para obtener el historial académico de un estudiante
app.get("/estudiantes/:id/historial", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await obtenerConexionDB();
    const result = await pool.request()
      .input('idEstudiante', id)
      .query(`
        SELECT 
          E.Nombre_Edificio AS Edificio,
          YEAR(CAL.Fecha_Registro) AS Anio,
          PA.Nombre AS Periodo,
          S.Codigo AS Seccion,
          CU.Codigo AS CodigoClase,
          CU.Nombre AS NombreClase,
          CAL.Nota,
          CAL.Estado,
          CU.Creditos
        FROM CALIFICACION CAL
        INNER JOIN MATRICULA M ON CAL.ID_Matricula = M.ID_Matricula
        INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
        INNER JOIN CURSO CU ON S.ID_Curso = CU.ID_Curso
        INNER JOIN AULA AU ON S.ID_Aula = AU.ID_Aula
        INNER JOIN EDIFICIO E ON AU.ID_Edificio = E.ID_Edificio
        INNER JOIN PERIODO_ACADEMICO PA ON S.ID_Periodo = PA.ID_Periodo
        WHERE M.ID_Estudiante = @idEstudiante
        ORDER BY CAL.Fecha_Registro DESC
      `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el historial académico" });
  }
});

// Ruta para obtener el periodo académico activo
app.get("/periodo-academico-activo", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT TOP 1 ID_Periodo, Nombre FROM PERIODO_ACADEMICO WHERE Activo = 1
    `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "No hay periodo académico activo" });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el periodo académico activo" });
  }
});

app.get("/matricula-existe", async (req, res) => {
  try {
    const { idEstudiante } = req.query;
    if (!idEstudiante) {
      return res.status(400).json({ error: "Falta el parámetro idEstudiante" });
    }
    const pool = await obtenerConexionDB();

    // 1. Obtener el periodo académico activo
    const periodoResult = await pool.request().query(`
      SELECT TOP 1 ID_Periodo FROM PERIODO_ACADEMICO WHERE Activo = 1
    `);
    if (periodoResult.recordset.length === 0) {
      return res.status(404).json({ error: "No hay periodo académico activo" });
    }
    const idPeriodo = periodoResult.recordset[0].ID_Periodo;

    // 2. Verificar si el estudiante ya tiene matrícula en ese periodo
    const result = await pool.request()
      .input('idEstudiante', idEstudiante)
      .input('idPeriodo', idPeriodo)
      .query(`
        SELECT COUNT(*) AS total
        FROM MATRICULA M
        INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
        WHERE M.ID_Estudiante = @idEstudiante 
          AND S.ID_Periodo = @idPeriodo
          AND M.Activo = 1 -- <--- Solo matrículas activas
      `);

    res.json({ existe: result.recordset[0].total > 0, idPeriodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al verificar matrícula" });
  }
});

app.get("/cursos-disponibles-con-secciones", async (req, res) => {
  try {
    const { idEstudiante, idPeriodo } = req.query;
    if (!idEstudiante || !idPeriodo) {
      return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }
    const pool = await obtenerConexionDB();

    // 1. Obtener la carrera del estudiante
    const carreraResult = await pool.request()
      .input('idEstudiante', idEstudiante)
      .query(`SELECT ID_Carrera FROM ADMISIONES WHERE ID_Estudiante = @idEstudiante`);
    if (!carreraResult.recordset.length) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }
    const idCarrera = carreraResult.recordset[0].ID_Carrera;

    // 2. Cursos que puede llevar el estudiante (según prerrequisitos, no aprobados y asociados a su carrera)
    const cursosResult = await pool.request()
      .input('idEstudiante', idEstudiante)
      .input('idPeriodo', idPeriodo)
      .input('idCarrera', idCarrera)
      .query(`
        SELECT C.ID_Curso, C.Codigo, C.Nombre, C.Creditos
        FROM CURSO C
        INNER JOIN CURSOS_CARRERAS CC ON CC.ID_Curso = C.ID_Curso
        WHERE 
          CC.ID_Carrera = @idCarrera
          AND C.ID_Curso NOT IN (
            SELECT SC.ID_Curso
            FROM CALIFICACION CAL
            JOIN MATRICULA M ON CAL.ID_Matricula = M.ID_Matricula
            JOIN SECCION SC ON SC.ID_Seccion = M.ID_Seccion
            WHERE M.ID_Estudiante = @idEstudiante
              AND CAL.Estado = 'Aprobado'
              AND CAL.Activo = 1 -- Solo calificaciones activas
          )
          AND NOT EXISTS (
            SELECT 1
            FROM PRERREQUISITO PR
            WHERE PR.ID_Curso = C.ID_Curso
              AND NOT EXISTS (
                SELECT 1
                FROM CALIFICACION CAL
                JOIN MATRICULA M ON CAL.ID_Matricula = M.ID_Matricula
                JOIN SECCION SC ON SC.ID_Seccion = M.ID_Seccion
                WHERE M.ID_Estudiante = @idEstudiante
                  AND CAL.Estado = 'Aprobado'
                  AND CAL.Activo = 1 -- Solo calificaciones activas
                  AND SC.ID_Curso = PR.ID_Curso_Prerequisito
              )
          )
      `);

    const cursos = cursosResult.recordset;

    // 3. Para cada curso, obtener secciones abiertas en el periodo activo
    for (const curso of cursos) {
      const seccionesResult = await pool.request()
        .input('idCurso', curso.ID_Curso)
        .input('idPeriodo', idPeriodo)
        .query(`
          SELECT S.ID_Seccion, S.Codigo, S.Modalidad, S.Hora
          FROM SECCION S
          WHERE S.ID_Curso = @idCurso AND S.ID_Periodo = @idPeriodo
        `);
      curso.secciones = seccionesResult.recordset;
    }

    res.json(cursos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener cursos y secciones disponibles" });
  }
});

	// Endpoint para login de usuario administrativo
app.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;
  try {
    const pool = await obtenerConexionDB();
    // Usar el procedimiento almacenado para validar login con clave fija
    const result = await pool.request()
      .input("Usuario", usuario)
      .input("Password", contrasena)
      .execute("ValidarLogin");
    if (result.recordset.length === 1 && result.recordset[0].Usuario) {
      // Usuario autenticado
      res.json({ success: true, usuario: result.recordset[0].Usuario, nombre: result.recordset[0].Nombre });
    } else {
      res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

app.put("/matriculas/:id/inactivar", async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    if (!motivo) {
      return res.status(400).json({ error: "Motivo requerido" });
    }
    const pool = await obtenerConexionDB();
    await pool.request()
      .input('ID_Matricula', id)
      .input('Motivo', motivo)
      .execute('InactivarMatriculaYCalificaciones');
    res.json({ message: "Matrícula y calificaciones inactivadas correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al inactivar matrícula y calificaciones" });
  }
});

app.put("/admisiones/:id/inactivar", async (req, res) => {
  try {
    let { id } = req.params;
    let { motivo, idEstudiante } = req.body;
    
    if (!motivo || !idEstudiante) {
      return res.status(400).json({ error: "Motivo e ID de estudiante requeridos" });
    }

    const pool = await obtenerConexionDB();
    await pool.request()
      .input('ID_Admision', id)
      .input('ID_Estudiante', idEstudiante)
      .input('Motivo', motivo)
      .execute('InactivarAdmisionCascada');
    res.json({ message: "Admisión y datos asociados inactivados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al inactivar admisión y datos asociados" });
  }
});


//para widgets en estudiantes
// Ejemplo de endpoint en server.js
app.get("/estudiantes-con-carrera", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    const result = await pool.request().query(`
      SELECT 
        E.ID_Estudiante,
        E.Nombres,
        E.Apellidos,
        E.DNI,
        E.Correo_Electronico,
        E.Telefono,
        E.Fecha_Nacimiento,
        E.Activo,
        A.ID_Carrera
      FROM ESTUDIANTE E
      INNER JOIN ADMISIONES A ON E.ID_Estudiante = A.ID_Estudiante
    `);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiantes con carrera" });
  }
});

// Ejemplo de endpoint en server.js
app.get("/dashboard/matriculas-por-periodo-activo", async (req, res) => {
  try {
    const pool = await obtenerConexionDB();
    // Obtén el periodo académico activo
    const periodoResult = await pool.request().query(`
      SELECT TOP 1 ID_Periodo FROM PERIODO_ACADEMICO WHERE Activo = 1
    `);
    if (periodoResult.recordset.length === 0) {
      return res.json({ activos: 0, inactivos: 0 });
    }
    const idPeriodo = periodoResult.recordset[0].ID_Periodo;

    // Cuenta matrículas activas e inactivas en ese periodo
    const result = await pool.request()
      .input('idPeriodo', idPeriodo)
      .query(`
        SELECT 
          SUM(CASE WHEN M.Activo = 1 THEN 1 ELSE 0 END) AS activos,
          SUM(CASE WHEN M.Activo = 0 THEN 1 ELSE 0 END) AS inactivos
        FROM MATRICULA M
        INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
        WHERE S.ID_Periodo = @idPeriodo
      `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener métricas de matrículas" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
