Trabajo Practico N° 3 de Base de datos.

Ejercicio 1: Filtrado básico con $match
Objetivo:
Practicar el uso de $match para filtrar documentos.

Tarea:
Encontrar todos los productos de la categoría "Electrónica" con un precio superior a 500.
Encontrar todas las ventas realizadas a clientes de "España" que tengan estado "Entregado".
Etapa del Pipeline:
$match

Ejercicio 2: Agrupación y agregación con $group
Objetivo:
Utilizar $group para agrupar documentos y aplicar operadores de acumulación.

Tarea:
Calcular el precio promedio, máximo y mínimo por categoría de producto.
Obtener el total de ventas por país del cliente, incluyendo la cantidad de transacciones y el monto total.
Etapas del Pipeline:
$group, $sort

Ejercicio 3: Transformación de documentos con $project
Objetivo:
Transformar la estructura de los documentos utilizando $project.

Tarea:
Crear una proyección de productos que incluya solo el nombre, precio, y una nueva propiedad llamada "precioConImpuesto" que sea el precio + 21% de IVA.
Para la colección de ventas, crear una proyección que incluya el ID de venta, el nombre del cliente, el total y una nueva propiedad "descuento" que sea el 10% del total.
Etapas del Pipeline:
$project

Ejercicio 4: Deconstrucción de arrays con $unwind
Objetivo:
Comprender y aplicar $unwind para trabajar con arrays.

Tarea:
Deconstruir el array de valoraciones de productos para obtener una lista plana donde cada documento contenga una valoración individual.
Luego, agrupar por puntuación y contar cuántas valoraciones hay de cada puntuación.
Etapas del Pipeline:
$unwind, $group, $sort

Ejercicio 5: Combinación de colecciones con $lookup
Objetivo:
Aprender a realizar operaciones de "join" con $lookup.

Tarea:
Enriquecer cada documento de ventas con la información completa del producto vendido (mediante un lookup a la colección productos).
Calcular el total vendido por categoría de producto.
Etapas del Pipeline:
$lookup, $project, $group

Ejercicio 6: Trabajo con fechas
Objetivo:
Practicar con operadores de fecha en el pipeline de agregación.

Tarea:
Agrupar las ventas por mes y calcular el total vendido en cada mes.
Encontrar el día de la semana con más ventas.
Etapas del Pipeline:
$project, $group, $sort

Ejercicio 7: Operadores condicionales
Objetivo:
Utilizar operadores condicionales en el pipeline.

Tarea:
Clasificar los productos según su precio: "Económico" (<100), "Estándar" (100-500), "Premium" (>500).
Clasificar las ventas según su total: "Pequeña" (<200), "Mediana" (200-800), "Grande" (>800).
Etapas del Pipeline:
$project, $group

Ejercicio 8: Pipeline complejo
Objetivo:
Combinar múltiples etapas en un pipeline complejo.

Tarea:
Obtener un informe de ventas que incluya:

Top 3 productos más vendidos (por cantidad)
Para cada producto: nombre, categoría, total de unidades vendidas, monto total generado
Puntuación promedio en valoraciones
Etapas del Pipeline:
Combinar múltiples etapas vistas anteriormente
