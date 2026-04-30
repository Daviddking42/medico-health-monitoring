const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const prisma = require('../config/prisma');

const registerUser = async (email, name, password, role, patientName) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // If registering as RELATIVE, validate the patient exists BEFORE creating account
    let patient = null;
    if (role === 'RELATIVE') {
      if (!patientName) {
        throw new Error('Patient name is required when registering as a Relative');
      }
      patient = await prisma.user.findFirst({
        where: { name: patientName, role: 'PATIENT' }
      });
      if (!patient) {
        throw new Error(`No patient found with the name "${patientName}"`);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use a transaction so both the user and the link are created atomically
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, name, password: hashedPassword, role }
      });

      // If RELATIVE, create the link to the patient immediately
      if (role === 'RELATIVE' && patient) {
        await tx.relative.create({
          data: {
            patientId: patient.id,
            relativeUserId: newUser.id,
            relation: 'Family Member'
          }
        });
      }

      // If PATIENT, create their profile automatically
      if (role === 'PATIENT') {
        await tx.patientProfile.create({
          data: { userId: newUser.id }
        });
      }

      return newUser;
    });

    return user;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    return { user, token };
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      patientProfile: true,
      devices: true
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
