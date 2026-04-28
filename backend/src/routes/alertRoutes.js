const express = require('express');
const alertController = require('../controllers/alertController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, alertController.getAlerts);
router.put('/:alertId/viewed', authenticateToken, alertController.markAsViewed);
router.post('/rules', authenticateToken, alertController.createAlertRule);
router.get('/rules', authenticateToken, alertController.getAlertRules);

module.exports = router;
