const express = require('express');
const router = express.Router();
const residuoController = require('../controllers/residuoController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas (solo lectura)
router.get('/', residuoController.obtenerResiduos);
router.get('/categorias', residuoController.obtenerCategorias);
router.get('/estadisticas', residuoController.obtenerEstadisticasResiduos);
router.get('/:id', residuoController.obtenerResiduoPorId);
router.get('/:id/criterios', residuoController.obtenerResiduoConCriterios);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, residuoController.crearResiduo);
router.put('/:id', authMiddleware, residuoController.actualizarResiduo);
router.delete('/:id', authMiddleware, residuoController.eliminarResiduo);

module.exports = router;
