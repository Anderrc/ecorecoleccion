require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const solicitudRoutes = require('./routes/solicitudes');
const rolesRoutes = require('./routes/roles');
const criteriosRoutes = require('./routes/criterios');
const residuosRoutes = require('./routes/residuos');
const dashboardRoutes = require('./routes/dashboard');
const reportesRoutes = require('./routes/reportes');
const rutasRoutes = require('./routes/rutas');
const usuariosRoutes = require('./routes/usuarios');
const recoleccionesRoutes = require('./routes/recolecciones');

const app = express();

// Configurar CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // URLs del frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para headers adicionales
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/criterios', criteriosRoutes);
app.use('/api/residuos', residuosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/recolecciones', recoleccionesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT} 🚀`);
});
