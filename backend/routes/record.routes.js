const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const recordController = require('../controllers/recordController');
const fileController = require('../controllers/fileController');
const { upload } = require('../middleware/upload');

// Rutas específicas antes de "/:id" para evitar que "patient/:patientId"
// o ":id/files" queden capturadas por el segmento genérico.
router.get('/', asyncHandler(recordController.list));
router.get('/patient/:patientId', asyncHandler(recordController.listByPatient));
router.post('/:id/upload', upload.single('file'), asyncHandler(fileController.upload));
router.get('/:id/files', asyncHandler(fileController.listByRecord));
router.get('/:id', asyncHandler(recordController.getById));
router.post('/', asyncHandler(recordController.create));
router.put('/:id', asyncHandler(recordController.update));
router.delete('/:id', asyncHandler(recordController.remove));

module.exports = router;
