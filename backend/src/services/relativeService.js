const prisma = require('../config/prisma');

const getLinkedPatients = async (relativeUserId) => {
  const relatives = await prisma.relative.findMany({
    where: { relativeUserId },
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

  return relatives.map(rel => {
    const patient = rel.patient;
    
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
      relation: rel.relation,
      profile: patient.patientProfile,
      latestVitals,
      recentAlerts: patient.alerts
    };
  });
};

const getPatientVitals = async (relativeUserId, patientId, limit = 20) => {
  // Verify relative connection
  const connection = await prisma.relative.findUnique({
    where: {
      patientId_relativeUserId: {
        patientId: parseInt(patientId),
        relativeUserId
      }
    }
  });

  if (!connection) {
    throw new Error('Not authorized to view this patient');
  }

  const devices = await prisma.device.findMany({
    where: { patientId: parseInt(patientId), isActive: true }
  });

  if (devices.length === 0) {
    return [];
  }

  const deviceData = await prisma.deviceData.findMany({
    where: { deviceId: devices[0].id },
    orderBy: { timestamp: 'desc' },
    take: parseInt(limit)
  });

  return deviceData;
};

const linkPatientByName = async (relativeUserId, patientName) => {
  // 1. Find the patient by name (must be a PATIENT role)
  const patient = await prisma.user.findFirst({
    where: {
      name: patientName,
      role: 'PATIENT'
    }
  });

  if (!patient) {
    throw new Error('No patient found with that name');
  }

  // 2. Check if already linked
  const existingLink = await prisma.relative.findUnique({
    where: {
      patientId_relativeUserId: {
        patientId: patient.id,
        relativeUserId
      }
    }
  });

  if (existingLink) {
    throw new Error('You are already linked to this patient');
  }

  // 3. Create the link
  const link = await prisma.relative.create({
    data: {
      patientId: patient.id,
      relativeUserId,
      relation: 'Family Member' // Default relation, could be customized later
    }
  });

  return link;
};

module.exports = {
  getLinkedPatients,
  getPatientVitals,
  linkPatientByName
};
