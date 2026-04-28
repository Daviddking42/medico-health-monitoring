const prisma = require('../config/prisma');

const registerDevice = async (patientId, deviceId, deviceName) => {
  try {
    const device = await prisma.device.create({
      data: {
        patientId,
        deviceId,
        deviceName
      }
    });
    return device;
  } catch (error) {
    throw error;
  }
};

const getAllDevices = async (patientId) => {
  try {
    const devices = await prisma.device.findMany({
      where: { patientId },
      include: {
        deviceData: {
          orderBy: { timestamp: 'desc' },
          take: 10
        }
      }
    });
    return devices;
  } catch (error) {
    throw error;
  }
};

const recordDeviceData = async (deviceId, data) => {
  try {
    const deviceData = await prisma.deviceData.create({
      data: {
        deviceId,
        temperature: data.temperature,
        heartRate: data.heartRate,
        spO2: data.spO2,
        latitude: data.latitude,
        longitude: data.longitude
      }
    });
    return deviceData;
  } catch (error) {
    throw error;
  }
};

const getDeviceDataByRange = async (deviceId, startDate, endDate) => {
  try {
    const data = await prisma.deviceData.findMany({
      where: {
        deviceId,
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { timestamp: 'desc' }
    });
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerDevice,
  getAllDevices,
  recordDeviceData,
  getDeviceDataByRange
};
