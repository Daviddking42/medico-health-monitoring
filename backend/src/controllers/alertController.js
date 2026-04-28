const alertService = require('../services/alertService');

const getAlerts = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const alerts = await alertService.getAlerts(req.user.id, parseInt(limit));
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsViewed = async (req, res) => {
  try {
    const { alertId } = req.params;
    const alert = await alertService.markAlertAsViewed(parseInt(alertId));
    res.json({ alert });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createAlertRule = async (req, res) => {
  try {
    const { deviceId, metricType, minThreshold, maxThreshold } = req.body;
    
    if (!metricType) {
      return res.status(400).json({ error: 'Metric type required' });
    }

    const rule = await alertService.createAlertRule(
      req.user.id,
      deviceId ? parseInt(deviceId) : null,
      metricType,
      minThreshold,
      maxThreshold
    );

    res.status(201).json({ rule });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAlertRules = async (req, res) => {
  try {
    const rules = await alertService.getAlertRules(req.user.id);
    res.json({ rules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAlerts,
  markAsViewed,
  createAlertRule,
  getAlertRules
};
