const deviceService = require('../services/deviceService');
const alertService = require('../services/alertService');
const prisma = require('../config/prisma');

const registerDevice = async (req, res) => {
  try {
    const { deviceId, deviceName } = req.body;
    
    if (!deviceId || !deviceName) {
      return res.status(400).json({ error: 'Device ID and name required' });
    }

    const device = await deviceService.registerDevice(req.user.id, deviceId, deviceName);
    res.status(201).json({ device });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDevices = async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices(req.user.id);
    res.json({ devices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const recordData = async (req, res) => {
  try {
    const { deviceId, temperature, heartRate, spO2, latitude, longitude } = req.body;
    
    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID required' });
    }

    // Get device to verify ownership - fix: use deviceId (string) if that's what's sent, 
    // or handle both internal ID and string deviceId.
    const device = await prisma.device.findFirst({ 
      where: { 
        OR: [
          { deviceId: deviceId },
          { id: isNaN(parseInt(deviceId)) ? -1 : parseInt(deviceId) }
        ]
      } 
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Record the data
    const deviceData = await deviceService.recordDeviceData(device.id, {
      temperature,
      heartRate,
      spO2,
      latitude,
      longitude
    });

    // Check for alerts
    await alertService.checkAndCreateAlerts(
      { temperature, heartRate, spO2, latitude, longitude },
      device
    );

    // Emit through websocket
    global.io?.emit('device-data', {
      patientId: device.patientId,
      deviceData
    });

    res.status(201).json({ deviceData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDeviceData = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const data = await deviceService.getDeviceDataByRange(parseInt(deviceId), start, end);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerDevice,
  getDevices,
  recordData,
  getDeviceData
};
