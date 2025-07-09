const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libro.controller');

// Rutas para libros
router.post('/', libroController.agregarLibro);
router.get('/', libroController.obtenerTodosLosLibros);
router.get('/buscar', libroController.buscarLibros);
router.get('/disponibilidad/:isbn', libroController.verificarDisponibilidad);
router.get('/populares', libroController.obtenerLibrosPopulares);
router.get('/:id', libroController.obtenerLibroPorId);
router.put('/:id', libroController.actualizarLibro);
router.delete('/:id', libroController.eliminarLibro);

module.exports = router;
