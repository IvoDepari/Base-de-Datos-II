MATCH (e:Estudiante)-[:REALIZA]->(p:Prestamo {estado: "Activo"})-[:CONTIENE]->(l:Libro)
RETURN e.nombre AS estudiante, l.nombre AS libro, p.fecha AS fecha
ORDER BY p.fecha;

MATCH (e:Estudiante)-[:REALIZA]->(p:Prestamo)
RETURN e.nombre AS estudiante, COUNT(p) AS total_prestamos
ORDER BY total_prestamos DESC;

MATCH (:Estudiante)-[:REALIZA]->(p:Prestamo {estado: "Activo"})-[:CONTIENE]->(l:Libro)-[:ES_CATEGORIA]->(c:Categoria)
RETURN c.nombre AS categoria, COUNT(p) AS prestamos_activos
ORDER BY prestamos_activos DESC;

MATCH (e:Estudiante)
WHERE NOT (e)-[:REALIZA]->(:Prestamo {estado: "Activo"})
RETURN e.nombre AS estudiante;