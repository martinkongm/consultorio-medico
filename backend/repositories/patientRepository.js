const { all, get, run } = require('../db/connection');

// Única lista de columnas editables del paciente (DRY): usada tanto para
// consultas como para proteger los INSERT/UPDATE de campos no esperados.
const EDITABLE_FIELDS = [
  'name',
  'dni',
  'birthdate',
  'gender',
  'phone',
  'domicilio',
];

const COLUMNS = ['id', ...EDITABLE_FIELDS].join(', ');

async function list() {
  return all(`SELECT ${COLUMNS} FROM patients ORDER BY id DESC`);
}

async function findById(id) {
  return get(`SELECT ${COLUMNS} FROM patients WHERE id = ?`, [id]);
}

async function create(patient) {
  const placeholders = EDITABLE_FIELDS.map(() => '?').join(', ');
  const values = EDITABLE_FIELDS.map((field) => patient[field]);

  const { lastID } = await run(
    `INSERT INTO patients (${EDITABLE_FIELDS.join(', ')}) VALUES (${placeholders})`,
    values
  );

  return findById(lastID);
}

async function update(id, patient) {
  const assignments = EDITABLE_FIELDS.map((field) => `${field} = ?`).join(', ');
  const values = [...EDITABLE_FIELDS.map((field) => patient[field]), id];

  const result = await run(
    `UPDATE patients SET ${assignments} WHERE id = ?`,
    values
  );

  if (result.changes === 0) return null;
  return findById(id);
}

async function remove(id) {
  return run('DELETE FROM patients WHERE id = ?', [id]);
}

module.exports = { list, findById, create, update, remove };
