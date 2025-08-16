const db = require('../config/db');

exports.crearRol = (req, res) => {
  const { Rol_ID, Nombre } = req.body;

  db.query(
    'INSERT INTO Rol (Rol_ID, Nombre) VALUES (?, ?)',
    [Rol_ID, Nombre],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear el rol' });
      res.json({ message: 'Rol creado con éxito', id: result.insertId });
    }
  );
};
