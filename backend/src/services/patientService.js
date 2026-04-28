const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createPatientProfile = async (userId, profileData) => {
  try {
    const profile = await prisma.patientProfile.create({
      data: {
        userId,
        ...profileData
      }
    });
    return profile;
  } catch (error) {
    throw error;
  }
};

const getPatientProfile = async (userId) => {
  try {
    const profile = await prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: true
      }
    });
    return profile;
  } catch (error) {
    throw error;
  }
};

const updatePatientProfile = async (userId, profileData) => {
  try {
    const profile = await prisma.patientProfile.update({
      where: { userId },
      data: profileData
    });
    return profile;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPatientProfile,
  getPatientProfile,
  updatePatientProfile
};
