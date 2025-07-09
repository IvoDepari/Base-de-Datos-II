# Sistema de Biblioteca Digital

Este es un sistema de gestión de biblioteca digital desarrollado con Node.js, Express y MongoDB. Permite gestionar libros, autores y préstamos de manera eficiente.

## Características

- Gestión de libros (CRUD completo)
- Búsqueda de libros por título, autor o género
- Sistema de préstamos y devoluciones
- Reportes de libros más prestados
- Verificación de disponibilidad de libros
- Generación de reportes de préstamos por período
- API RESTful documentada

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd biblioteca-digital
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Ajusta las configuraciones según sea necesario

4. Inicia MongoDB:
   ```bash
   # En sistemas basados en Unix/Mac
   mongod --dbpath /ruta/a/tu/directorio/de/datos
   
   # O en Windows (si MongoDB está instalado como servicio)
   net start MongoDB
   ```

5. Inicia el servidor:
   ```bash
   # Modo desarrollo (con reinicio automático)
   npm run dev
   
   # O en modo producción
   npm start
   ```

   El servidor estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
biblioteca-digital/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.js           # Configuración de la base de datos
│   ├── controllers/        # Controladores de la aplicación
│   │   ├── libro.controller.js
│   │   └── prestamo.controller.js
│   ├── models/            # Modelos de datos
│   │   ├── libro.model.js
│   │   └── prestamo.model.js
│   ├── routes/            # Rutas de la API
│   │   ├── libro.routes.js
│   │   └── prestamo.routes.js
│   ├── app.js             # Configuración de Express
│   └── server.js          # Punto de entrada de la aplicación
├── .env                   # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## Documentación de la API

### Libros

- `GET /api/libros` - Obtener todos los libros (con paginación)
  - Parámetros opcionales: `page`, `limit`
  - Ejemplo: `GET /api/libros?page=1&limit=10`

- `GET /api/libros/buscar?query=texto` - Buscar libros por título, autor o género
  - Ejemplo: `GET /api/libros/buscar?query=garcia`

- `GET /api/libros/disponibilidad/:isbn` - Verificar disponibilidad de un libro
  - Ejemplo: `GET /api/libros/disponibilidad/978-0307389732`

- `GET /api/libros/populares` - Obtener los libros más prestados
  - Parámetro opcional: `limit` (por defecto: 5)
  - Ejemplo: `GET /api/libros/populares?limit=10`

- `GET /api/libros/:id` - Obtener un libro por ID
  - Ejemplo: `GET /api/libros/60d21b4667d0d8992e610c85`

- `POST /api/libros` - Agregar un nuevo libro
  - Cuerpo de la solicitud:
    ```json
    {
      "titulo": "Cien años de soledad",
      "autor": "Gabriel García Márquez",
      "isbn": "978-0307389732",
      "genero": "Realismo mágico",
      "anioPublicacion": 1967,
      "copias": 3
    }
    ```

- `PUT /api/libros/:id` - Actualizar un libro existente
  - Ejemplo: `PUT /api/libros/60d21b4667d0d8992e610c85`
  - Cuerpo de la solicitud: Mismos campos que en POST

- `DELETE /api/libros/:id` - Eliminar un libro
  - Ejemplo: `DELETE /api/libros/60d21b4667d0d8992e610c85`

### Préstamos

- `POST /api/prestamos/prestar` - Registrar un nuevo préstamo
  - Cuerpo de la solicitud:
    ```json
    {
      "isbn": "978-0307389732",
      "usuario": "Juan Pérez"
    }
    ```

- `PUT /api/prestamos/devolver/:prestamoId` - Registrar la devolución de un libro
  - Ejemplo: `PUT /api/prestamos/devolver/60d21b4667d0d8992e610c85`

- `GET /api/prestamos` - Obtener todos los préstamos (con filtros)
  - Parámetros opcionales:
    - `devuelto`: boolean
    - `usuario`: string
    - `libroId`: string
    - `fechaInicio`, `fechaFin`: fechas en formato YYYY-MM-DD
    - `page`, `limit`: para paginación
  - Ejemplo: `GET /api/prestamos?devuelto=false&usuario=Juan`

- `GET /api/prestamos/reporte` - Generar reporte de préstamos por período
  - Parámetros obligatorios: `fechaInicio`, `fechaFin`
  - Ejemplo: `GET /api/prestamos/reporte?fechaInicio=2023-01-01&fechaFin=2023-12-31`

- `GET /api/prestamos/:id` - Obtener un préstamo por ID
  - Ejemplo: `GET /api/prestamos/60d21b4667d0d8992e610c85`

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017/biblioteca-digital
```

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm test` - Ejecuta las pruebas (pendiente de implementar)

## Próximas Mejoras

- [ ] Implementar autenticación de usuarios
- [ ] Añadir roles y permisos
- [ ] Implementar pruebas unitarias y de integración
- [ ] Añadir documentación con Swagger/OpenAPI
- [ ] Implementar búsqueda avanzada con filtros combinados
- [ ] Añadir soporte para subida de imágenes de portada

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
