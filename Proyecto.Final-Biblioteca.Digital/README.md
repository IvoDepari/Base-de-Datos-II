# Proyecto Final - Base de Datos2

## Proyecto elegido
**Biblioteca Digital**

## Tecnología utilizada
Python con Flask y PyMongo

## Interfaz de usuario
Aplicación web (WebApp) con vistas HTML y API REST

**Participantes:**
- Giuseppe Giovanelli
- Lucas Soresi
- Ivo Depari
- Franco Commisso

---

### Consigna del proyecto
Sistema de gestión de biblioteca digital que permite administrar libros, autores y préstamos, consultar disponibilidad, y generar reportes de los libros más prestados.

---

## Tecnologías utilizadas
- **Python** (Flask)
- **MongoDB** (Base de datos NoSQL)
- **Docker** y **Docker Compose** (para despliegue y ambiente reproducible)
- **PyMongo** (driver MongoDB)
- **python-dotenv** (variables de entorno)
- **HTML5, CSS3, JavaScript** (Frontend)
- **Git** (control de versiones)
- *(Opcional: Postman para pruebas de API)*

---

## Arquitectura y despliegue

El proyecto está dockerizado y se inicia fácilmente con Docker Compose. Al ejecutar el comando, se levantan dos contenedores:
- **mongo**: Base de datos MongoDB
- **web**: Aplicación Flask

La app Flask se conecta a MongoDB usando PyMongo. Los modelos encapsulan la lógica de acceso a datos, y las rutas exponen la API REST y vistas HTML. Al iniciar los contenedores, puedes inicializar datos de ejemplo ejecutando un script de seed.

---

## Cómo levantar el proyecto

### Opción recomendada: Docker Compose

1. **Clona el repositorio y entra a la carpeta:**
   ```bash
   git clone <https://github.com/IvoDepari/Base-de-Datos-II/tree/main>
   cd Proyecto.Final-Biblioteca.Digital
   ```
2. **Copia el archivo `.env` de ejemplo y ajusta si es necesario:**
   ```env
   MONGODB_URI=mongodb://mongo:27017/
   FLASK_ENV=development
   ```
3. **Levanta los servicios:**
   ```bash
   docker compose up --build
   ```
4. **Inicializa la base de datos con datos de ejemplo (opcional):**
   ```bash
   docker compose exec web python database/seed.py
   ```
5. **Accede a la webapp:**
   [http://localhost:5000](http://localhost:5000)

### Opción manual (sin Docker)

1. Instala dependencias:
   ```bash
   pip install -r requirements.txt
   ```
2. Asegúrate de tener MongoDB corriendo en `localhost:27017`.
3. Inicializa la base de datos:
   ```bash
   python database/seed.py
   ```
4. Ejecuta la app Flask:
   ```bash
   python app.py
   ```
5. Accede a la webapp en [http://localhost:5000](http://localhost:5000)

---

## Estructura del proyecto

```
BibliotecaDigital/
│   app.py                  # App principal Flask
│   docker-compose.yml      # Orquestación de servicios
│   Dockerfile              # Imagen para la webapp
│   requirements.txt        # Dependencias Python
│   .env                    # Variables de entorno
├───database/
│   │   conn_database.py    # Conexión MongoDB
│   │   seed.py             # Script de carga de datos
├───models/
│   │   libro.py            # Modelo Libro
│   │   prestamo.py         # Modelo Préstamo
├───routes/
│   │   libros.py           # Rutas de libros
│   │   prestamos.py        # Rutas de préstamos
├───static/
│   │   styles.css          # Estilos CSS
├───templates/
│   │   base.html           # Template base
│   │   home.html           # Página de inicio
│   │   libros.html         # Vista libros
│   │   prestamos.html      # Vista préstamos
│   │   populares.html      # Vista populares
```

---

## Notas adicionales
- Puedes modificar el archivo `.env` para cambiar la configuración según el entorno.
- La base de datos MongoDB persiste los datos en un volumen Docker.
- Para limpiar y reiniciar la base de datos, puedes eliminar el volumen `mongo_data` y volver a ejecutar el seed.

---

¡Listo para usar y probar en tu navegador!
5. Accede a la aplicación web en tu navegador:
   [http://localhost:5000](http://localhost:5000)

### Visualización de datos y solución de problemas

- Si no ves libros o préstamos cargados:
  - Verifica que ejecutaste correctamente `python database/seed.py`.
  - Asegúrate de que MongoDB está activo antes de iniciar la app.
- Si ves errores de conexión a MongoDB:
  - Comprueba que el servicio está corriendo en el puerto correcto (`localhost:27017`).
  - Si usas Docker Desktop, asegúrate de que el contenedor `mongo` está en ejecución.
- Para recargar los datos de ejemplo, puedes volver a ejecutar el script de seed.
- Si modificas el código, reinicia el servidor Flask para ver los cambios.
