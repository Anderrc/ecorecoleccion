require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const solicitudRoutes = require('./routes/solicitudes');
const rolesRoutes = require('./routes/roles');

const app = express();

app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/roles', rolesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} 🚀`);
});
