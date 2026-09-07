const fileRepository = require('../repositories/fileRepository');
const recordRepository = require('../repositories/recordRepository');
const { httpError } = require('../utils/httpError');

async function save(recordId, originalName, storedName) {
  const record = await recordRepository.findById(recordId);
  if (!record) throw httpError(404, 'Historia clínica no encontrada');

  return fileRepository.add(recordId, originalName, storedName);
}

function listByRecord(recordId) {
  return fileRepository.listByRecord(recordId);
}

module.exports = { save, listByRecord };
