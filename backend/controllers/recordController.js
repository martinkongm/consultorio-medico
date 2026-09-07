const recordService = require('../services/recordService');

async function list(req, res) {
  res.json(await recordService.list());
}

async function listByPatient(req, res) {
  res.json(await recordService.listByPatient(req.params.patientId));
}

async function getById(req, res) {
  res.json(await recordService.getById(req.params.id));
}

async function create(req, res) {
  res.status(201).json(await recordService.create(req.body));
}

async function update(req, res) {
  res.json(await recordService.update(req.params.id, req.body));
}

async function remove(req, res) {
  res.json(await recordService.remove(req.params.id));
}

module.exports = {
  list,
  listByPatient,
  getById,
  create,
  update,
  remove,
};
