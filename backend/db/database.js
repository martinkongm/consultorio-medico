const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Base de datos en archivo local
const dbPath = path.resolve(__dirname, '../clinic.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tablas si no existen
db.serialize(() => {
  // Tabla de pacientes
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      dni TEXT UNIQUE NOT NULL,
      birthdate TEXT,
      gender TEXT,
      phone TEXT
    )
  `);

  // Tabla de historias clínicas
  db.run(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      date TEXT,
      diagnosis TEXT,
      treatment TEXT,
      antecedentes TEXT,
      motivo_consulta TEXT,
      examen_clinico TEXT, -- nuevo campo reemplazando historia_enfermedad_actual
      examen_laboratorio TEXT,
      FOREIGN KEY(patient_id) REFERENCES patients(id)
    )
  `);

  // Tabla de archivos subidos
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_id INTEGER,
      filename TEXT,
      filepath TEXT,
      FOREIGN KEY(record_id) REFERENCES medical_records(id)
    )
  `);
});

module.exports = db;