const recordRepository = require('../repositories/recordRepository');
const { httpError } = require('../utils/httpError');

const REQUIRED_FIELDS = ['patient_id', 'date', 'diagnosis'];

function validate(record) {
  const missing = REQUIRED_FIELDS.filter(
    (field) => record[field] === undefined || record[field] === null || record[field] === ''
  );
  if (missing.length > 0) {
    throw httpError(
      400,
      `${missing.join(', ')} son obligatorios`
    );
  }
}

function pickRecordFields(body) {
  const record = {};
  for (const field of recordRepository.EDITABLE_FIELDS) {
    record[field] = body[field];
  }
  return record;
}

async function list() {
  return recordRepository.listWithPatients();
}

async function listByPatient(patientId) {
  return recordRepository.listByPatient(patientId);
}

async function getById(id) {
  const record = await recordRepository.findById(id);
  if (!record) throw httpError(404, 'Historia clínica no encontrada');
  return record;
}

async function create(body) {
  validate(body);
  return recordRepository.create(pickRecordFields(body));
}

async function update(id, body) {
  validate(body);
  const updated = await recordRepository.update(id, pickRecordFields(body));
  if (!updated) throw httpError(404, 'Historia clínica no encontrada');
  return updated;
}

async function remove(id) {
  const result = await recordRepository.remove(id);
  if (result.changes === 0) throw httpError(404, 'Historia clínica no encontrada');
  return { message: 'Historia clínica eliminada correctamente' };
}

module.exports = {
  list,
  listByPatient,
  getById,
  create,
  update,
  remove,
};
