const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const recordRoutes = require('./routes/record.routes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  // CORS habilitado por si se consume la API desde otro origen en dev.
  // En producción la app y la API comparten origen, así que no aplica.
  app.use(cors());
  app.use(express.json());

  // Archivos subidos accesibles de forma estática.
  app.use('/uploads', express.static(config.uploadsDir));

  // Rutas de la API
  app.use('/api', authRoutes);
  app.use('/api/patients', patientRoutes);
  app.use('/api/records', recordRoutes);

  // En producción, Express sirve el frontend compilado (SPA). Si no existe el
  // build (p. ej. durante desarrollo), se omite y todo pasa al notFound.
  const indexHtml = path.join(config.frontendDist, 'index.html');
  if (fs.existsSync(indexHtml)) {
    app.use(express.static(config.frontendDist));

    // Fallback SPA: cualquier GET que no sea API/uploads responde con
    // index.html para que el router del cliente maneje la ruta.
    app.use((req, res, next) => {
      if (req.method !== 'GET') return next();
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      return res.sendFile(indexHtml);
    });
  }

  // Manejo de rutas inexistentes y errores (siempre al final).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
