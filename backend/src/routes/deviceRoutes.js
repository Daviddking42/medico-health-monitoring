const express = require('express');
const deviceController = require('../controllers/deviceController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authenticateToken, deviceController.registerDevice);
router.get('/', authenticateToken, deviceController.getDevices);
router.post('/data', authenticateToken, deviceController.recordData);
router.get('/:deviceId/data', authenticateToken, deviceController.getDeviceData);

module.exports = router;
