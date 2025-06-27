-- INSERTS
INSERT INTO FACULTAD (Nombre, Activo) VALUES
('Ingeniería y Tecnología',1),
('Ciencias Administrativas',1),
('Ciencias de la Salud',1);
GO

-- 2. CARRERA (3 registros, vinculadas a facultades)
INSERT INTO CARRERA (Codigo_Carrera, Nombre, ID_Facultad, Activo) VALUES
('INF-001','Ingeniería en Informática',1,1),
('ADM-001','Administración de Empresas',2,1),
('CON-001','Contaduría Pública',2,1);
GO

-- 3. EDIFICIO (2 registros)
INSERT INTO EDIFICIO (Nombre_Edificio, Ubicacion, Activo) VALUES
('Sede Norte','Boulevard del Norte, San Pedro Sula',1),
('Sede Central','Boulevard UNAH-VS, San Pedro Sula',1);
GO

-- 4. AULA (5 registros)
INSERT INTO AULA (Nombre_Aula, ID_Edificio, Activo) VALUES
('Aula 101',1,1),('Aula 102',1,1),('Laboratorio Informática',1,1),
('Aula 201',2,1),('Aula 108',2,1);
GO

-- 5. PROFESOR (5 registros)
INSERT INTO PROFESOR (Nombre, Apellido, DNI, Correo_Electronico, Telefono, Activo) VALUES
('Carlos','Hernández','0801199801234','chernandez@ceutec.hn','2233-4455',1),
('María','González','0802199705678','mgonzalez@ceutec.hn','2233-4466',1),
('Luis','Ramírez','0803199609123','lramirez@ceutec.hn','2233-4477',1),
('Ana','Flores','0804199503456','aflores@ceutec.hn','2233-4488',1),
('José','Vásquez','0805199407890','jvasquez@ceutec.hn','2233-4499',1);
GO

-- 6. CURSO (8 por carrera = 24 registros)
-- Informática
INSERT INTO CURSO (Nombre, Creditos, Requisitos, Codigo, Activo) VALUES
('Programación I',3,NULL,'CUR-INF-001',1),
('Programación II',3,'Programación I','CUR-INF-002',1),
('Bases de Datos',3,'Programación I','CUR-INF-003',1),
('Estructuras de Datos',3,'Programación II','CUR-INF-004',1),
('Sistemas Operativos',3,'Programación II','CUR-INF-005',1),
('Redes de Computadoras',3,NULL,'CUR-INF-006',1),
('Desarrollo Web',3,'Programación I','CUR-INF-007',1),
('Ingeniería de Software',4,'Estructuras de Datos','CUR-INF-008',1);
-- Administración
INSERT INTO CURSO (Nombre, Creditos, Requisitos, Codigo, Activo) VALUES
('Introducción a la Administración',3,NULL,'CUR-ADM-001',1),
('Mercadotecnia',3,'Introducción a la Administración','CUR-ADM-002',1),
('Finanzas I',3,'Introducción a la Administración','CUR-ADM-003',1),
('Gestión de Recursos Humanos',3,NULL,'CUR-ADM-004',1),
('Contabilidad I',3,NULL,'CUR-ADM-005',1),
('Estadística Aplicada',3,NULL,'CUR-ADM-006',1),
('Comportamiento Organizacional',3,'Introducción a la Administración','CUR-ADM-007',1),
('Emprendimiento',3,NULL,'CUR-ADM-008',1);
-- Contaduría
INSERT INTO CURSO (Nombre, Creditos, Requisitos, Codigo, Activo) VALUES
('Contabilidad Intermedia',3,'Contabilidad I','CUR-CON-001',1),
('Auditoría',3,'Contabilidad Intermedia','CUR-CON-002',1),
('Impuestos',3,NULL,'CUR-CON-003',1),
('Costos',3,'Contabilidad I','CUR-CON-004',1),
('Legislación Tributaria',3,NULL,'CUR-CON-005',1),
('Contabilidad Financiera',3,'Contabilidad Intermedia','CUR-CON-006',1),
('Ética Profesional',2,NULL,'CUR-CON-007',1),
('Sistemas Contables',3,'Bases de Datos','CUR-CON-008',1);
GO

-- 7. CURSOS_CARRERAS (vinculación)
-- Informática = IDs 1–8
INSERT INTO CURSOS_CARRERAS (ID_Curso, ID_Carrera, Requisitos, Activo)
SELECT ID_Curso, 1, Requisitos, 1 FROM CURSO WHERE Codigo LIKE 'CUR-INF-%';
-- Administración = IDs 9–16
INSERT INTO CURSOS_CARRERAS (ID_Curso, ID_Carrera, Requisitos, Activo)
SELECT ID_Curso, 2, Requisitos, 1 FROM CURSO WHERE Codigo LIKE 'CUR-ADM-%';
-- Contaduría = IDs 17–24
INSERT INTO CURSOS_CARRERAS (ID_Curso, ID_Carrera, Requisitos, Activo)
SELECT ID_Curso, 3, Requisitos, 1 FROM CURSO WHERE Codigo LIKE 'CUR-CON-%';
GO

-- 8. PERIODO_ACADEMICO (2 registros)
INSERT INTO PERIODO_ACADEMICO (Nombre, Fecha_Inicio, Fecha_Fin, Activo) VALUES
('2025-Q3','2025-07-17','2025-09-25',1),
('2025-Q4','2025-10-15','2025-12-18',0);
GO

-- 9. ESTUDIANTE (10 registros)
INSERT INTO ESTUDIANTE (Nombres, Apellidos, DNI, Correo_Electronico, Telefono, Fecha_Nacimiento, Activo) VALUES
('Andrés','Pérez','0801190001111','aperez@correo.com','2233-4601','2000-05-10',1),
('Beatriz','Gómez','0802190002222','bgomez@correo.com','2233-4602','1999-07-20',1),
('Carlos','Ulloa','0803190003333','culloa@correo.com','2233-4603','2001-03-15',1),
('Daniela','Sánchez','0804190004444','dsanchez@correo.com','2233-4604','2000-11-05',1),
('Ernesto','Morales','0805190005555','emorales@correo.com','2233-4605','1998-01-25',1),
('Fernanda','López','0806190006666','flopez@correo.com','2233-4606','1999-12-12',1),
('Gabriel','Ramírez','0807190007777','gramirez@correo.com','2233-4607','2001-04-30',1),
('Helena','Vargas','0808190008888','hvargas@correo.com','2233-4608','2000-09-17',1),
('Iván','Ortiz','0809190009999','iortiz@correo.com','2233-4609','1999-02-28',1),
('Jazmín','Reyes','0810190010000','jreyes@correo.com','2233-4610','2001-08-08',1);
GO

-- 10. ADMISIONES (10 registros)
INSERT INTO ADMISIONES (ID_Estudiante, ID_Carrera, Fecha_Ingreso, Activo) VALUES
(1,1,'2025-06-15',1),
(2,1,'2025-06-16',1),
(3,2,'2025-06-17',1),
(4,2,'2025-06-18',1),
(5,3,'2025-06-19',1),
(6,3,'2025-06-20',1),
(7,1,'2025-07-01',1),
(8,2,'2025-07-02',1),
(9,3,'2025-07-03',1),
(10,1,'2025-07-04',1);
GO

-- 11. SECCION (8 registros representativos)
INSERT INTO SECCION (Codigo, ID_Curso, Modalidad, ID_Profesor, ID_Aula, Hora, Dias, Cupos, ID_Periodo, Activo) VALUES
('INF-1A',1,'Presencial',1,1,'08:00-09:30','Lun Mié',30,1,1),
('INF-2A',2,'Presencial',2,2,'10:00-11:30','Mar Jue',30,1,1),
('ADM-1A',9,'Presencial',3,4,'08:00-09:30','Lun Mié',25,1,1),
('ADM-2A',10,'Presencial',4,5,'10:00-11:30','Mar Jue',25,1,1),
('CON-1A',17,'Presencial',5,4,'08:00-09:30','Lun Mié',20,1,1),
('CON-2A',18,'Presencial',1,5,'10:00-11:30','Mar Jue',20,1,1),
('INF-V1',3,'Virtual',2,1,'18:00-19:30','Lun Mié',40,1,1),
('ADM-V1',13,'Virtual',3,4,'18:00-19:30','Mar Jue',35,1,1);
GO

Select * from SECCION

-- 12. MATRICULA (8 registros)
INSERT INTO MATRICULA (Fecha_Matricula, ID_Estudiante, ID_Seccion, ID_Periodo, Activo) VALUES
('2025-06-20',1,1,1,1),
('2025-06-20',2,2,1,1),
('2025-06-21',3,3,1,1),
('2025-06-21',4,4,1,1),
('2025-06-22',5,5,1,1),
('2025-06-22',6,6,1,1),
('2025-07-01',7,7,1,1),
('2025-07-01',8,8,1,1);
GO


-- 13. CALIFICACION (8 registros)
INSERT INTO CALIFICACION (ID_Matricula, Nota, Estado, Activo) VALUES
(10,90.50,'Aprobado',1),(11,85.00,'Aprobado',1),
(12,78.25,'Aprobado',1),(13,92.00,'Aprobado',1),
(14,88.75,'Aprobado',1),(15,81.00,'Aprobado',1),
(16,95.00,'Aprobado',1),(17,74.50,'Aprobado',1);
GO

-- 14. PRERREQUISITO (3 ejemplos)
-- Informática
INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-INF-002' AND C2.Codigo = 'CUR-INF-001'; -- Prog II ← Prog I

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-INF-003' AND C2.Codigo = 'CUR-INF-001'; -- BD ← Prog I

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-INF-004' AND C2.Codigo = 'CUR-INF-002'; -- Estruct ← Prog II

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-INF-005' AND C2.Codigo = 'CUR-INF-002'; -- SO ← Prog II

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-INF-007' AND C2.Codigo = 'CUR-INF-001'; -- Web ← Prog I

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-INF-008' AND C2.Codigo = 'CUR-INF-004'; -- Ing SW ← Estruct

-- Administración
INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-ADM-002' AND C2.Codigo = 'CUR-ADM-001'; -- Merc ← Intro Adm

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-ADM-003' AND C2.Codigo = 'CUR-ADM-001'; -- Finanzas ← Intro Adm

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-ADM-007' AND C2.Codigo = 'CUR-ADM-001'; -- Comp Org ← Intro Adm

-- Contaduría
INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-CON-001' AND C2.Codigo = 'CUR-ADM-005'; -- Cont Interm ← Cont I

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-CON-002' AND C2.Codigo = 'CUR-CON-001'; -- Auditoría ← Cont Interm

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-CON-004' AND C2.Codigo = 'CUR-ADM-005'; -- Costos ← Cont I

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-CON-006' AND C2.Codigo = 'CUR-CON-001'; -- Cont Financiera ← Cont Interm

INSERT INTO PRERREQUISITO (ID_Curso, ID_Curso_Prerequisito, Activo)
SELECT C1.ID_Curso, C2.ID_Curso, 1
FROM CURSO C1, CURSO C2
WHERE C1.Codigo = 'CUR-CON-008' AND C2.Codigo = 'CUR-INF-003'; -- Sist Contables ← BD
GO

