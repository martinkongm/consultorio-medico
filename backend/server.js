const config = require('./config');
const { initDatabase } = require('./db/schema');
const { runMigrations } = require('./db/migrations');
const { createApp } = require('./app');

async function start() {
  try {
    // 1. Asegurar esquema y migraciones antes de atender peticiones.
    await initDatabase();
    await runMigrations();
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
  }

  // 2. Levantar el servidor una vez que la BD está lista.
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
  });
}

start();
