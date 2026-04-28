-- CreateTable prisma migration
-- Initial schema migration

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'PATIENT',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patient_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER UNIQUE NOT NULL,
  medicalHistory TEXT,
  allergies TEXT,
  chronicConditions TEXT,
  emergencyContactName TEXT,
  emergencyContactPhone TEXT,
  bloodType TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS doctor_patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctorId INTEGER NOT NULL,
  patientId INTEGER NOT NULL,
  assignedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctorId, patientId),
  FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS relatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId INTEGER NOT NULL,
  relativeUserId INTEGER NOT NULL,
  relation TEXT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(patientId, relativeUserId),
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relativeUserId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId INTEGER NOT NULL,
  deviceId TEXT UNIQUE NOT NULL,
  deviceName TEXT NOT NULL,
  isActive INTEGER NOT NULL DEFAULT 1,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS device_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deviceId INTEGER NOT NULL,
  temperature REAL,
  heartRate INTEGER,
  spO2 INTEGER,
  latitude REAL,
  longitude REAL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (deviceId) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE INDEX idx_device_data_deviceId ON device_data(deviceId);
CREATE INDEX idx_device_data_timestamp ON device_data(timestamp);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId INTEGER NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  isViewed INTEGER NOT NULL DEFAULT 0,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  viewedAt DATETIME,
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_alerts_patientId ON alerts(patientId);
CREATE INDEX idx_alerts_createdAt ON alerts(createdAt);

CREATE TABLE IF NOT EXISTS device_alert_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patientId INTEGER NOT NULL,
  deviceId INTEGER,
  metricType TEXT NOT NULL,
  minThreshold REAL,
  maxThreshold REAL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (deviceId) REFERENCES devices(id) ON DELETE SET NULL
);

CREATE INDEX idx_device_alert_rules_patientId ON device_alert_rules(patientId);
