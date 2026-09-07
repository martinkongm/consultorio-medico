const patientService = require('../services/patientService');

async function list(req, res) {
  res.json(await patientService.list());
}

async function getById(req, res) {
  res.json(await patientService.getById(req.params.id));
}

async function create(req, res) {
  res.status(201).json(await patientService.create(req.body));
}

async function update(req, res) {
  res.json(await patientService.update(req.params.id, req.body));
}

async function remove(req, res) {
  res.json(await patientService.remove(req.params.id));
}

module.exports = { list, getById, create, update, remove };
