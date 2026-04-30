const doctorService = require('../services/doctorService');

const getPatients = async (req, res) => {
  try {
    // req.user is set by auth middleware
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ error: 'Access denied: Doctors only' });
    }
    
    const patients = await doctorService.getAssignedPatients(req.user.id);
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientVitals = async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ error: 'Access denied: Doctors only' });
    }

    const { patientId } = req.params;
    const { limit } = req.query;
    
    const vitals = await doctorService.getPatientVitals(req.user.id, patientId, limit);
    res.json({ vitals });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPatients,
  getPatientVitals
};
