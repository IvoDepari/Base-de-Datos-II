const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamo.controller');

// Rutas para préstamos
router.post('/prestar', prestamoController.prestarLibro);
router.put('/devolver/:prestamoId', prestamoController.devolverLibro);
router.get('/', prestamoController.obtenerPrestamos);
router.get('/reporte', prestamoController.generarReportePrestamos);
router.get('/:id', prestamoController.obtenerPrestamoPorId);

module.exports = router;
