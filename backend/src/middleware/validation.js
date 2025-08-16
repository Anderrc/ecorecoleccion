// Middleware para validar datos de entrada

// Validar formato de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña segura
const isValidPassword = (password) => {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  return passwordRegex.test(password);
};

// Validar nombre de usuario
const isValidUsername = (username) => {
  // Entre 3 y 20 caracteres, solo letras, números y guiones bajos
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Middleware de validación para registro
exports.validateRegister = (req, res, next) => {
  const { user_name, correo, password, nombre, apellidos } = req.body;
  
  // Verificar campos requeridos
  if (!user_name || !correo || !password || !nombre || !apellidos) {
    return res.status(400).json({
      error: 'Todos los campos son obligatorios'
    });
  }

  // Validar formato de email
  if (!isValidEmail(correo)) {
    return res.status(400).json({
      error: 'El formato del correo electrónico no es válido'
    });
  }

  // Validar nombre de usuario
  if (!isValidUsername(user_name)) {
    return res.status(400).json({
      error: 'El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos'
    });
  }

  // Validar contraseña
  if (!isValidPassword(password)) {
    return res.status(400).json({
      error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
    });
  }

  // Validar longitud de nombres
  if (nombre.trim().length < 2 || nombre.trim().length > 50) {
    return res.status(400).json({
      error: 'El nombre debe tener entre 2 y 50 caracteres'
    });
  }

  if (apellidos.trim().length < 2 || apellidos.trim().length > 50) {
    return res.status(400).json({
      error: 'Los apellidos deben tener entre 2 y 50 caracteres'
    });
  }

  // Si todas las validaciones pasan, continuar
  next();
};

// Middleware de validación para login
exports.validateLogin = (req, res, next) => {
  const { correo, password } = req.body;
  
  if (!correo || !password) {
    return res.status(400).json({
      error: 'Correo y contraseña son obligatorios'
    });
  }

  if (!isValidEmail(correo)) {
    return res.status(400).json({
      error: 'El formato del correo electrónico no es válido'
    });
  }

  next();
};
