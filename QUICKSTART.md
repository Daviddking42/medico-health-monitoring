# 🚀 Quick Start Guide

## 30-Second Setup

### Windows Users

1. **Double-click** `install-deps.bat` (only needed first time)
2. **Double-click** `run-app.bat`
3. Open http://localhost:3000

Done! ✅

### Mac/Linux Users

1. Run: `chmod +x run-app.sh && ./run-app.sh`
2. Open http://localhost:3000

Done! ✅

---

## Default Test Accounts

After running the app, use these to login:

| Role | Email | Password |
|------|-------|----------|
| 👨‍⚕️ Doctor | `doctor@medico.com` | `Test@123` |
| 👤 Patient | `patient@medico.com` | `Test@123` |
| 👨‍👩‍👧 Relative | `relative@medico.com` | `Test@123` |

---

## What's Included

✅ **Backend** - Node.js + Express + WebSocket
✅ **Frontend** - React with 3 role-based dashboards
✅ **Database** - Prisma ORM with SQLite
✅ **Authentication** - JWT tokens
✅ **Real-time** - Socket.io for live updates
✅ **Device API** - Register devices & send health data
✅ **Alerts** - Automatic alerts for abnormal readings
✅ **Geolocation** - Track patient location

---

## Quick Test

After logging in as a Patient:

1. Go to "Your Health Devices" section
2. Click "Add Device"
3. Enter any device ID and name
4. Device appears in the dashboard

### Send Test Data

```bash
# Get your token from login response, then:
curl -X POST http://localhost:5000/api/devices/data \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": 1,
    "temperature": 38.5,
    "heartRate": 95,
    "spO2": 96,
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

Data appears instantly on the dashboard! 🎉

---

## Project Files Map

```
📁 medico/
 ├── 📄 run-app.bat          ← Run this to start
 ├── 📄 install-deps.bat     ← Run once for setup
 ├── 📄 README.md            ← Full documentation
 ├── 📄 SETUP.md             ← Detailed setup guide
 ├── 📄 API.md               ← API documentation
 ├── 📄 DEVELOPMENT.md       ← Development guide
 ├── 📁 backend/             ← Node.js server
 ├── 📁 frontend/            ← React app
 └── 📄 package.json         ← Root config
```

---

## Common Issues & Fixes

### "Port already in use"
Edit `backend/.env`:
```
PORT=5001
```

### "npm not found"
Install Node.js: https://nodejs.org/

### "Database error"
```bash
cd backend
npx prisma migrate reset
```

### Still not working?
See **SETUP.md** for detailed troubleshooting

---

## Next Steps

1. ✅ Run the app
2. ✅ Test with demo accounts
3. ✅ Create your own account
4. ✅ Register a device
5. ✅ Send test data
6. ✅ Check notifications
7. 📖 Read API.md for full capabilities
8. 🛠️ Read DEVELOPMENT.md to customize

---

## Features to Try

### As a Patient 👤
- Register health devices
- View real-time data
- See alerts
- Manage alert rules
- Add relatives

### As a Doctor 👨‍⚕️
- View assigned patients
- Monitor patient data
- Receive critical alerts
- Access medical history

### As a Relative 👨‍👩‍👧
- See patient alerts
- View patient location
- Get health updates

---

## Need Help?

- **Setup Issues**: See `SETUP.md`
- **API Questions**: See `API.md`
- **Custom Development**: See `DEVELOPMENT.md`
- **Full Details**: See `README.md`

---

## Technology Stack

- **Frontend**: React.js + React Router + Axios
- **Backend**: Node.js + Express.js
- **Database**: Prisma ORM + SQLite
- **Real-time**: Socket.io WebSocket
- **Auth**: JWT tokens + bcryptjs
- **Styles**: CSS3 with Flexbox/Grid

---

## Project Status

✅ Complete with:
- Monorepo structure
- Full RBAC system
- Database with relations
- API with 20+ endpoints
- Real-time WebSocket
- 3 role dashboards
- Alert system
- Geolocation support
- Batch startup scripts

🎉 **Ready to use!**

---

**Questions? See the docs or modify the code to fit your needs.**

**Happy monitoring! 🏥**
