const relativeService = require('../services/relativeService');

const getPatients = async (req, res) => {
  try {
    if (req.user.role !== 'RELATIVE') {
      return res.status(403).json({ error: 'Access denied: Relatives only' });
    }
    
    const patients = await relativeService.getLinkedPatients(req.user.id);
    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatientVitals = async (req, res) => {
  try {
    if (req.user.role !== 'RELATIVE') {
      return res.status(403).json({ error: 'Access denied: Relatives only' });
    }

    const { patientId } = req.params;
    const { limit } = req.query;
    
    const vitals = await relativeService.getPatientVitals(req.user.id, patientId, limit);
    res.json({ vitals });
  } catch (error) {
    if (error.message.includes('Not authorized')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const linkPatient = async (req, res) => {
  try {
    if (req.user.role !== 'RELATIVE') {
      return res.status(403).json({ error: 'Access denied: Relatives only' });
    }

    const { patientName } = req.body;
    if (!patientName) {
      return res.status(400).json({ error: 'Patient name is required' });
    }

    const link = await relativeService.linkPatientByName(req.user.id, patientName);
    res.json({ success: true, link });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPatients,
  getPatientVitals,
  linkPatient
};
