CREATE 
        (e1:Estudiante {nombre: "Giuseppe"}),
        (e2:Estudiante {nombre: "Ivo"}),
        (e3:Estudiante {nombre: "Lucas"}),
        (e4:Estudiante {nombre: "Franco"}),

        (l1:Libro {nombre: "Arquitectura de Datos Modernos"}),
        (l2:Libro {nombre: "Álgebra para Ingeniería"}),
        (l3:Libro {nombre: "Tecnología del Futuro"}),
        (l4:Libro {nombre: "Fundamentos de Matemáticas"}),

        (c1:Carrera {nombre: "Tecnicatura en Programación"}),
        (c2:Carrera {nombre: "Ingeniería Civil"}),

        (cat1:Categoria {nombre: "Datos"}),        
        (cat2:Categoria {nombre: "Álgebra"}),
        (cat3:Categoria {nombre: "Tecnología"}),
        (cat4:Categoria {nombre: "Matemáticas"}),

        (l1)-[:ES_CATEGORIA]->(cat1),
        (l2)-[:ES_CATEGORIA]->(cat2),
        (l3)-[:ES_CATEGORIA]->(cat3),
        (l4)-[:ES_CATEGORIA]->(cat4),

        (e1)-[:ESTUDIA]->(c1),
        (e2)-[:ESTUDIA]->(c2),
        (e3)-[:ESTUDIA]->(c1),
        (e4)-[:ESTUDIA]->(c2),

        (e1)-[:REALIZA]->(p1:Prestamo {fecha:"2025-07-01", estado:"Activo"})-[:CONTIENE]->(l1),
        (e2)-[:REALIZA]->(p2:Prestamo {fecha:"2025-06-27", estado:"Activo"})-[:CONTIENE]->(l2),
        (e3)-[:REALIZA]->(p3:Prestamo {fecha:"2025-07-02", estado:"Activo"})-[:CONTIENE]->(l3),
        (e4)-[:REALIZA]->(p4:Prestamo {fecha:"2025-06-11", estado:"Devuelto"})-[:CONTIENE]->(l4);