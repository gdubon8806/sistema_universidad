SELECT 
    C.Codigo_Carrera AS codigo,
    C.Nombre AS nombre,
    F.Nombre AS facultad
FROM 
    CARRERA C
INNER JOIN 
    FACULTAD F ON C.ID_Facultad = F.ID_Facultad