const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Registrar usuario
router.post('/register', register);

// Login usuario
router.post('/login', login);

module.exports = router;
