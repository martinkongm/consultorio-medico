const { run } = require('./connection');

// Definición única del esquema. Mantener aquí las columnas al día evita que
// una base de datos creada "en frío" quede desincronizada con las consultas.
const CREATE_TABLES = [
  `
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    dni TEXT NOT NULL,
    birthdate TEXT,
    gender TEXT,
    phone TEXT,
    domicilio TEXT
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    date TEXT,
    weight REAL,
    diagnosis TEXT,
    treatment TEXT,
    antecedentes TEXT,
    motivo_consulta TEXT,
    examen_clinico TEXT,
    examen_laboratorio TEXT,
    examen_orofaringe TEXT,
    examen_pulmones TEXT,
    examen_cardiovascular TEXT,
    examen_abdomen TEXT,
    examen_genitourinario TEXT,
    examen_neurologico TEXT,
    examen_otros TEXT,
    tiempo_enfermedad INTEGER,
    tiempo_enfermedad_unidad TEXT,
    tiempo_enfermedad_no_precisa INTEGER DEFAULT 0,
    temperatura REAL,
    frecuencia_respiratoria INTEGER,
    pulso INTEGER,
    spo2 INTEGER,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id INTEGER,
    filename TEXT,
    filepath TEXT,
    FOREIGN KEY (record_id) REFERENCES medical_records(id)
  )
  `,
];

async function initDatabase() {
  for (const sql of CREATE_TABLES) {
    await run(sql);
  }
}

module.exports = { initDatabase };
