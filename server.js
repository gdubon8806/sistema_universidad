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
        A.Fecha_Ingreso AS fecha_ingreso
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
        E.ID_Estudiante,
        E.Nombres,
        E.Apellidos,
        E.DNI,
        E.Correo_Electronico,
        E.Telefono,
        E.Fecha_Nacimiento,
        C.Nombre AS Carrera
      FROM ESTUDIANTE E
      LEFT JOIN ADMISIONES A ON E.ID_Estudiante = A.ID_Estudiante
      LEFT JOIN CARRERA C ON A.ID_Carrera = C.ID_Carrera
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los estudiantes" });
  }
});

app.post("/matriculas", async (req, res) => {
  try {
    const { fecha, idEstudiante, idSeccion } = req.body;

    if (!fecha || !idEstudiante || !idSeccion) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const pool = await obtenerConexionDB();
    await pool.request()
      .input('fecha', fecha)
      .input('idEstudiante', idEstudiante)
      .input('idSeccion', idSeccion)
      .query(`
        INSERT INTO MATRICULA (Fecha_Matricula, ID_Estudiante, ID_Seccion)
        VALUES (@fecha, @idEstudiante, @idSeccion)
      `);

    res.status(201).json({ message: "Matrícula agregada correctamente" });
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
        C.Nombre AS Curso
      FROM MATRICULA M
      INNER JOIN ESTUDIANTE E ON M.ID_Estudiante = E.ID_Estudiante
      INNER JOIN SECCION S ON M.ID_Seccion = S.ID_Seccion
      INNER JOIN CURSO C ON S.ID_Curso = C.ID_Curso
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

    const [estudiantes, docentes, materias, secciones, matriculas] = await Promise.all([
      pool.request().query("SELECT COUNT(*) AS total FROM ESTUDIANTE"),
      pool.request().query("SELECT COUNT(*) AS total FROM PROFESOR"),
      pool.request().query("SELECT COUNT(*) AS total FROM CURSO"),
      pool.request().query("SELECT COUNT(*) AS total FROM SECCION"),
      pool.request().query("SELECT COUNT(*) AS total FROM MATRICULA")
    ]);

    res.json({
      estudiantes: estudiantes.recordset[0].total,
      docentes: docentes.recordset[0].total,
      materias: materias.recordset[0].total,
      secciones: secciones.recordset[0].total,
      matriculas: matriculas.recordset[0].total
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
        C.Estado AS Estado
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


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
