const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/crear', authMiddleware, solicitudController.crearSolicitud);

module.exports = router;