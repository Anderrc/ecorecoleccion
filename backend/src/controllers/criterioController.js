const db = require('../config/db');

// Obtener todos los criterios del directorio
exports.obtenerCriterios = (req, res) => {
  const { tipo_dato, estado, buscar } = req.query;
  
  let query = 'SELECT * FROM criterios_directorio WHERE 1=1';
  const params = [];

  if (tipo_dato) {
    query += ' AND tipo_dato = ?';
    params.push(tipo_dato);
  }

  if (estado) {
    query += ' AND estado = ?';
    params.push(estado);
  }

  if (buscar) {
    query += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
    params.push(`%${buscar}%`, `%${buscar}%`);
  }

  query += ' ORDER BY orden_visualizacion, nombre';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al obtener criterios:', err);
      return res.status(500).json({ error: 'Error al obtener criterios' });
    }

    // Parsear las opciones de selección desde JSON
    const criteriosConOpciones = results.map(criterio => ({
      ...criterio,
      opciones_seleccion: criterio.opciones_seleccion ? JSON.parse(criterio.opciones_seleccion) : null
    }));

    res.json(criteriosConOpciones);
  });
};

// Obtener un criterio por ID
exports.obtenerCriterioPorId = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM criterios_directorio WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener criterio:', err);
      return res.status(500).json({ error: 'Error al obtener criterio' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Criterio no encontrado' });
    }

    const criterio = results[0];
    // Parsear las opciones de selección desde JSON
    if (criterio.opciones_seleccion) {
      criterio.opciones_seleccion = JSON.parse(criterio.opciones_seleccion);
    }

    res.json(criterio);
  });
};

// Crear un nuevo criterio
exports.crearCriterio = (req, res) => {
  const { 
    nombre, 
    descripcion, 
    tipo_dato, 
    opciones_seleccion, 
    obligatorio, 
    orden_visualizacion, 
    estado 
  } = req.body;

  // Validaciones básicas
  if (!nombre || !tipo_dato) {
    return res.status(400).json({ error: 'Nombre y tipo de dato son obligatorios' });
  }

  // Validar tipo de dato
  const tiposPermitidos = ['texto', 'numero', 'decimal', 'fecha', 'booleano', 'seleccion'];
  if (!tiposPermitidos.includes(tipo_dato)) {
    return res.status(400).json({ error: 'Tipo de dato no válido' });
  }

  // Si es tipo selección, debe tener opciones
  if (tipo_dato === 'seleccion' && (!opciones_seleccion || opciones_seleccion.length === 0)) {
    return res.status(400).json({ error: 'Los criterios de tipo selección deben tener opciones' });
  }

  const query = `
    INSERT INTO criterios_directorio 
    (nombre, descripcion, tipo_dato, opciones_seleccion, obligatorio, orden_visualizacion, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const opcionesJson = tipo_dato === 'seleccion' && opciones_seleccion ? 
    JSON.stringify(opciones_seleccion) : null;

  const params = [
    nombre,
    descripcion || null,
    tipo_dato,
    opcionesJson,
    obligatorio || false,
    orden_visualizacion || 0,
    estado || 'activo'
  ];

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error al crear criterio:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Ya existe un criterio con ese nombre' });
      }
      return res.status(500).json({ error: 'Error al crear criterio' });
    }

    res.status(201).json({ 
      message: 'Criterio creado con éxito',
      id: result.insertId
    });
  });
};

// Actualizar un criterio
exports.actualizarCriterio = (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    descripcion, 
    tipo_dato, 
    opciones_seleccion, 
    obligatorio, 
    orden_visualizacion, 
    estado 
  } = req.body;

  // Verificar que el criterio existe
  db.query('SELECT id FROM criterios_directorio WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al verificar criterio:', err);
      return res.status(500).json({ error: 'Error al verificar criterio' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Criterio no encontrado' });
    }

    // Validar tipo de dato si se proporciona
    if (tipo_dato) {
      const tiposPermitidos = ['texto', 'numero', 'decimal', 'fecha', 'booleano', 'seleccion'];
      if (!tiposPermitidos.includes(tipo_dato)) {
        return res.status(400).json({ error: 'Tipo de dato no válido' });
      }

      // Si es tipo selección, debe tener opciones
      if (tipo_dato === 'seleccion' && (!opciones_seleccion || opciones_seleccion.length === 0)) {
        return res.status(400).json({ error: 'Los criterios de tipo selección deben tener opciones' });
      }
    }

    const opcionesJson = tipo_dato === 'seleccion' && opciones_seleccion ? 
      JSON.stringify(opciones_seleccion) : null;

    const query = `
      UPDATE criterios_directorio 
      SET nombre = ?, descripcion = ?, tipo_dato = ?, opciones_seleccion = ?, 
          obligatorio = ?, orden_visualizacion = ?, estado = ?
      WHERE id = ?
    `;

    const params = [
      nombre, 
      descripcion, 
      tipo_dato, 
      opcionesJson, 
      obligatorio, 
      orden_visualizacion, 
      estado, 
      id
    ];

    db.query(query, params, (err, result) => {
      if (err) {
        console.error('Error al actualizar criterio:', err);
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Ya existe un criterio con ese nombre' });
        }
        return res.status(500).json({ error: 'Error al actualizar criterio' });
      }

      res.json({ message: 'Criterio actualizado con éxito' });
    });
  });
};

// Eliminar un criterio
exports.eliminarCriterio = (req, res) => {
  const { id } = req.params;

  // Verificar que el criterio existe
  db.query('SELECT id FROM criterios_directorio WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al verificar criterio:', err);
      return res.status(500).json({ error: 'Error al verificar criterio' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Criterio no encontrado' });
    }

    // Verificar si hay tipos de residuos que usan este criterio
    db.query('SELECT COUNT(*) as count FROM residuos_criterios WHERE criterio_id = ?', [id], (err, countResult) => {
      if (err) {
        console.error('Error al verificar referencias:', err);
        return res.status(500).json({ error: 'Error al verificar referencias' });
      }

      if (countResult[0].count > 0) {
        return res.status(400).json({ 
          error: 'No se puede eliminar el criterio porque está siendo usado por tipos de residuos',
          tipos_usando: countResult[0].count
        });
      }

      // Eliminar el criterio
      db.query('DELETE FROM criterios_directorio WHERE id = ?', [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar criterio:', err);
          return res.status(500).json({ error: 'Error al eliminar criterio' });
        }

        res.json({ message: 'Criterio eliminado con éxito' });
      });
    });
  });
};

// Asociar criterio a un tipo de residuo
exports.asociarCriterioATipoResiduo = (req, res) => {
  const { tipo_residuo_id, criterio_id, valor_por_defecto, multiplicador_puntaje, obligatorio } = req.body;

  // Validaciones básicas
  if (!tipo_residuo_id || !criterio_id) {
    return res.status(400).json({ error: 'ID del tipo de residuo y criterio son obligatorios' });
  }

  // Verificar que el tipo de residuo existe
  db.query('SELECT id FROM residuos WHERE id = ?', [tipo_residuo_id], (err, tipoResults) => {
    if (err) {
      console.error('Error al verificar tipo de residuo:', err);
      return res.status(500).json({ error: 'Error al verificar tipo de residuo' });
    }

    if (tipoResults.length === 0) {
      return res.status(404).json({ error: 'Tipo de residuo no encontrado' });
    }

    // Verificar que el criterio existe
    db.query('SELECT id FROM criterios_directorio WHERE id = ?', [criterio_id], (err, criterioResults) => {
      if (err) {
        console.error('Error al verificar criterio:', err);
        return res.status(500).json({ error: 'Error al verificar criterio' });
      }

      if (criterioResults.length === 0) {
        return res.status(404).json({ error: 'Criterio no encontrado' });
      }

      const query = `
        INSERT INTO residuos_criterios 
        (tipo_residuo_id, criterio_id, valor_por_defecto, multiplicador_puntaje, obligatorio)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        valor_por_defecto = VALUES(valor_por_defecto),
        multiplicador_puntaje = VALUES(multiplicador_puntaje),
        obligatorio = VALUES(obligatorio),
        estado = 'activo'
      `;

      const params = [
        tipo_residuo_id,
        criterio_id,
        valor_por_defecto || null,
        multiplicador_puntaje || 1.00,
        obligatorio || false
      ];

      db.query(query, params, (err, result) => {
        if (err) {
          console.error('Error al asociar criterio:', err);
          return res.status(500).json({ error: 'Error al asociar criterio' });
        }

        res.status(201).json({ 
          message: 'Criterio asociado con éxito',
          id: result.insertId
        });
      });
    });
  });
};

// Desasociar criterio de un tipo de residuo
exports.desasociarCriterioDeTipoResiduo = (req, res) => {
  const { tipo_residuo_id, criterio_id } = req.params;

  const query = 'DELETE FROM residuos_criterios WHERE tipo_residuo_id = ? AND criterio_id = ?';

  db.query(query, [tipo_residuo_id, criterio_id], (err, result) => {
    if (err) {
      console.error('Error al desasociar criterio:', err);
      return res.status(500).json({ error: 'Error al desasociar criterio' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asociación no encontrada' });
    }

    res.json({ message: 'Criterio desasociado con éxito' });
  });
};

// Obtener criterios disponibles para un tipo de residuo (no asociados aún)
exports.obtenerCriteriosDisponibles = (req, res) => {
  const { tipo_residuo_id } = req.params;

  const query = `
    SELECT cd.* 
    FROM criterios_directorio cd
    WHERE cd.estado = 'activo'
    AND cd.id NOT IN (
      SELECT rc.criterio_id 
      FROM residuos_criterios rc 
      WHERE rc.tipo_residuo_id = ? AND rc.estado = 'activo'
    )
    ORDER BY cd.orden_visualizacion, cd.nombre
  `;

  db.query(query, [tipo_residuo_id], (err, results) => {
    if (err) {
      console.error('Error al obtener criterios disponibles:', err);
      return res.status(500).json({ error: 'Error al obtener criterios disponibles' });
    }

    // Parsear las opciones de selección desde JSON
    const criteriosConOpciones = results.map(criterio => ({
      ...criterio,
      opciones_seleccion: criterio.opciones_seleccion ? JSON.parse(criterio.opciones_seleccion) : null
    }));

    res.json(criteriosConOpciones);
  });
};
