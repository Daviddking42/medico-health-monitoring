const prisma = require('../config/prisma');

const getAssignedPatients = async (doctorId) => {
  const doctorPatients = await prisma.doctorPatient.findMany({
    where: { doctorId },
    include: {
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          patientProfile: true,
          devices: {
            include: {
              deviceData: {
                orderBy: { timestamp: 'desc' },
                take: 1
              }
            }
          },
          alerts: {
            where: { isViewed: false },
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      }
    }
  });

  // Map the results to return a cleaner structure
  return doctorPatients.map(dp => {
    const patient = dp.patient;
    
    // Extract latest vitals if a device exists and has data
    let latestVitals = null;
    if (patient.devices && patient.devices.length > 0) {
      const activeDevice = patient.devices.find(d => d.isActive) || patient.devices[0];
      if (activeDevice.deviceData && activeDevice.deviceData.length > 0) {
        latestVitals = activeDevice.deviceData[0];
      }
    }

    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      profile: patient.patientProfile,
      latestVitals,
      recentAlerts: patient.alerts
    };
  });
};

const getPatientVitals = async (doctorId, patientId, limit = 20) => {
  // First verify the doctor is assigned to this patient
  const assignment = await prisma.doctorPatient.findUnique({
    where: {
      doctorId_patientId: {
        doctorId,
        patientId: parseInt(patientId)
      }
    }
  });

  if (!assignment) {
    throw new Error('Not authorized to view this patient');
  }

  // Fetch the devices for the patient
  const devices = await prisma.device.findMany({
    where: { patientId: parseInt(patientId), isActive: true }
  });

  if (devices.length === 0) {
    return [];
  }

  // Get data for the active device
  const deviceData = await prisma.deviceData.findMany({
    where: { deviceId: devices[0].id },
    orderBy: { timestamp: 'desc' },
    take: parseInt(limit)
  });

  return deviceData;
};

module.exports = {
  getAssignedPatients,
  getPatientVitals
};
