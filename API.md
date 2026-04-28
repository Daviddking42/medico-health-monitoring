# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123",
  "role": "PATIENT"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PATIENT"
  }
}
```

---

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PATIENT"
  }
}
```

---

### Get Current User Profile
**GET** `/auth/profile`
**Authentication**: Required

Response:
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PATIENT",
    "createdAt": "2024-01-15T10:30:00Z",
    "patientProfile": { ... },
    "devices": [ ... ]
  }
}
```

---

## Patient Profile Endpoints

### Create Patient Profile
**POST** `/patient/profile`
**Authentication**: Required (PATIENT role)

Request body:
```json
{
  "medicalHistory": "Hypertension, Type 2 Diabetes",
  "allergies": "Penicillin, Shellfish",
  "chronicConditions": "Diabetes, High Blood Pressure",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+1-555-0100",
  "bloodType": "O+"
}
```

Response:
```json
{
  "profile": {
    "id": 1,
    "userId": 1,
    "medicalHistory": "Hypertension, Type 2 Diabetes",
    "allergies": "Penicillin, Shellfish",
    "chronicConditions": "Diabetes, High Blood Pressure",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+1-555-0100",
    "bloodType": "O+"
  }
}
```

---

### Get Patient Profile
**GET** `/patient/profile`
**Authentication**: Required (PATIENT role)

Response: Same as Create Patient Profile response

---

### Update Patient Profile
**PUT** `/patient/profile`
**Authentication**: Required (PATIENT role)

Request body: (All fields optional)
```json
{
  "medicalHistory": "Updated medical history",
  "allergies": "New allergy info",
  "chronicConditions": "Updated conditions"
}
```

---

## Device Endpoints

### Register Device
**POST** `/devices/register`
**Authentication**: Required (PATIENT role)

Request body:
```json
{
  "deviceId": "device_001",
  "deviceName": "Home Health Monitor"
}
```

Response:
```json
{
  "device": {
    "id": 1,
    "patientId": 1,
    "deviceId": "device_001",
    "deviceName": "Home Health Monitor",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get All Devices
**GET** `/devices`
**Authentication**: Required (PATIENT role)

Response:
```json
{
  "devices": [
    {
      "id": 1,
      "patientId": 1,
      "deviceId": "device_001",
      "deviceName": "Home Health Monitor",
      "isActive": true,
      "deviceData": [
        {
          "id": 1,
          "deviceId": 1,
          "temperature": 36.8,
          "heartRate": 72,
          "spO2": 98,
          "latitude": 40.7128,
          "longitude": -74.0060,
          "timestamp": "2024-01-15T10:30:00Z"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Record Device Data
**POST** `/devices/data`
**Authentication**: Required

Request body:
```json
{
  "deviceId": 1,
  "temperature": 37.2,
  "heartRate": 78,
  "spO2": 97,
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

Response:
```json
{
  "deviceData": {
    "id": 2,
    "deviceId": 1,
    "temperature": 37.2,
    "heartRate": 78,
    "spO2": 97,
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

**Note**: If abnormal readings are detected based on alert rules, they will automatically create alerts.

---

### Get Device Historical Data
**GET** `/devices/{deviceId}/data`
**Authentication**: Required

Query Parameters:
- `startDate` (optional): ISO date string (default: 7 days ago)
- `endDate` (optional): ISO date string (default: now)

Example: `/devices/1/data?startDate=2024-01-01&endDate=2024-01-15`

Response:
```json
{
  "data": [
    {
      "id": 2,
      "deviceId": 1,
      "temperature": 37.2,
      "heartRate": 78,
      "spO2": 97,
      "latitude": 40.7128,
      "longitude": -74.0060,
      "timestamp": "2024-01-15T10:35:00Z"
    }
  ]
}
```

---

## Alert Endpoints

### Get All Alerts
**GET** `/alerts`
**Authentication**: Required

Query Parameters:
- `limit` (optional, default: 50): Number of alerts to return

Response:
```json
{
  "alerts": [
    {
      "id": 1,
      "patientId": 1,
      "type": "high_temperature",
      "severity": "high",
      "message": "Abnormal temperature: 38.5",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "isViewed": false,
      "createdAt": "2024-01-15T10:35:00Z",
      "viewedAt": null
    }
  ]
}
```

---

### Mark Alert as Viewed
**PUT** `/alerts/{alertId}/viewed`
**Authentication**: Required

Response:
```json
{
  "alert": {
    "id": 1,
    "patientId": 1,
    "type": "high_temperature",
    "severity": "high",
    "message": "Abnormal temperature: 38.5",
    "isViewed": true,
    "viewedAt": "2024-01-15T10:40:00Z"
  }
}
```

---

### Create Alert Rule
**POST** `/alerts/rules`
**Authentication**: Required (PATIENT role)

Request body:
```json
{
  "deviceId": 1,
  "metricType": "temperature",
  "minThreshold": 36.0,
  "maxThreshold": 38.5
}
```

Response:
```json
{
  "rule": {
    "id": 1,
    "patientId": 1,
    "deviceId": 1,
    "metricType": "temperature",
    "minThreshold": 36.0,
    "maxThreshold": 38.5,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get All Alert Rules
**GET** `/alerts/rules`
**Authentication**: Required (PATIENT role)

Response:
```json
{
  "rules": [
    {
      "id": 1,
      "patientId": 1,
      "deviceId": 1,
      "metricType": "temperature",
      "minThreshold": 36.0,
      "maxThreshold": 38.5,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Device not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting
Currently not implemented, but recommended for production.

## CORS
Configured to accept requests from `http://localhost:3000` in development.

Change `CORS_ORIGIN` in `.env` for different domains.

---

## WebSocket Events

The server uses Socket.io for real-time updates.

### Connection
```javascript
const socket = io('http://localhost:5000');
```

### Events
- **join-patient**: Join a patient's update channel
  ```javascript
  socket.emit('join-patient', patientId);
  ```

- **device-data**: Receive real-time device data updates
  ```javascript
  socket.on('device-data', (data) => {
    console.log('New device data:', data);
  });
  ```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "Test@123",
    "role": "PATIENT"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Register Device
```bash
curl -X POST http://localhost:5000/api/devices/register \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "device_123",
    "deviceName": "My Wearable"
  }'
```

### Record Device Data
```bash
curl -X POST http://localhost:5000/api/devices/data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": 1,
    "temperature": 37.5,
    "heartRate": 85,
    "spO2": 97,
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

---

**For more information, see README.md and SETUP.md**
