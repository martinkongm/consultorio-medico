const { run } = require('./connection');

// Migraciones idempotentes para bases existentes creadas por versiones
// anteriores del sistema. Se ejecutan en cada arranque y son seguras de
// repetir (los "ALTER ... ADD COLUMN" ya aplicados se ignoran).
const ALTER_TABLES = [
  'ALTER TABLE patients ADD COLUMN domicilio TEXT',
  'ALTER TABLE medical_records ADD COLUMN temperatura REAL',
  'ALTER TABLE medical_records ADD COLUMN frecuencia_respiratoria INTEGER',
  'ALTER TABLE medical_records ADD COLUMN pulso INTEGER',
  'ALTER TABLE medical_records ADD COLUMN spo2 INTEGER',
  'ALTER TABLE medical_records ADD COLUMN weight REAL',
  'ALTER TABLE medical_records ADD COLUMN tiempo_enfermedad INTEGER',
  'ALTER TABLE medical_records ADD COLUMN tiempo_enfermedad_unidad TEXT',
  'ALTER TABLE medical_records ADD COLUMN tiempo_enfermedad_no_precisa INTEGER DEFAULT 0',
  'ALTER TABLE medical_records ADD COLUMN examen_orofaringe TEXT',
  'ALTER TABLE medical_records ADD COLUMN examen_pulmones TEXT',
  'ALTER TABLE medical_records ADD COLUMN examen_cardiovascular TEXT',
  'ALTER TABLE medical_records ADD COLUMN examen_abdomen TEXT',
  'ALTER TABLE medical_records ADD COLUMN examen_genitourinario TEXT',
  'ALTER TABLE medical_records ADD COLUMN examen_neurologico TEXT',
  'ALTER TABLE medical_records ADD COLUMN examen_otros TEXT',
];

async function runMigrations() {
  for (const sql of ALTER_TABLES) {
    try {
      await run(sql);
    } catch (err) {
      // "duplicate column name" => la columna ya existe, todo correcto.
      if (!/duplicate column name/i.test(err.message)) {
        throw err;
      }
    }
  }
}

module.exports = { runMigrations };
