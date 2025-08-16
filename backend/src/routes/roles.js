const express = require('express');
const { crearRol } = require('../controllers/rolController');
const router = express.Router();

router.post('/crearRol', crearRol);

module.exports = router;
