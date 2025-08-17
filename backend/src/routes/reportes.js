const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/mios', authMiddleware, reporteController.obtenerReportesUsuario);
router.get('/mios/estadisticas', authMiddleware, reporteController.obtenerEstadisticasUsuario);

module.exports = router;
