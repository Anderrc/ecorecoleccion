const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  const { user_name, correo, password, nombre, apellidos, rol_id } = req.body;

  try {
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      `INSERT INTO Usuarios (User_name, correo, Contraseña, Nombre, Apellidos, Rol_ID) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_name, correo, hashedPassword, nombre, apellidos, rol_id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al registrar usuario' });
        }
        res.json({ message: 'Usuario registrado con éxito', id: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

// Inicio de sesión
exports.login = (req, res) => {
  const { correo, password } = req.body;

  db.query('SELECT * FROM Usuarios WHERE correo = ?', [correo], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (results.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

    const user = results[0];

    // Comparar contraseña ingresada con la almacenada (hash)
    const validPassword = await bcrypt.compare(password, user.Contraseña);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.ID_User, correo: user.correo, rol: user.Rol_ID },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.ID_User,
        nombre: user.Nombre,
        apellidos: user.Apellidos,
        correo: user.correo,
        rol: user.Rol_ID
      }
    });
  });
};
