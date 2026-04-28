# Medico - Setup and Installation Guide

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation Steps

### Step 1: Quick Installation (Windows)

Run this in the project root directory:

```bash
install-deps.bat
```

This will automatically install all dependencies for the entire project.

### Step 2: Start the Application (Windows)

Run this in the project root directory:

```bash
run-app.bat
```

The script will:
- Install any missing dependencies
- Set up the Prisma database
- Start the backend server (http://localhost:5000)
- Start the frontend server (http://localhost:3000)

Both servers will open in separate terminal windows.

---

## Manual Installation (If Batch Scripts Don't Work)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create and migrate database
npx prisma migrate dev --name init

# Seed test data (optional)
node prisma/seed.js

# Start backend
npm run dev
```

Backend will be available at: **http://localhost:5000**

### Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend will be available at: **http://localhost:3000**

---

## Step 3: Access the Application

Once both servers are running:

1. Open your browser and go to: **http://localhost:3000**
2. Login with one of the test accounts:

**Doctor Account:**
- Email: `doctor@medico.com`
- Password: `Test@123`

**Patient Account:**
- Email: `patient@medico.com`
- Password: `Test@123`

**Relative Account:**
- Email: `relative@medico.com`
- Password: `Test@123`

---

## Testing the Application

### 1. Login as a Patient
- Navigate to the Patient Dashboard
- Register a new health device
- View alerts and device data

### 2. Submit Device Data (using curl or Postman)

First, get your auth token by logging in, then:

```bash
# Record device data
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

### 3. View Alerts
- Log in as a Patient to see alerts
- Log in as a Doctor to view patient alerts
- Log in as a Relative to see alerts for connected patients

---

## Troubleshooting

### Issue: "npm is not recognized"
**Solution**: Reinstall Node.js or add npm to your PATH environment variable.

### Issue: Port 3000 or 5000 already in use

**For Backend (Change PORT in backend/.env):**
```
PORT=5001
```

**For Frontend (Run with different port):**
```bash
cd frontend
set PORT=3001
npm start
```

### Issue: Database error when starting
```bash
cd backend
npx prisma migrate reset
```

### Issue: "Cannot find module" errors
```bash
# Clear everything and reinstall
cd backend
rm -r node_modules package-lock.json
npm install

cd ../frontend
rm -r node_modules package-lock.json
npm install
```

### Issue: WebSocket connection failed
- Check that backend is running on http://localhost:5000
- Verify CORS_ORIGIN is set correctly in backend/.env
- Check browser console for specific errors

---

## Environment Variables

### Backend (.env file)
Create or modify `backend/.env`:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRE="7d"
NODE_ENV="development"
PORT=5000
CORS_ORIGIN="http://localhost:3000"
```

### Frontend (.env file)
Create or modify `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Database Management

### View Database in Prisma Studio
```bash
cd backend
npx prisma studio
```

This opens a visual database browser at http://localhost:5555

### Reset Database
```bash
cd backend
npx prisma migrate reset
```

This will delete all data and recreate the database.

### Run Migrations
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

---

## Project Scripts

### Backend Scripts
```bash
npm run dev      # Start development server with hot reload
npm start        # Start production server
npm run build    # Build for production
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio
```

### Frontend Scripts
```bash
npm start   # Start development server
npm run build  # Build for production
npm test    # Run tests
```

---

## Next Steps

1. **Customize Database Schema**: Modify `backend/prisma/schema.prisma`
2. **Add New API Routes**: Create files in `backend/src/routes/`
3. **Create New Components**: Add React components in `frontend/src/components/`
4. **Configure Authentication**: Modify JWT settings in `backend/src/config/env.js`
5. **Deploy**: Use services like Vercel (frontend) and Heroku/Railway (backend)

---

## Need Help?

- Check the main [README.md](./README.md) for more details
- Review API endpoints in the documentation
- Check browser DevTools console for errors
- Look at server logs for debugging information

---

**Happy coding! 🏥**
