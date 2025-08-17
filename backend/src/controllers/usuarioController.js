const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper to map DB row to API user
function mapUser(row){
  return {
    id: row.ID_User,
    user_name: row.User_name,
    correo: row.correo,
    nombre: row.Nombre,
    apellidos: row.Apellidos,
    rol_id: row.Rol_ID,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// GET /api/usuarios?buscar= & rol_id= & page= & pageSize=
exports.listarUsuarios = (req,res)=>{
  const { buscar = '', rol_id, page = 1, pageSize = 20 } = req.query;
  const offset = (parseInt(page)-1) * parseInt(pageSize);
  const filters = [];
  const params = [];
  if (buscar){
    filters.push('(User_name LIKE ? OR Nombre LIKE ? OR Apellidos LIKE ? OR correo LIKE ?)');
    const like = `%${buscar}%`;
    params.push(like, like, like, like);
  }
  if (rol_id){
    filters.push('Rol_ID = ?');
    params.push(rol_id);
  }
  const where = filters.length? 'WHERE ' + filters.join(' AND ') : '';
  const sql = `SELECT SQL_CALC_FOUND_ROWS * FROM Usuarios ${where} ORDER BY ID_User DESC LIMIT ? OFFSET ?`;
  db.query(sql, [...params, parseInt(pageSize), offset], (err, rows)=>{
    if (err) return res.status(500).json({ error: 'Error al listar usuarios' });
    db.query('SELECT FOUND_ROWS() total', (err2, totalRows)=>{
      if (err2) return res.status(500).json({ error: 'Error al obtener total' });
      res.json({
        data: rows.map(mapUser),
        pagination: { page: parseInt(page), pageSize: parseInt(pageSize), total: totalRows[0].total }
      });
    });
  });
};

// GET /api/usuarios/:id
exports.obtenerUsuario = (req,res)=>{
  db.query('SELECT * FROM Usuarios WHERE ID_User = ?', [req.params.id], (err, rows)=>{
    if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(mapUser(rows[0]));
  });
};

// POST /api/usuarios  (admin crea usuario)
exports.crearUsuario = async (req,res)=>{
  const { user_name, correo, password, nombre, apellidos, rol_id = 3 } = req.body;
  if (!user_name || !correo || !password || !nombre || !apellidos){
    return res.status(400).json({ error: 'Campos obligatorios faltantes' });
  }
  try{
    const hash = await bcrypt.hash(password, 10);
    db.query(`INSERT INTO Usuarios (User_name, correo, password, Nombre, Apellidos, Rol_ID) VALUES (?,?,?,?,?,?)`,
      [user_name, correo, hash, nombre, apellidos, rol_id], (err, result)=>{
        if (err){
          if (err.code === 'ER_DUP_ENTRY'){
            return res.status(400).json({ error: 'Correo o usuario ya existe' });
          }
          return res.status(500).json({ error: 'Error al crear usuario' });
        }
        db.query('SELECT * FROM Usuarios WHERE ID_User = ?', [result.insertId], (e2, rows)=>{
          if (e2) return res.status(500).json({ error: 'Error post creación' });
          res.status(201).json(mapUser(rows[0]));
        });
      });
  }catch(e){
    res.status(500).json({ error: 'Error interno' });
  }
};

// PUT /api/usuarios/:id  (actualizar datos; password opcional)
exports.actualizarUsuario = async (req,res)=>{
  const { user_name, correo, password, nombre, apellidos, rol_id } = req.body;
  db.query('SELECT * FROM Usuarios WHERE ID_User = ?', [req.params.id], async (err, rows)=>{
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    const usuario = rows[0];
    const newUserName = user_name ?? usuario.User_name;
    const newCorreo = correo ?? usuario.correo;
    const newNombre = nombre ?? usuario.Nombre;
    const newApellidos = apellidos ?? usuario.Apellidos;
    const newRol = rol_id ?? usuario.Rol_ID;
    let passwordClause = '';
    const params = [newUserName, newCorreo, newNombre, newApellidos, newRol];
    if (password){
      const hash = await bcrypt.hash(password, 10);
      passwordClause = ', password = ?';
      params.push(hash);
    }
    params.push(req.params.id);
    db.query(`UPDATE Usuarios SET User_name = ?, correo = ?, Nombre = ?, Apellidos = ?, Rol_ID = ? ${passwordClause} WHERE ID_User = ?`, params, (uErr)=>{
      if (uErr){
        if (uErr.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Correo o usuario duplicado' });
        return res.status(500).json({ error: 'Error al actualizar' });
      }
      db.query('SELECT * FROM Usuarios WHERE ID_User = ?', [req.params.id], (fErr, newRows)=>{
        if (fErr) return res.status(500).json({ error: 'Error al refrescar' });
        res.json(mapUser(newRows[0]));
      });
    });
  });
};

// DELETE /api/usuarios/:id
exports.eliminarUsuario = (req,res)=>{
  db.query('DELETE FROM Usuarios WHERE ID_User = ?', [req.params.id], (err, result)=>{
    if (err) return res.status(500).json({ error: 'Error al eliminar' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  });
};

// PATCH /api/usuarios/:id/rol
exports.cambiarRol = (req,res)=>{
  const { rol_id } = req.body;
  if (!rol_id) return res.status(400).json({ error: 'rol_id requerido' });
  db.query('UPDATE Usuarios SET Rol_ID = ? WHERE ID_User = ?', [rol_id, req.params.id], (err, result)=>{
    if (err) return res.status(500).json({ error: 'Error al cambiar rol' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Rol actualizado' });
  });
};

// GET /api/usuarios/basico/:id  (datos mínimos para validación rápida)
exports.obtenerUsuarioBasico = (req,res) => {
  const { id } = req.params;
  db.query('SELECT ID_User, User_name, Nombre, Apellidos, Rol_ID FROM Usuarios WHERE ID_User = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error consultando usuario' });
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  });
};
