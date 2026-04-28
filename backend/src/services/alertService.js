const prisma = require('../config/prisma');

const createAlert = async (patientId, type, severity, message, latitude, longitude) => {
  try {
    const alert = await prisma.alert.create({
      data: {
        patientId,
        type,
        severity,
        message,
        latitude,
        longitude
      }
    });
    return alert;
  } catch (error) {
    throw error;
  }
};

const getAlerts = async (patientId, limit = 50) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    return alerts;
  } catch (error) {
    throw error;
  }
};

const markAlertAsViewed = async (alertId) => {
  try {
    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        isViewed: true,
        viewedAt: new Date()
      }
    });
    return alert;
  } catch (error) {
    throw error;
  }
};

const createAlertRule = async (patientId, deviceId, metricType, minThreshold, maxThreshold) => {
  try {
    const rule = await prisma.deviceAlertRule.create({
      data: {
        patientId,
        deviceId,
        metricType,
        minThreshold,
        maxThreshold
      }
    });
    return rule;
  } catch (error) {
    throw error;
  }
};

const getAlertRules = async (patientId) => {
  try {
    const rules = await prisma.deviceAlertRule.findMany({
      where: { patientId }
    });
    return rules;
  } catch (error) {
    throw error;
  }
};

const checkAndCreateAlerts = async (deviceData, device) => {
  try {
    const rules = await prisma.deviceAlertRule.findMany({
      where: { patientId: device.patientId }
    });

    for (const rule of rules) {
      const metricValue = deviceData[rule.metricType];
      
      if (metricValue !== undefined && metricValue !== null) {
        let shouldAlert = false;
        let severity = 'low';

        if (rule.minThreshold && metricValue < rule.minThreshold) {
          shouldAlert = true;
          severity = 'high';
        } else if (rule.maxThreshold && metricValue > rule.maxThreshold) {
          shouldAlert = true;
          severity = rule.metricType === 'temperature' && metricValue > 40 ? 'critical' : 'high';
        }

        if (shouldAlert) {
          await createAlert(
            device.patientId,
            rule.metricType,
            severity,
            `Abnormal ${rule.metricType}: ${metricValue}`,
            deviceData.latitude,
            deviceData.longitude
          );
        }
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAlert,
  getAlerts,
  markAlertAsViewed,
  createAlertRule,
  getAlertRules,
  checkAndCreateAlerts
};
