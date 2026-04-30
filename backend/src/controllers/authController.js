const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { email, name, password, role, patientName } = req.body;
    
    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (role === 'RELATIVE' && !patientName) {
      return res.status(400).json({ error: 'Patient name is required when registering as a Relative' });
    }

    const user = await authService.registerUser(email, name, password, role, patientName);
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const { user, token } = await authService.loginUser(email, password);
    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
