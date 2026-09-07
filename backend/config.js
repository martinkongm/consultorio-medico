const path = require('path');

// Configuración centralizada. Cada valor puede sobrescribirse por variables
// de entorno (útil para producción o despliegues sin tocar el código).
module.exports = {
  port: Number(process.env.PORT) || 3001,
  dbPath: process.env.DB_PATH || path.resolve(__dirname, 'clinic.sqlite'),
  uploadsDir:
    process.env.UPLOADS_DIR || path.resolve(__dirname, 'uploads'),
  // Build del frontend que Express sirve en producción (si existe).
  frontendDist:
    process.env.FRONTEND_DIST ||
    path.resolve(__dirname, '../frontend/dist'),
  auth: {
    username: process.env.ADMIN_USER || 'doctor',
    password: process.env.ADMIN_PASSWORD || '123',
  },
};
