const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const usuarioCtrl = require('../controllers/usuarioController');

// Simple middleware para restringir a administradores (Rol_ID = 1)
function requireAdmin(req,res,next){
  if (!req.user || req.user.rol !== 1){
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
}

router.use(auth); // todas requieren auth

router.get('/', requireAdmin, usuarioCtrl.listarUsuarios);
router.get('/basico/:id', usuarioCtrl.obtenerUsuarioBasico); // accesible a roles autenticados (recolector necesita validar)
router.get('/:id', requireAdmin, usuarioCtrl.obtenerUsuario);
router.post('/', requireAdmin, usuarioCtrl.crearUsuario);
router.put('/:id', requireAdmin, usuarioCtrl.actualizarUsuario);
router.delete('/:id', requireAdmin, usuarioCtrl.eliminarUsuario);
router.patch('/:id/rol', requireAdmin, usuarioCtrl.cambiarRol);

module.exports = router;
