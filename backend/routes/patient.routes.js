const router = require('express').Router();
const asyncHandler = require('../middleware/asyncHandler');
const patientController = require('../controllers/patientController');

router.get('/', asyncHandler(patientController.list));
router.get('/:id', asyncHandler(patientController.getById));
router.post('/', asyncHandler(patientController.create));
router.put('/:id', asyncHandler(patientController.update));
router.delete('/:id', asyncHandler(patientController.remove));

module.exports = router;
