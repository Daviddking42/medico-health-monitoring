# Development Guide

## Understanding the Project Structure

### Backend Architecture

```
backend/
├── src/
│   ├── controllers/     - Handle HTTP requests and responses
│   ├── routes/          - Define API endpoints
│   ├── middleware/      - Authentication and validation
│   ├── services/        - Business logic and database operations
│   ├── config/          - Configuration files
│   └── server.js        - Express app and WebSocket setup
├── prisma/
│   ├── schema.prisma    - Database schema definition
│   └── seed.js          - Test data seeding
└── package.json         - Dependencies
```

### Frontend Architecture

```
frontend/
├── public/              - Static files
├── src/
│   ├── components/      - React components
│   ├── pages/           - Page-level components
│   ├── services/        - API client and utilities
│   ├── context/         - React Context (state management)
│   ├── hooks/           - Custom React hooks
│   ├── App.jsx          - Main app component
│   └── index.js         - Entry point
└── package.json         - Dependencies
```

---

## Key Concepts

### 1. Role-Based Access Control (RBAC)

Three user roles are defined:
- **DOCTOR**: Can view all patients, manage alerts, access medical history
- **PATIENT**: Can view own data, register devices, add relatives
- **RELATIVE**: Limited access to patient alerts and location

**Implementation**:
```javascript
// Backend: auth.js middleware
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage in routes
router.post('/profile', 
  authenticateToken, 
  authorizeRole('PATIENT'), 
  patientController.createProfile
);
```

### 2. JWT Authentication

JSON Web Tokens are used for authenticating requests:

1. User logs in with email and password
2. Server generates a JWT token
3. Client stores token in localStorage
4. Client sends token in every request header
5. Server validates token before handling requests

**Token Structure**:
```javascript
{
  id: user.id,
  email: user.email,
  role: user.role,
  iat: 1234567890,
  exp: 1234654290
}
```

### 3. Database Relations

Key relationships:
- **User → PatientProfile**: One-to-one (Patient has one profile)
- **Doctor → Patient**: Many-to-many (Via DoctorPatient table)
- **Patient → Relative**: One-to-many (One relative has many patients)
- **Patient → Device**: One-to-many (One patient has many devices)
- **Device → DeviceData**: One-to-many (One device has many data readings)
- **Patient → Alert**: One-to-many (One patient has many alerts)

### 4. Alert System Workflow

```
Device Data → API → Validation → Check Rules → Create Alert → WebSocket Emit → Frontend
```

Example alert rule:
```javascript
{
  patientId: 1,
  metricType: "temperature",
  minThreshold: 36.0,
  maxThreshold: 38.5
}
```

When data arrives with temperature 39.0 → Alert created with severity "critical"

### 5. Real-time Communication

WebSocket events keep dashboards updated:

```javascript
// Backend: emit data to clients
io.to(`patient-${patientId}`).emit('device-data', deviceData);

// Frontend: listen for updates
socket.on('device-data', (data) => {
  setDevices(prev => [...prev, data]);
});
```

---

## Adding New Features

### Adding a New API Endpoint

#### 1. Create Controller
`backend/src/controllers/newController.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getNewData = async (req, res) => {
  try {
    const data = await prisma.someTable.findMany();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getNewData };
```

#### 2. Create Route
`backend/src/routes/newRoutes.js`:
```javascript
const express = require('express');
const controller = require('../controllers/newController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, controller.getNewData);

module.exports = router;
```

#### 3. Register Route in server.js
```javascript
const newRoutes = require('./routes/newRoutes');
app.use('/api/new', newRoutes);
```

#### 4. Update Frontend Service
`frontend/src/services/api.js`:
```javascript
export const newAPI = {
  getNewData: () =>
    apiClient.get('/new'),
  createNewData: (data) =>
    apiClient.post('/new', data)
};
```

### Adding a New Database Model

#### 1. Update Prisma Schema
`backend/prisma/schema.prisma`:
```prisma
model NewModel {
  id        Int       @id @default(autoincrement())
  name      String
  userId    Int
  user      User      @relation(fields: [userId], references: [id])
  createdAt DateTime  @default(now())
  
  @@map("new_models")
}
```

#### 2. Run Migration
```bash
cd backend
npx prisma migrate dev --name add_new_model
```

#### 3. Generate Prisma Client
```bash
npx prisma generate
```

### Adding a New React Component

#### 1. Create Component
`frontend/src/components/MyComponent/MyComponent.jsx`:
```javascript
import React, { useState, useEffect } from 'react';
import './MyComponent.css';

const MyComponent = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Fetch data
  }, []);
  
  return (
    <div className="my-component">
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

#### 2. Add Styles
`frontend/src/components/MyComponent/MyComponent.css`:
```css
.my-component {
  padding: 1rem;
  border-radius: 8px;
}
```

#### 3. Import and Use
```javascript
import MyComponent from './components/MyComponent/MyComponent';

// In your JSX
<MyComponent />
```

---

## Common Tasks

### Adding a New Alert Type

1. **Define in Service**:
```javascript
// In alertService.js
const checkAndCreateAlerts = async (deviceData, device) => {
  if (deviceData.newMetric > threshold) {
    await createAlert(
      device.patientId,
      'new_alert_type',
      'high',
      `Alert message`
    );
  }
};
```

2. **Create Alert Rule for it**:
```javascript
// Frontend or API call
await alertAPI.createAlertRule({
  metricType: 'newMetric',
  minThreshold: 0,
  maxThreshold: 100
});
```

### Modifying User Profile Fields

1. **Update Prisma Schema**:
```prisma
model PatientProfile {
  // ... existing fields
  newField String? // New field
}
```

2. **Run Migration**:
```bash
npx prisma migrate dev --name add_new_field
```

3. **Update Controller**:
```javascript
// Accept newField in request
const { newField, ... } = req.body;
```

4. **Update Frontend Form**:
```javascript
<input 
  value={formData.newField}
  onChange={(e) => setFormData({...formData, newField: e.target.value})}
/>
```

---

## Debugging

### Backend Debugging

**View Logs**:
```bash
# Terminal will show logs as requests come in
npm run dev
```

**Use Prisma Studio**:
```bash
npx prisma studio
# Opens at http://localhost:5555
```

**Test API Endpoints**:
```bash
# Using curl
curl -X GET http://localhost:5000/api/health

# Using Postman or Thunder Client
# Set Authorization header with token
```

### Frontend Debugging

**Browser DevTools**:
- Press F12 or Ctrl+Shift+I
- Check Console tab for errors
- Check Network tab for API calls

**React Developer Tools**:
- Install React DevTools browser extension
- Inspect component state and props

**Check API Calls**:
```javascript
// In API service
apiClient.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    throw error;
  }
);
```

---

## Performance Optimization

### Backend

1. **Add Database Indexes** (already done for key fields):
```prisma
@@index([patientId])
@@index([timestamp])
```

2. **Implement Pagination**:
```javascript
const limit = 20;
const skip = (page - 1) * limit;
const data = await prisma.alert.findMany({ skip, take: limit });
```

3. **Cache Frequently Accessed Data**:
```javascript
const cache = {};
// Store and retrieve cached data
```

### Frontend

1. **Code Splitting**:
```javascript
import { lazy, Suspense } from 'react';
const DoctorDashboard = lazy(() => import('./DoctorDashboard'));

<Suspense fallback={<Loading />}>
  <DoctorDashboard />
</Suspense>
```

2. **Memoization**:
```javascript
const MemoizedComponent = React.memo(Component);
```

3. **Optimize Images and Assets**:
```javascript
// Use next-image or similar for optimization
```

---

## Deployment Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Security**: Use strong JWT secrets, enable HTTPS
3. **Database**: Migrate to PostgreSQL for production
4. **Logging**: Set up proper logging system
5. **Error Handling**: Implement error tracking (Sentry, etc.)
6. **Testing**: Add unit and integration tests
7. **Documentation**: Keep API docs updated

---

## Useful Resources

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Docs](https://react.dev/)
- [Socket.io Docs](https://socket.io/docs/)
- [JWT Docs](https://jwt.io/)

---

**Happy developing! 🚀**
