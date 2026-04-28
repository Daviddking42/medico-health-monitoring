const patientService = require('../services/patientService');

const createProfile = async (req, res) => {
  try {
    const { medicalHistory, allergies, chronicConditions, emergencyContactName, emergencyContactPhone, bloodType } = req.body;
    
    const profile = await patientService.createPatientProfile(req.user.id, {
      medicalHistory,
      allergies,
      chronicConditions,
      emergencyContactName,
      emergencyContactPhone,
      bloodType
    });

    res.status(201).json({ profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await patientService.getPatientProfile(req.user.id);
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await patientService.updatePatientProfile(req.user.id, req.body);
    res.json({ profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile
};
