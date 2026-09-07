const express = require('express');
const cors = require('cors');
const config = require('./config');

const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const recordRoutes = require('./routes/record.routes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Archivos subidos accesibles de forma estática.
  app.use('/uploads', express.static(config.uploadsDir));

  // Rutas de la API
  app.use('/api', authRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/records', recordRoutes);

  // Manejo de rutas inexistentes y errores (siempre al final).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
