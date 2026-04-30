const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

// All doctor routes are protected
router.use(protect);

router.get('/patients', doctorController.getPatients);
router.get('/patients/:patientId/vitals', doctorController.getPatientVitals);

module.exports = router;
