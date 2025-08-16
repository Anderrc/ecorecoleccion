const express = require('express');
const { crearSolicitud } = require('../controllers/solicitudController');
const router = express.Router();

router.post('/', crearSolicitud);

module.exports = router;
