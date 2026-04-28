const express = require('express');
const patientController = require('../controllers/patientController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/profile', authenticateToken, authorizeRole('PATIENT'), patientController.createProfile);
router.get('/profile', authenticateToken, authorizeRole('PATIENT'), patientController.getProfile);
router.put('/profile', authenticateToken, authorizeRole('PATIENT'), patientController.updateProfile);

module.exports = router;
