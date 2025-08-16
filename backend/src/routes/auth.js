const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// Registrar usuario
router.post('/register', validateRegister, register);

// Login usuario
router.post('/login', validateLogin, login);

module.exports = router;
