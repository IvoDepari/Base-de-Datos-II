🔹Ejercicio 1: 
Al eliminar un estudiante con cursos inscritos, se rompe la relación entre las tablas Estudiantes y Matriculas.
Se debe utilizar claves foráneas en la tabla Matriculas con la regla ON DELETE RESTRICT que impide la eliminación del estudiante si existen registros relacionados.

Ejemplo: 
ALTER TABLE Matriculas
ADD CONSTRAINT fk_estudiante
FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id)
ON DELETE RESTRICT;

-------------------------------------------------------------------------------------------

🔹Ejercicio 2: Implementación de Restricciones
Crear tabla y probar integridad referencial:

sql
CREATE TABLE Matriculas (
    MatriculaID INT PRIMARY KEY,
    EstudianteID INT,
    CursoID INT,
    FOREIGN KEY (EstudianteID) REFERENCES Estudiantes(ID)
);

INSERT INTO Matriculas (MatriculaID, EstudianteID, CursoID)
VALUES (1, 999, 101); -- Esto generará un error si el estudiante no existe.
Esto muestra cómo las claves foráneas aseguran la integridad.

-------------------------------------------------------------------------------------------

🔹Ejercicio 3: Concurrencia
Simular condiciones de aislamiento: Para mostrar la diferencia entre READ COMMITTED y SERIALIZABLE:

-- Usuario 1
BEGIN TRANSACTION;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
UPDATE Cuentas SET saldo = saldo - 100 WHERE CuentaID = 1;
*no hace commit, la transacción todavía no termino*

-- Usuario 2
BEGIN TRANSACTION;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE Cuentas SET saldo = saldo + 100 WHERE CuentaID = 1;

COMMIT;

*ERROR DE ESPERA* *detecto que alguien esta intentando cambiar los mismos datos y tira error para que no haya interferencia*

Analiza los resultados según el nivel de aislamiento.


-------------------------------------------------------------------------------------------

🔹Ejercicio 4: Plan de Ejecución
Comparar rendimiento con índice:

EXPLAIN SELECT * FROM Productos WHERE Precio > 100;

CREATE INDEX idx_precio ON Productos(Precio);

EXPLAIN SELECT * FROM Productos WHERE Precio > 100;
Usa EXPLAIN para observar las diferencias.

-------------------------------------------------------------------------------------------

🔹Ejercicio 5: Creación de Índices
Consulta con índices: Crea índices para comparar rendimiento en consultas de múltiples campos.

CREATE INDEX idx_campo1 ON Ventas(Campo1);
CREATE INDEX idx_campo2 ON Ventas(Campo2);
Luego mide el impacto con EXPLAIN.

-------------------------------------------------------------------------------------------

🔹Ejercicio 6: Vistas
Resumen de ventas mensuales y productos más vendidos:

CREATE VIEW VentasMensuales AS
SELECT ProductoID, SUM(Cantidad) AS TotalVentas
FROM Ventas
GROUP BY ProductoID;

SELECT * FROM VentasMensuales
ORDER BY TotalVentas DESC
LIMIT 5;
Esto resume y clasifica las ventas.

-------------------------------------------------------------------------------------------

🔹Ejercicio 7: Gestión de Permisos
Crear usuario analista:

CREATE USER analista IDENTIFIED BY 'password';
GRANT SELECT ON Ventas TO analista;

-- Intentar insertar:
INSERT INTO Ventas VALUES (...); -- Esto fallará debido a los permisos.

-------------------------------------------------------------------------------------------

🔹Ejercicio 8: Seguridad y Auditoría
Auditoría con triggers:

CREATE TRIGGER AuditarClientes
AFTER UPDATE ON Clientes
FOR EACH ROW
BEGIN
    INSERT INTO LogModificaciones (ClienteID, Fecha, Cambio)
    VALUES (OLD.ClienteID, NOW(), 'Actualización');
END;

-------------------------------------------------------------------------------------------

🔹Ejercicio 9: Backup y Restore
MySQL ejemplo:

Backup
mysqldump -u usuario -p nombre_base_datos > backup.sql

Restore:
mysql -u usuario -p nombre_base_datos < backup.sql
