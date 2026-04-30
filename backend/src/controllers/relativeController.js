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

module.exports = {
  getPatients,
  getPatientVitals
};
