const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/recoleccionController');

router.use(auth);

router.post('/', ctrl.crearRecoleccion);
router.get('/', ctrl.listarRecolecciones);
router.get('/:id', ctrl.obtenerRecoleccion);
router.patch('/:id/estado', ctrl.actualizarEstado);
router.post('/:id/asignar-ruta', ctrl.asignarRuta);

module.exports = router;
