# Medico - Health Monitoring Web App

A comprehensive health monitoring web application with role-based access control (RBAC) for doctors, patients, and relatives. Features real-time alerts, geolocation tracking, and IoT device integration.

## 🌟 Features

### Role-Based Dashboard
- **Doctor**: View all assigned patients, receive critical alerts, access medical history
- **Patient**: Monitor personal health data, view alerts, manage devices, add relatives
- **Relative**: Track patient location, receive alerts, view basic health status

### Core Features
- **JWT Authentication**: Secure token-based authentication
- **Real-time Updates**: WebSocket (Socket.io) for live notifications
- **Device Integration**: REST API for IoT device data collection
- **Alert System**: Automatic alerts for abnormal readings with severity levels
- **Geolocation**: GPS tracking and location monitoring
- **Responsive UI**: Modern React-based interface with role-specific views

### Tech Stack
- **Frontend**: React.js with React Router
- **Backend**: Node.js + Express.js
- **Database**: Prisma ORM with SQLite (easily switchable to PostgreSQL/MySQL)
- **Real-time**: Socket.io for WebSocket connections
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs for password hashing

## 📁 Project Structure

```
medico/
├── backend/                 # Node.js + Express server
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & validation
│   │   ├── services/       # Database operations
│   │   ├── config/         # Configuration files
│   │   └── server.js       # Main server file
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── package.json
│   └── .env               # Environment variables
│
├── frontend/               # React.js application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── DoctorDashboard/
│   │   │   ├── PatientDashboard/
│   │   │   ├── RelativeDashboard/
│   │   │   └── common/
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── context/       # React Context
│   │   ├── hooks/         # Custom hooks
│   │   ├── App.jsx        # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── .env              # Environment variables
│
├── run-app.bat           # Windows startup script
├── run-app.sh            # Linux/Mac startup script
├── install-deps.bat      # Windows dependency installer
├── package.json          # Root package.json
└── README.md            # This file
```

## 🚀 Quick Start

### Option 1: Using Batch Files (Windows)

1. **Install Dependencies** (First time only):
   ```bash
   install-deps.bat
   ```

2. **Start the Application**:
   ```bash
   run-app.bat
   ```
   This will automatically:
   - Install missing dependencies
   - Set up Prisma database
   - Start backend server on http://localhost:5000
   - Start frontend on http://localhost:3000

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm run prisma:migrate
npm run dev
```

Backend will run on: `http://localhost:5000`

#### Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm start
```

Frontend will run on: `http://localhost:3000`

## 📊 Database Schema

### Core Tables

**User**
- id (Primary Key)
- email (Unique)
- name
- password (hashed)
- role (DOCTOR, PATIENT, RELATIVE)
- createdAt, updatedAt

**PatientProfile**
- id (Primary Key)
- userId (Foreign Key)
- medicalHistory
- allergies
- chronicConditions
- emergencyContactName
- emergencyContactPhone
- bloodType

**Device**
- id (Primary Key)
- patientId (Foreign Key)
- deviceId (Unique)
- deviceName
- isActive

**DeviceData**
- id (Primary Key)
- deviceId (Foreign Key)
- temperature
- heartRate
- spO2 (Oxygen Saturation)
- latitude, longitude
- timestamp

**Alert**
- id (Primary Key)
- patientId (Foreign Key)
- type (e.g., "high_temperature", "irregular_heartbeat")
- severity ("low", "medium", "high", "critical")
- message
- latitude, longitude
- isViewed
- createdAt, viewedAt

**DeviceAlertRule**
- id (Primary Key)
- patientId (Foreign Key)
- deviceId (Foreign Key, nullable)
- metricType (e.g., "temperature", "heartRate")
- minThreshold
- maxThreshold

## 🔐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile (requires auth)

### Patient (`/api/patient`)
- `POST /profile` - Create patient profile
- `GET /profile` - Get patient profile
- `PUT /profile` - Update patient profile

### Devices (`/api/devices`)
- `POST /register` - Register new device
- `GET /` - Get all devices
- `POST /data` - Record device data
- `GET /:deviceId/data` - Get historical data

### Alerts (`/api/alerts`)
- `GET /` - Get all alerts
- `PUT /:alertId/viewed` - Mark alert as viewed
- `POST /rules` - Create alert rule
- `GET /rules` - Get alert rules

## 🧪 Testing the App

### Create Test Accounts

1. **Doctor Account**
   - Email: `doctor@medico.com`
   - Password: `Doctor123!`
   - Role: DOCTOR

2. **Patient Account**
   - Email: `patient@medico.com`
   - Password: `Patient123!`
   - Role: PATIENT

3. **Relative Account**
   - Email: `relative@medico.com`
   - Password: `Relative123!`
   - Role: RELATIVE

### API Testing
Use the provided endpoints to test device registration and data submission:

```bash
# Register a device
curl -X POST http://localhost:5000/api/devices/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"device1","deviceName":"Home Monitor"}'

# Record device data
curl -X POST http://localhost:5000/api/devices/data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId":1,
    "temperature":36.5,
    "heartRate":72,
    "spO2":98,
    "latitude":40.7128,
    "longitude":-74.0060
  }'
```

## 🔧 Configuration

### Backend Configuration (`.env`)
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRE="7d"
NODE_ENV="development"
PORT=5000
CORS_ORIGIN="http://localhost:3000"
```

### Frontend Configuration (`.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

### Backend
- express: Web framework
- @prisma/client: ORM
- socket.io: Real-time communication
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- cors: Cross-Origin Resource Sharing
- dotenv: Environment variables

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- socket.io-client: WebSocket client
- react-hook-form: Form management
- leaflet: Map visualization
- react-leaflet: React wrapper for Leaflet

## 🚨 Alert System Workflow

1. **Device sends data** → Backend receives via `/api/devices/data`
2. **Data validation** → Check against alert rules
3. **Abnormal reading detected** → Create Alert in database
4. **WebSocket emission** → Real-time notification to doctors/relatives
5. **Frontend update** → Dashboards display alert immediately
6. **User action** → Acknowledge alert (mark as viewed)

## 🌍 Geolocation Features

- **GPS Tracking**: Devices send latitude/longitude with each reading
- **Location History**: All historical location data stored
- **Real-time Updates**: WebSocket updates for current location
- **Map Integration**: Leaflet.js for displaying patient location

## 📱 Device Integration

Devices send data via REST API:

```json
{
  "deviceId": "device123",
  "temperature": 37.2,
  "heartRate": 78,
  "spO2": 97,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

## 🔄 Real-time Updates

Uses Socket.io for real-time communication:

```javascript
// Patient joins their channel
socket.emit('join-patient', patientId);

// Data update event
socket.on('device-data', (data) => {
  // Update UI with new data
});
```

## 🛠️ Troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Set `PORT=3001` before running `npm start`

### Database Error
```bash
# Reset database
cd backend
npx prisma migrate reset
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### WebSocket Connection Failed
- Check CORS_ORIGIN in backend `.env`
- Ensure frontend API_URL matches backend address

## 📚 Future Enhancements

- [ ] SMS/Email notifications
- [ ] Advanced health analytics
- [ ] Video consultation integration
- [ ] Mobile app (React Native)
- [ ] Third-party device integration (Apple Watch, Fitbit, etc.)
- [ ] AI-based health prediction
- [ ] Multi-language support
- [ ] Dark mode theme

## 📄 License

MIT License

## 👥 Support

For issues or questions, please refer to the documentation or contact support.

---

**Happy health monitoring! 🏥**
