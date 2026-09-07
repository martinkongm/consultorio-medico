const patientRepository = require('../repositories/patientRepository');
const { calcularEdad } = require('../utils/age');
const { httpError } = require('../utils/httpError');

function validateName(name) {
  if (!name || !String(name).trim()) {
    throw httpError(400, 'Nombre es obligatorio.');
  }
}

// Los campos provienen del cuerpo de la petición; nos quedamos solo con los
// que el repositorio acepta (evita "edad" u otros valores residuales).
function pickPatientFields(body) {
  return {
    name: body.name,
    dni: body.dni,
    birthdate: body.birthdate,
    gender: body.gender,
    phone: body.phone,
    domicilio: body.domicilio,
  };
}

function toPublic(row) {
  if (!row) return null;
  return { ...row, edad: calcularEdad(row.birthdate) };
}

async function list() {
  const patients = await patientRepository.list();
  return patients.map(toPublic);
}

async function getById(id) {
  const patient = await patientRepository.findById(id);
  if (!patient) throw httpError(404, 'Paciente no encontrado');
  return toPublic(patient);
}

async function create(body) {
  validateName(body.name);
  return toPublic(await patientRepository.create(pickPatientFields(body)));
}

async function update(id, body) {
  validateName(body.name);
  const updated = await patientRepository.update(id, pickPatientFields(body));
  if (!updated) throw httpError(404, 'Paciente no encontrado');
  return toPublic(updated);
}

async function remove(id) {
  const result = await patientRepository.remove(id);
  if (result.changes === 0) throw httpError(404, 'Paciente no encontrado');
  return { message: 'Paciente eliminado correctamente' };
}

module.exports = { list, getById, create, update, remove };
