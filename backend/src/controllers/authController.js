const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  const { user_name, correo, password, nombre, apellidos, rol_id } = req.body;

  try {
    // Validar datos requeridos
    if (!user_name || !correo || !password || !nombre || !apellidos) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios' 
      });
    }

    // Verificar si el correo ya existe
    db.query('SELECT ID_User FROM Usuarios WHERE correo = ?', [correo], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error al verificar correo:', checkErr);
        return res.status(500).json({ 
          error: 'Error interno del servidor' 
        });
      }

      if (checkResult.length > 0) {
        return res.status(400).json({ 
          error: 'El correo electrónico ya está registrado. Por favor, usa otro correo.' 
        });
      }

      // Verificar si el nombre de usuario ya existe
      db.query('SELECT ID_User FROM Usuarios WHERE User_name = ?', [user_name], async (userCheckErr, userCheckResult) => {
        if (userCheckErr) {
          console.error('Error al verificar usuario:', userCheckErr);
          return res.status(500).json({ 
            error: 'Error interno del servidor' 
          });
        }

        if (userCheckResult.length > 0) {
          return res.status(400).json({ 
            error: 'El nombre de usuario ya está en uso. Por favor, elige otro nombre de usuario.' 
          });
        }

        // Si no hay duplicados, proceder con el registro
        try {
          // Hashear contraseña
          const hashedPassword = await bcrypt.hash(password, 10);

          db.query(
            `INSERT INTO Usuarios (User_name, correo, password, Nombre, Apellidos, Rol_ID) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_name, correo, hashedPassword, nombre, apellidos, rol_id || 3],
            (err, result) => {
              if (err) {
                console.error('Error al insertar usuario:', err);
                
                // Manejar errores de entrada duplicada como respaldo
                if (err.code === 'ER_DUP_ENTRY') {
                  if (err.message.includes('correo')) {
                    return res.status(400).json({ 
                      error: 'El correo electrónico ya está registrado. Por favor, usa otro correo.' 
                    });
                  } else if (err.message.includes('User_name')) {
                    return res.status(400).json({ 
                      error: 'El nombre de usuario ya está en uso. Por favor, elige otro nombre de usuario.' 
                    });
                  }
                }
                
                return res.status(500).json({ 
                  error: 'Error al registrar usuario. Por favor, inténtalo de nuevo.' 
                });
              }
              
              res.status(201).json({ 
                message: 'Usuario registrado con éxito', 
                id: result.insertId,
                user: {
                  id: result.insertId,
                  user_name,
                  correo,
                  nombre,
                  apellidos
                }
              });
            }
          );
        } catch (hashError) {
          console.error('Error al hashear contraseña:', hashError);
          return res.status(500).json({ 
            error: 'Error interno del servidor' 
          });
        }
      });
    });
  } catch (error) {
    console.error('Error general en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
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
    const validPassword = await bcrypt.compare(password, user.password);

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
