const { all, get, run } = require('../db/connection');

const EDITABLE_FIELDS = [
  'patient_id',
  'date',
  'weight',
  'diagnosis',
  'treatment',
  'antecedentes',
  'motivo_consulta',
  'examen_laboratorio',
  'examen_orofaringe',
  'examen_pulmones',
  'examen_cardiovascular',
  'examen_abdomen',
  'examen_genitourinario',
  'examen_neurologico',
  'examen_otros',
  'tiempo_enfermedad',
  'tiempo_enfermedad_unidad',
  'tiempo_enfermedad_no_precisa',
  'temperatura',
  'frecuencia_respiratoria',
  'pulso',
  'spo2',
];

// examen_clinico queda fuera de EDITABLE_FIELDS: es solo lectura (legacy de
// historias anteriores a la división por regiones). Aún así se devuelve en
// los listados para poder mostrarlo en historias antiguas.
const LEGACY_READONLY_FIELDS = ['medical_records.examen_clinico AS examen_clinico'];

// Conjunción de columnas entre history y su paciente para el listado.
function listWithPatients() {
  return all(`
    SELECT
      medical_records.id,
      medical_records.patient_id,
      patients.name AS patient_name,
      ${EDITABLE_FIELDS.map((f) => `medical_records.${f}`).join(', ')},
      ${LEGACY_READONLY_FIELDS.join(', ')}
    FROM medical_records
    JOIN patients ON medical_records.patient_id = patients.id
    ORDER BY medical_records.date DESC
  `);
}

async function listByPatient(patientId) {
  return all(
    `SELECT * FROM medical_records WHERE patient_id = ? ORDER BY date DESC`,
    [patientId]
  );
}

async function findById(id) {
  return get('SELECT * FROM medical_records WHERE id = ?', [id]);
}

async function create(record) {
  const placeholders = EDITABLE_FIELDS.map(() => '?').join(', ');
  const values = EDITABLE_FIELDS.map((field) => record[field]);

  const { lastID } = await run(
    `INSERT INTO medical_records (${EDITABLE_FIELDS.join(', ')}) VALUES (${placeholders})`,
    values
  );

  return findById(lastID);
}

async function update(id, record) {
  const assignments = EDITABLE_FIELDS.map((field) => `${field} = ?`).join(', ');
  const values = [...EDITABLE_FIELDS.map((field) => record[field]), id];

  const result = await run(
    `UPDATE medical_records SET ${assignments} WHERE id = ?`,
    values
  );

  if (result.changes === 0) return null;
  return findById(id);
}

async function remove(id) {
  return run('DELETE FROM medical_records WHERE id = ?', [id]);
}

module.exports = {
  EDITABLE_FIELDS,
  listWithPatients,
  listByPatient,
  findById,
  create,
  update,
  remove,
};
