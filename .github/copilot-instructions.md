# Medico - Health Monitoring Web App Setup Guide

## Project Overview
Building a role-based health monitoring web application with:
- React.js frontend with role-based dashboards
- Node.js + Express backend with JWT authentication
- Prisma ORM with PostgreSQL database
- Real-time WebSocket updates
- Geolocation and device alerts
- Support for doctor, patient, and relative roles

## Setup Progress

- [x] Create directory structure for monorepo
- [x] Set up root package.json with workspaces
- [ ] Set up backend (Node.js + Express + Prisma)
- [ ] Set up frontend (React)
- [ ] Install all dependencies
- [ ] Create database schema
- [ ] Configure environment variables
- [ ] Create .bat file for offline execution

## Key Features Implemented
1. **Authentication**: JWT-based authentication
2. **Authorization**: Role-based access control (RBAC)
3. **Database**: Prisma ORM with relation models
4. **Real-time**: WebSocket support with Socket.io
5. **Geolocation**: GPS tracking and map display
6. **Device Integration**: REST API for IoT devices
7. **Alerts**: Real-time notifications for abnormal readings

## Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── config/
│   └── server.js
├── prisma/
│   └── schema.prisma
├── .env.example
└── package.json
```

## Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── DoctorDashboard/
│   │   ├── PatientDashboard/
│   │   ├── RelativeDashboard/
│   │   └── common/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   └── App.jsx
├── .env.example
└── package.json
```

## Database Schema
- **User**: id, name, email, password (hashed), role, createdAt
- **PatientProfile**: id, userId, medicalHistory, allergies, chronicConditions
- **Relative**: id, patientId, relativeUserId, relation
- **Device**: id, patientId, deviceId, deviceName
- **DeviceData**: id, deviceId, temperature, heartRate, latitude, longitude, timestamp
- **Alert**: id, patientId, type, severity, message, latitude, longitude, isViewed, createdAt
- **DeviceAlertRule**: id, patientId, metricType, minThreshold, maxThreshold

## Running the Application

### Development Mode
```
npm run dev
```

### Production Build
```
npm run build
npm start
```

### Offline Batch File
Use `run-app.bat` in the root directory to start the entire application offline.
