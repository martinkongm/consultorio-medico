const fileService = require('../services/fileService');
const { httpError } = require('../utils/httpError');

async function upload(req, res) {
  const recordId = req.params.id;
  const file = req.file;

  if (!file) {
    throw httpError(400, 'No se subió ningún archivo');
  }

  await fileService.save(recordId, file.originalname, file.filename);

  res.status(201).json({
    message: 'Archivo subido correctamente',
    filename: file.originalname,
  });
}

async function listByRecord(req, res) {
  res.json(await fileService.listByRecord(req.params.id));
}

module.exports = { upload, listByRecord };
