const express = require('express');
const router = express.Router();
const relativeController = require('../controllers/relativeController');
const { protect } = require('../middleware/auth');

// All relative routes are protected
router.use(protect);

router.get('/patients', relativeController.getPatients);
router.get('/patients/:patientId/vitals', relativeController.getPatientVitals);
router.post('/link', relativeController.linkPatient);

module.exports = router;
