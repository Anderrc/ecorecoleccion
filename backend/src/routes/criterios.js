const express = require('express');
const router = express.Router();
const criterioController = require('../controllers/criterioController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas públicas (solo lectura)
router.get('/', criterioController.obtenerCriterios);
router.get('/:id', criterioController.obtenerCriterioPorId);
router.get('/disponibles/:tipo_residuo_id', criterioController.obtenerCriteriosDisponibles);

// Rutas protegidas (requieren autenticación)
router.post('/', authMiddleware, criterioController.crearCriterio);
router.put('/:id', authMiddleware, criterioController.actualizarCriterio);
router.delete('/:id', authMiddleware, criterioController.eliminarCriterio);

// Rutas para asociaciones criterio-tipo de residuo
router.post('/asociar', authMiddleware, criterioController.asociarCriterioATipoResiduo);
router.delete('/desasociar/:tipo_residuo_id/:criterio_id', authMiddleware, criterioController.desasociarCriterioDeTipoResiduo);

module.exports = router;
