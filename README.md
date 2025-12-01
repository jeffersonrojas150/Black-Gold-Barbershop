# 🖤✨ Black Gold Barbershop

Premium barbershop reservation platform with role-based authentication system.

## 🚀 Tech Stack

**Backend:**
- Express.js
- MySQL (Railway)
- JWT Authentication
- bcryptjs

**Frontend:**
- Next.js 15
- React
- Tailwind CSS
- TypeScript

## 👥 User Roles

- **Admin**: Full system management
- **Barber**: View and manage assigned appointments
- **Client**: Book appointments and manage reservations

## 🎯 Features

- ✅ User authentication and authorization
- ✅ Service management
- ✅ Barber scheduling system
- ✅ Appointment booking with availability checking
- ✅ 48-hour cancellation policy
- ✅ Admin dashboard with statistics

## 🛠️ Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure your database credentials
npm run migrate
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Database Schema

- users (admin, barber, client roles)
- services
- barbers
- barber_schedules
- appointments

## 🎨 Design

Elegant and premium black & gold theme.

---

Developed by Jefferson Rojas and Yudith Pacco - Tecsup Peru