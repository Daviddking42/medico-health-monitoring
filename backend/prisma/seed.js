// Generate sample test data for the application

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create test users
    const hashedPassword = await bcrypt.hash('Test@123', 10);

    // Doctor
    const doctor = await prisma.user.upsert({
      where: { email: 'doctor@medico.com' },
      update: {},
      create: {
        email: 'doctor@medico.com',
        name: 'Dr. Sarah Johnson',
        password: hashedPassword,
        role: 'DOCTOR'
      }
    });

    // Patient
    const patient = await prisma.user.upsert({
      where: { email: 'patient@medico.com' },
      update: {},
      create: {
        email: 'patient@medico.com',
        name: 'John Doe',
        password: hashedPassword,
        role: 'PATIENT'
      }
    });

    // Relative
    const relative = await prisma.user.upsert({
      where: { email: 'relative@medico.com' },
      update: {},
      create: {
        email: 'relative@medico.com',
        name: 'Jane Doe',
        password: hashedPassword,
        role: 'RELATIVE'
      }
    });

    // Create patient profile
    await prisma.patientProfile.upsert({
      where: { userId: patient.id },
      update: {},
      create: {
        userId: patient.id,
        medicalHistory: 'Hypertension, Type 2 Diabetes',
        allergies: 'Penicillin',
        chronicConditions: 'Diabetes, High Blood Pressure',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '+1-555-0100',
        bloodType: 'O+'
      }
    });

    // Assign doctor to patient
    await prisma.doctorPatient.upsert({
      where: { doctorId_patientId: { doctorId: doctor.id, patientId: patient.id } },
      update: {},
      create: {
        doctorId: doctor.id,
        patientId: patient.id
      }
    });

    // Create relative relationship
    await prisma.relative.upsert({
      where: { patientId_relativeUserId: { patientId: patient.id, relativeUserId: relative.id } },
      update: {},
      create: {
        patientId: patient.id,
        relativeUserId: relative.id,
        relation: 'spouse'
      }
    });

    // Create a device
    const device = await prisma.device.upsert({
      where: { deviceId: 'device_001' },
      update: {},
      create: {
        patientId: patient.id,
        deviceId: 'device_001',
        deviceName: 'Home Health Monitor',
        isActive: true
      }
    });

    // Create some sample device data
    const now = new Date();
    await prisma.deviceData.create({
      data: {
        deviceId: device.id,
        temperature: 36.8,
        heartRate: 72,
        spO2: 98,
        latitude: 40.7128,
        longitude: -74.0060,
        timestamp: new Date(now.getTime() - 30 * 60000) // 30 minutes ago
      }
    });

    await prisma.deviceData.create({
      data: {
        deviceId: device.id,
        temperature: 37.2,
        heartRate: 78,
        spO2: 97,
        latitude: 40.7140,
        longitude: -74.0065,
        timestamp: new Date(now.getTime() - 15 * 60000) // 15 minutes ago
      }
    });

    // Create alert rules
    await prisma.deviceAlertRule.createMany({
      data: [
        {
          patientId: patient.id,
          deviceId: device.id,
          metricType: 'temperature',
          minThreshold: 36.0,
          maxThreshold: 38.5
        },
        {
          patientId: patient.id,
          deviceId: device.id,
          metricType: 'heartRate',
          minThreshold: 50,
          maxThreshold: 100
        },
        {
          patientId: patient.id,
          deviceId: device.id,
          metricType: 'spO2',
          minThreshold: 95,
          maxThreshold: 100
        }
      ]
    });

    console.log('✅ Database seeding completed successfully!');
    console.log('\nTest Accounts Created:');
    console.log('  Doctor - Email: doctor@medico.com | Password: Test@123');
    console.log('  Patient - Email: patient@medico.com | Password: Test@123');
    console.log('  Relative - Email: relative@medico.com | Password: Test@123');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
