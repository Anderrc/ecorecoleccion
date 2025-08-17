const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/estadisticas', dashboardController.obtenerEstadisticasDashboard);
router.get('/estadisticas-personales', authMiddleware, dashboardController.obtenerEstadisticasPersonales);

module.exports = router;
