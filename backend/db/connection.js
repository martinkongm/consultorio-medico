const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const db = new sqlite3.Database(config.dbPath, (err) => {
  if (err) {
    console.error(
      `Error al conectar con la base de datos (${config.dbPath}):`,
      err.message
    );
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Envoltorios basados en Promesas sobre la API por callbacks de sqlite3.
// Así los repositorios no repiten el patrón callback/error manualmente (DRY).
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { db, run, get, all };
