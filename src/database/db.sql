-- Crear base de datos
CREATE DATABASE UniTrackDB;
GO

-- Usar la base de datos recién creada
USE UniTrackDB;
GO

-- Crear tabla FACULTAD
CREATE TABLE FACULTAD (
    ID_Facultad INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL
);
GO

-- Crear tabla CARRERA
CREATE TABLE CARRERA (
    ID_Carrera INT PRIMARY KEY IDENTITY(1,1),
    Codigo_Carrera NVARCHAR(10) NOT NULL UNIQUE,
    Nombre NVARCHAR(100) NOT NULL,
    ID_Facultad INT NOT NULL,
    FOREIGN KEY (ID_Facultad) REFERENCES FACULTAD(ID_Facultad)
);
GO

-- Crear tabla ESTUDIANTE
CREATE TABLE ESTUDIANTE (
    ID_Estudiante INT PRIMARY KEY IDENTITY(1,1),
    Nombres NVARCHAR(100) NOT NULL,
    Apellidos NVARCHAR(100) NOT NULL,
    DNI NVARCHAR(20) NOT NULL UNIQUE,
    Correo_Electronico NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20),
    Fecha_Nacimiento DATE NOT NULL
);
GO

-- Crear tabla ADMISIONES
CREATE TABLE ADMISIONES (
    ID_Admision INT PRIMARY KEY IDENTITY(1,1),
    ID_Estudiante INT NOT NULL,
    ID_Carrera INT NOT NULL,
    Fecha_Ingreso DATE NOT NULL,
    FOREIGN KEY (ID_Estudiante) REFERENCES ESTUDIANTE(ID_Estudiante),
    FOREIGN KEY (ID_Carrera) REFERENCES CARRERA(ID_Carrera)
);
GO

-- 1. Tabla EDIFICIO
CREATE TABLE EDIFICIO (
    ID_Edificio INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Edificio NVARCHAR(100) NOT NULL,
    Ubicacion NVARCHAR(150)
);
GO

-- 2. Tabla AULA
CREATE TABLE AULA (
    ID_Aula INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Aula NVARCHAR(100) NOT NULL,
    ID_Edificio INT NOT NULL,
    FOREIGN KEY (ID_Edificio) REFERENCES EDIFICIO(ID_Edificio)
);
GO

-- 3. Tabla PROFESOR
CREATE TABLE PROFESOR (
    ID_Profesor INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Apellido NVARCHAR(100) NOT NULL,
    DNI NVARCHAR(20) NOT NULL UNIQUE,
    Correo_Electronico NVARCHAR(100),
    Telefono NVARCHAR(20)
);
GO

-- 4. Tabla CURSO
CREATE TABLE CURSO (
    ID_Curso INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Creditos INT NOT NULL,
    Requisitos NVARCHAR(MAX) -- opcional: texto libre (puede dejarse vacío)
);
GO

-- 5. Tabla CURSOS_CARRERAS (tabla intermedia)
CREATE TABLE CURSOS_CARRERAS (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ID_Curso INT NOT NULL,
    ID_Carrera INT NOT NULL,
    Requisitos NVARCHAR(MAX),
    FOREIGN KEY (ID_Curso) REFERENCES CURSO(ID_Curso),
    FOREIGN KEY (ID_Carrera) REFERENCES CARRERA(ID_Carrera)
);
GO

-- 6. Tabla SECCION
CREATE TABLE SECCION (
    ID_Seccion INT PRIMARY KEY IDENTITY(1,1),
    Codigo NVARCHAR(20) NOT NULL,
    ID_Curso INT NOT NULL,
    Modalidad NVARCHAR(50) NOT NULL, -- Ej: Presencial, Virtual, Semi
    ID_Profesor INT NOT NULL,
    ID_Aula INT NOT NULL,
    Hora NVARCHAR(50),     -- Ej: "08:00 - 09:30"
    Dias NVARCHAR(50),     -- Ej: "Lunes y Miércoles"
    Cupos INT NOT NULL,
    FOREIGN KEY (ID_Curso) REFERENCES CURSO(ID_Curso),
    FOREIGN KEY (ID_Profesor) REFERENCES PROFESOR(ID_Profesor),
    FOREIGN KEY (ID_Aula) REFERENCES AULA(ID_Aula)
);
GO

CREATE TABLE MATRICULA (
    ID_Matricula INT PRIMARY KEY IDENTITY(1,1),
    Fecha_Matricula DATE NOT NULL,
    ID_Estudiante INT NOT NULL,
    ID_Seccion INT NOT NULL,
    FOREIGN KEY (ID_Estudiante) REFERENCES ESTUDIANTE(ID_Estudiante),
    FOREIGN KEY (ID_Seccion) REFERENCES SECCION(ID_Seccion)
);


ALTER TABLE CURSO
ADD Codigo NVARCHAR(20) NOT NULL DEFAULT 'CUR-000';

CREATE TABLE CALIFICACION (
    ID_Calificacion INT PRIMARY KEY IDENTITY(1,1),
    ID_Matricula INT NOT NULL,       -- Referencia a qué estudiante y sección
    Nota DECIMAL(5,2) NOT NULL,      -- Ej: 85.75
    Fecha_Registro DATE DEFAULT GETDATE(),
    FOREIGN KEY (ID_Matricula) REFERENCES MATRICULA(ID_Matricula)
);



CREATE TABLE PERIODO_ACADEMICO (
    ID_Periodo INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(20) NOT NULL,         -- Ej: '2025-I', '2025-II'
    Fecha_Inicio DATE NOT NULL,
    Fecha_Fin DATE NOT NULL
);

-- Agregar columna ID_Periodo a la tabla SECCION
ALTER TABLE SECCION
ADD ID_Periodo INT;

-- Crear la clave foránea
ALTER TABLE SECCION
ADD CONSTRAINT FK_Seccion_Periodo
FOREIGN KEY (ID_Periodo) REFERENCES PERIODO_ACADEMICO(ID_Periodo);


-- Agregar columna ID_Periodo a la tabla MATRICULA
ALTER TABLE MATRICULA
ADD ID_Periodo INT;

-- Crear la clave foránea
ALTER TABLE MATRICULA
ADD CONSTRAINT FK_Matricula_Periodo
FOREIGN KEY (ID_Periodo) REFERENCES PERIODO_ACADEMICO(ID_Periodo);



CREATE TABLE PRERREQUISITO (
    ID_Curso INT NOT NULL,                -- Ej: Programación II
    ID_Curso_Prerequisito INT NOT NULL,  -- Ej: Programación I
    PRIMARY KEY (ID_Curso, ID_Curso_Prerequisito),

    FOREIGN KEY (ID_Curso) REFERENCES CURSO(ID_Curso),
    FOREIGN KEY (ID_Curso_Prerequisito) REFERENCES CURSO(ID_Curso)
);


-- Agregar la columna Estado (puede ser NULL al principio si ya hay datos)
ALTER TABLE CALIFICACIONES
ADD Estado NVARCHAR(10);




