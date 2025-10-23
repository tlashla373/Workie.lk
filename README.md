# 🚀 Workie.lk

[Visit Workie.lk](https://workie-lk.vercel.app/)


A comprehensive job marketplace platform connecting employers with skilled workers in Sri Lanka.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### For Workers
- 📝 Professional profile creation
- 💼 Job search and filtering
- 📱 Real-time notifications
- ⭐ Reviews and ratings system
- 📊 Application tracking
- 💬 Direct communication with employers

### For Employers
- 📢 Post job opportunities
- 🔍 Search and filter workers
- 📋 Application management
- ⭐ Rate and review workers
- 📊 Analytics dashboard

### Platform Features
- 🔐 Secure authentication (JWT + Google OAuth)
- 🖼️ Image upload and optimization (Cloudinary)
- 📧 Email notifications
- 💬 Real-time chat and notifications (Socket.IO)
- 📱 Responsive design (Mobile-first)
- 🌙 Dark mode support
- 🔒 Admin panel for moderation
- 📊 Analytics and reporting
- 🛡️ Security features (Helmet, rate limiting)

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM v7
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Icons:** Lucide React, React Icons
- **Real-time:** Socket.IO Client

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcrypt.js, Google OAuth
- **File Upload:** Multer, Cloudinary
- **Email:** Nodemailer
- **Real-time:** Socket.IO
- **Security:** Helmet, CORS, Express Rate Limit
- **Compression:** Compression middleware

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Gmail account (for email service)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tlashla373/workie.lk.git
   cd workie.lk
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Run setup script
   # Windows:
   ..\setup-deployment.bat
   
   # Linux/Mac:
   chmod +x ../setup-deployment.sh
   ../setup-deployment.sh
   ```

4. **Configure environment files**
   
   Edit `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/workie_db
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:5173
   ```

   Edit `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## 🌐 Deployment

### Quick Deploy (Recommended)

This project is configured for deployment on:
- **Backend:** Railway
- **Frontend:** Vercel

### Deployment Guides

📚 **Complete Documentation:**
- 📘 [**DEPLOYMENT_GUIDE.md**](./DEPLOYMENT_GUIDE.md) - Comprehensive step-by-step guide
- ✅ [**DEPLOYMENT_CHECKLIST.md**](./DEPLOYMENT_CHECKLIST.md) - Quick checklist
- 💻 [**DEPLOYMENT_COMMANDS.md**](./DEPLOYMENT_COMMANDS.md) - Useful commands
- 📊 [**DEPLOYMENT_SUMMARY.md**](./DEPLOYMENT_SUMMARY.md) - Overview and architecture

### Quick Start Deployment

1. **Set up accounts:**
   - Railway: https://railway.app
   - Vercel: https://vercel.com
   - MongoDB Atlas: https://www.mongodb.com/cloud/atlas
   - Cloudinary: https://cloudinary.com

2. **Deploy Backend to Railway:**
   - Connect GitHub repository
   - Set root directory to `backend`
   - Add environment variables
   - Deploy and get URL

3. **Deploy Frontend to Vercel:**
   - Connect GitHub repository
   - Set root directory to `frontend`
   - Add environment variables with Railway URL
   - Deploy and get URL

4. **Update Backend:**
   - Add Vercel URL to Railway's `FRONTEND_URL`
   - Redeploy

**For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

## 📁 Project Structure

```
Workie.lk/
├── backend/
│   ├── config/           # Configuration files (Cloudinary, etc.)
│   ├── middleware/       # Express middleware (auth, error handling)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic (notifications, socket)
│   ├── utils/            # Utility functions
│   ├── server.js         # Express server entry point
│   ├── package.json      # Backend dependencies
│   └── railway.json      # Railway configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main App component
│   │   └── main.jsx      # React entry point
│   ├── public/           # Static assets
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js    # Vite configuration
│   └── vercel.json       # Vercel configuration
│
├── DEPLOYMENT_GUIDE.md        # Complete deployment guide
├── DEPLOYMENT_CHECKLIST.md    # Quick checklist
├── DEPLOYMENT_COMMANDS.md     # Useful commands
├── DEPLOYMENT_SUMMARY.md      # Overview
└── README.md                  # This file
```

## 🔐 Environment Variables

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` or `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing key | Random 32+ chars |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-secret` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `your@gmail.com` |
| `EMAIL_PASSWORD` | Email password | Gmail app password |
| `FRONTEND_URL` | Frontend URL | `https://your-app.vercel.app` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-api.railway.app/api` |
| `VITE_SOCKET_URL` | Socket.IO URL | `https://your-api.railway.app` |

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend linting
cd frontend
npm run lint
```

## 📊 Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run prod       # Start production server explicitly
npm test           # Run tests
npm run logs       # View application logs
npm run clean:logs # Clear all logs
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

**Workie.lk Team**

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check existing documentation in `/docs`

## 🙏 Acknowledgments

- React and Vite teams for excellent tools
- Express.js community
- MongoDB Atlas for database hosting
- Railway and Vercel for deployment platforms
- Cloudinary for media management
- All contributors and users

---

**Made with ❤️ in Sri Lanka**

🚀 [Live Demo](#) | 📖 [Documentation](./DEPLOYMENT_GUIDE.md) | 🐛 [Report Bug](https://github.com/tlashla373/workie.lk/issues)
