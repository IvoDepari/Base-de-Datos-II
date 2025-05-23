# Trabajo Práctico N°3 - Base de Datos

Este trabajo práctico tiene como objetivo practicar las distintas etapas del **aggregation pipeline** en MongoDB. A continuación se detallan los ejercicios a resolver.

---

## Ejercicio 1: Filtrado básico con `$match`

**Objetivo:**  
Practicar el uso de `$match` para filtrar documentos.

**Tareas:**
- Encontrar todos los productos de la categoría **"Electrónica"** con un **precio superior a 500**.
- Encontrar todas las ventas realizadas a **clientes de "España"** que tengan estado **"Entregado"**.

**Etapa del Pipeline:**
- `$match`

---

## Ejercicio 2: Agrupación y agregación con `$group`

**Objetivo:**  
Utilizar `$group` para agrupar documentos y aplicar operadores de acumulación.

**Tareas:**
- Calcular el **precio promedio, máximo y mínimo** por **categoría de producto**.
- Obtener el **total de ventas por país del cliente**, incluyendo:
  - **Cantidad de transacciones**
  - **Monto total vendido**

**Etapas del Pipeline:**
- `$group`, `$sort`

---

## Ejercicio 3: Transformación de documentos con `$project`

**Objetivo:**  
Transformar la estructura de los documentos utilizando `$project`.

**Tareas:**
- Crear una proyección de productos que incluya:
  - `nombre`
  - `precio`
  - Una nueva propiedad `precioConImpuesto` (precio + 21% de IVA)
- Para la colección de ventas, crear una proyección que incluya:
  - `ID de venta`
  - `nombre del cliente`
  - `total`
  - Una nueva propiedad `descuento` (10% del total)

**Etapa del Pipeline:**
- `$project`

---

## Ejercicio 4: Deconstrucción de arrays con `$unwind`

**Objetivo:**  
Comprender y aplicar `$unwind` para trabajar con arrays.

**Tareas:**
- Deconstruir el array de **valoraciones de productos** para obtener una lista plana donde cada documento contenga una **valoración individual**.
- Agrupar por **puntuación** y contar cuántas valoraciones hay de cada tipo.

**Etapas del Pipeline:**
- `$unwind`, `$group`, `$sort`

---

## Ejercicio 5: Combinación de colecciones con `$lookup`

**Objetivo:**  
Aprender a realizar operaciones de *join* con `$lookup`.

**Tareas:**
- Enriquecer cada documento de ventas con la información completa del **producto vendido** (lookup a la colección `productos`).
- Calcular el **total vendido por categoría de producto**.

**Etapas del Pipeline:**
- `$lookup`, `$project`, `$group`

---

## Ejercicio 6: Trabajo con fechas

**Objetivo:**  
Practicar con operadores de fecha en el pipeline de agregación.

**Tareas:**
- Agrupar las ventas por **mes** y calcular el **total vendido** en cada uno.
- Encontrar el **día de la semana** con más ventas.

**Etapas del Pipeline:**
- `$project`, `$group`, `$sort`

---

## Ejercicio 7: Operadores condicionales

**Objetivo:**  
Utilizar operadores condicionales en el pipeline.

**Tareas:**
- Clasificar los productos según su precio:
  - `"Económico"`: `< 100`
  - `"Estándar"`: `100 - 500`
  - `"Premium"`: `> 500`
- Clasificar las ventas según su total:
  - `"Pequeña"`: `< 200`
  - `"Mediana"`: `200 - 800`
  - `"Grande"`: `> 800`

**Etapas del Pipeline:**
- `$project`, `$group`

---

## Ejercicio 8: Pipeline complejo

**Objetivo:**  
Combinar múltiples etapas en un pipeline complejo.

**Tarea:**  
Obtener un informe de ventas que incluya:

- **Top 3 productos más vendidos** (por cantidad)
- Para cada producto:
  - `nombre`
  - `categoría`
  - `total de unidades vendidas`
  - `monto total generado`
  - `puntuación promedio en valoraciones`

**Etapas del Pipeline:**
- Combinación de múltiples etapas vistas anteriormente

---
