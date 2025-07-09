const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const libroRoutes = require('./routes/libro.routes');
const prestamoRoutes = require('./routes/prestamo.routes');

// Inicializar la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rutas
app.use('/api/libros', libroRoutes);
app.use('/api/prestamos', prestamoRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API de la Biblioteca Digital',
    rutas: {
      libros: '/api/libros',
      prestamos: '/api/prestamos',
      documentacion: 'Consulte la documentación para más detalles'
    }
  });
});

// Manejo de errores 404
app.use((req, res, next) => {
  const error = new Error('Ruta no encontrada');
  error.status = 404;
  next(error);
});

// Manejador de errores global
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      mensaje: error.message || 'Error interno del servidor',
      detalles: process.env.NODE_ENV === 'development' ? error.stack : {}
    }
  });
});

module.exports = app;
