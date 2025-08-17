const express = require('express');
const router = express.Router();
const rutaController = require('../controllers/rutaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, rutaController.listarRutas);
router.get('/:id', authMiddleware, rutaController.obtenerRuta);
router.post('/', authMiddleware, rutaController.crearRuta);
router.patch('/:id/estado', authMiddleware, rutaController.actualizarEstadoRuta);
router.patch('/puntos/:puntoId/estado', authMiddleware, rutaController.actualizarEstadoPunto);

module.exports = router;
