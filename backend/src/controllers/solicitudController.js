const db = require('../config/db');

exports.crearSolicitud = (req, res) => {
  const { usuario_id, descripcion } = req.body;

  db.query(
    'INSERT INTO solicitudes (usuario_id, descripcion, fecha) VALUES (?, ?, NOW())',
    [usuario_id, descripcion],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear la solicitud' });
      res.json({ message: 'Solicitud creada con éxito', id: result.insertId });
    }
  );
};
