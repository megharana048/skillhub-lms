# SkillHub LMS

Complete MERN Learning Management System with Student, Instructor and Admin roles.

## Quick start

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

### Frontend
Open another terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000  
Health check: http://localhost:5000/api/health

## Demo accounts after `npm run seed`

- Student: `student@skillhub.com` / `Password123`
- Instructor: `instructor@skillhub.com` / `Password123`
- Admin: `admin@skillhub.com` / `Password123`

## Main features

- JWT login and registration
- bcrypt password hashing
- Role-based protected routes
- Course search, filter, details and pagination
- Instructor create, edit, publish and delete courses
- Student enrollment and progress tracking
- Admin statistics, user blocking and course management
- Multer + Cloudinary upload endpoint
- Responsive React and Tailwind CSS interface

## Deployment

- Frontend: Vercel, root directory `frontend`
- Backend: Render/Railway, root directory `backend`
- Database: MongoDB Atlas
- Add environment variables from `.env.example`
