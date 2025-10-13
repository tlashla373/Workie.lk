# � Workie.lk - Professional Job Matching Platform

> **Last Updated**: October 13, 2025  
> **Version**: 2.0 (Post WhatsApp Migration)  
> **Status**: Active Development  
> **Branch**: malshan

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Core Features](#-core-features)
- [Recent Changes](#-recent-changes-whatsapp-migration)
- [Technical Stack](#-technical-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Development Roadmap](#-development-roadmap)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

**Workie.lk** is a modern job matching and professional networking platform designed specifically for Sri Lankan professionals. The platform connects job seekers (workers) with job providers (clients) across various service categories.

### **Key Value Propositions**

- 🔍 **Smart Job Matching**: AI-powered job recommendations based on skills and location
- 💬 **Seamless Communication**: WhatsApp integration for direct client-worker communication
- 🌟 **Professional Networking**: Build connections and showcase work portfolios
- ⭐ **Trust & Safety**: Comprehensive review and rating system
- 📱 **Mobile-First**: Responsive design optimized for mobile users

### **Target Market**

- **Primary**: Sri Lankan freelancers, service providers, and small business owners
- **Secondary**: International clients seeking Sri Lankan talent
- **Categories**: Carpentry, Plumbing, Electrical, Tutoring, Cleaning, Photography, and more

---

## 🏗️ Architecture

### **System Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • Vite Dev      │    │ • Express API   │    │ • MongoDB Atlas │
│ • Tailwind CSS  │    │ • Socket.IO     │    │ • Cloudinary    │
│ • React Router  │    │ • JWT Auth      │    │ • Gmail SMTP    │
│ • Context API   │    │ • Mongoose ODM  │    │ • WhatsApp Web  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Data Flow**

1. **User Interaction** → Frontend React Components
2. **API Requests** → Backend Express Routes
3. **Data Processing** → MongoDB Operations
4. **Real-time Updates** → Socket.IO Events
5. **External Communication** → WhatsApp Integration

---

## � Core Features

### **1. Authentication & User Management** ✅

- **Multi-role System**: Admin, Client, Worker
- **Registration Options**: Email signup + Google OAuth
- **Session Management**: JWT tokens with 30-day expiry
- **Role-based Access Control**: Protected routes and features
- **Admin Dashboard**: User management and analytics

### **2. Job Management System** ✅

- **Job Posting** (Clients)
  - Rich job descriptions with images
  - Budget specification (fixed/hourly/negotiable)
  - Location-based targeting
  - Skill requirements definition
- **Job Discovery** (Workers)
  - Advanced filtering (location, budget, category)
  - Smart recommendations
  - Application tracking
  - Saved jobs functionality

### **3. Professional Networking** ✅

- **Enhanced Profiles**
  - Portfolio galleries
  - Skill showcases
  - Work history timelines
  - Professional achievements
- **Connection System**
  - Send/receive connection requests
  - Professional network building
  - Friend discovery algorithms
- **Content Sharing**
  - Professional posts
  - Work updates
  - Project showcases

### **4. Communication System** 🔄 **[RECENTLY MIGRATED]**

- **WhatsApp Integration**
  - Direct click-to-chat from profiles
  - Pre-filled job inquiry messages
  - Phone number normalization
  - Cross-platform compatibility
- **Notification System**
  - Real-time notifications via Socket.IO
  - Email notifications for important events
  - In-app notification center

### **5. Review & Rating System** ✅

- **Bidirectional Reviews**: Clients ↔ Workers
- **Rating Categories**: Quality, Communication, Timeliness
- **Review Moderation**: Automated and manual filtering
- **Reputation Building**: Profile rating aggregation

### **6. Media & File Management** ✅

- **Cloudinary Integration**: Optimized image storage and delivery
- **Multi-format Support**: Images, documents, portfolios
- **Real-time Upload**: Progress tracking and error handling
- **Image Optimization**: Automatic compression and resizing

---

## 🔄 Recent Changes (WhatsApp Migration)

### **Migration Overview** (Completed: October 2025)

The platform underwent a major architectural change, migrating from a complex in-app chat system to WhatsApp integration.

### **What Was Removed** ❌

```javascript
// Backend Components Removed
- routes/chat.js (Chat API endpoints)
- models/Chat.js (Chat room schema)
- models/Message.js (Message schema)
- Socket.IO chat events (message sending/receiving)

// Frontend Components Removed
- pages/Chat/ (Chat interface pages)
- components/ChatUi/ (Chat UI components)
- hooks/useChat.js (Chat state management)
- Chat-related navigation links
```

### **What Was Added** ✅

```javascript
// New WhatsApp Integration
- utils/whatsapp.js (Phone normalization & URL building)
- WhatsApp buttons in profile components
- Click-to-chat functionality for job inquiries
- Pre-filled message templates
```

### **Migration Benefits**

- **🚀 Performance**: Reduced server load and database complexity
- **💰 Cost Efficiency**: No message storage or real-time sync overhead
- **📱 User Experience**: Familiar WhatsApp interface increases adoption
- **🔧 Maintenance**: Simplified codebase with fewer moving parts
- **🌍 Accessibility**: Works across all devices and platforms

---

## � Technical Stack

### **Frontend Technologies**

```javascript
{
  "framework": "React 18",
  "buildTool": "Vite",
  "styling": "Tailwind CSS",
  "routing": "React Router v6",
  "stateManagement": "Context API + useReducer",
  "httpClient": "Axios",
  "realTime": "Socket.IO Client",
  "icons": "Lucide React",
  "dateHandling": "Date-fns",
  "forms": "React Hook Form + Yup validation"
}
```

### **Backend Technologies**

```javascript
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "MongoDB Atlas",
  "odm": "Mongoose",
  "authentication": "JWT + bcryptjs",
  "fileUpload": "Multer + Cloudinary",
  "email": "Nodemailer (Gmail SMTP)",
  "realTime": "Socket.IO",
  "validation": "Joi",
  "logging": "Winston",
  "monitoring": "Custom crash detector"
}
```

### **External Services**

```javascript
{
  "database": "MongoDB Atlas (Cloud)",
  "fileStorage": "Cloudinary",
  "email": "Gmail SMTP",
  "communication": "WhatsApp Web API",
  "deployment": "TBD (Vercel/Netlify + Railway/Heroku)"
}
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for file storage
- Gmail account for email services

### **Installation Steps**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/tlashla373/Workie.lk.git
   cd Workie.lk
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Create .env file with required variables (see .env.example)
   cp .env.example .env

   # Start development server
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install

   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs (if configured)

### **Environment Configuration**

#### **Backend (.env)**

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workie

# Authentication
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=30d

# Email Service (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

#### **Frontend (.env)**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# WhatsApp Configuration
VITE_WHATSAPP_DEFAULT_COUNTRY_CODE=94
```

---

## 📁 Project Structure

### **Root Directory**

```
Workie.lk/
├── README.md                 # Project documentation
├── PROJECT_REPORT.md         # Detailed project report
├── package.json              # Root package configuration
├── backend/                  # Backend application
├── frontend/                 # Frontend application
└── docs/                     # Additional documentation (if any)
```

### **Backend Structure**

```
backend/
├── server.js                 # Application entry point
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables
├── config/
│   └── cloudinary.js         # Cloudinary configuration
├── middleware/
│   ├── auth.js               # JWT authentication
│   ├── validation.js         # Request validation
│   └── errorHandler.js       # Global error handling
├── models/
│   ├── User.js               # User schema
│   ├── Job.js                # Job schema
│   ├── Application.js        # Job application schema
│   ├── Post.js               # Social post schema
│   ├── Review.js             # Review/rating schema
│   └── Notification.js       # Notification schema
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── users.js              # User management routes
│   ├── jobs.js               # Job CRUD operations
│   ├── applications.js       # Job application routes
│   ├── posts.js              # Social posting routes
│   ├── reviews.js            # Review system routes
│   └── notifications.js      # Notification routes
├── services/
│   ├── notificationService.js # Notification logic
│   └── socketService.js      # Socket.IO events
└── utils/
    ├── emailService.js       # Email sending utilities
    ├── imageOptimizer.js     # Image processing
    └── logger.js             # Logging utilities
```

### **Frontend Structure**

```
frontend/
├── index.html                # Entry HTML file
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
├── src/
│   ├── main.jsx              # Application entry point
│   ├── App.jsx               # Root component
│   ├── components/           # Reusable UI components
│   │   ├── NavBar/           # Navigation components
│   │   ├── ui/               # Basic UI components
│   │   ├── UserProfile/      # Profile-related components
│   │   └── ProtectionPage/   # Authentication guards
│   ├── pages/                # Page components
│   │   ├── Authentication/   # Login/Register pages
│   │   ├── FindJobs/         # Job search pages
│   │   ├── JobPosting/       # Job creation pages
│   │   ├── Profile/          # User profile pages
│   │   └── HomePage/         # Dashboard pages
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.jsx   # Authentication state
│   │   ├── DarkModeContext.jsx # Theme management
│   │   └── NotificationContext.jsx # Notification state
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js        # Authentication logic
│   │   ├── useNotifications.js # Notification management
│   │   └── useConnections.js # Connection management
│   ├── services/             # API service layers
│   │   ├── apiService.js     # Base API client
│   │   ├── authService.js    # Authentication API
│   │   ├── jobService.js     # Job-related API
│   │   ├── profileService.js # Profile management API
│   │   └── socketService.js  # Socket.IO client
│   ├── utils/                # Utility functions
│   │   ├── api.js            # API helpers
│   │   ├── whatsapp.js       # WhatsApp integration
│   │   └── networkUtils.js   # Network utilities
│   └── config/               # Configuration files
│       ├── api.js            # API configuration
│       └── security.js       # Security settings
```

---

## 🗄️ Database Schema

### **Core Collections**

#### **Users Collection**

```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (unique, required),
  phone: String,
  password: String (hashed),
  role: ["worker", "client", "admin"],
  profilePicture: String (Cloudinary URL),
  isActive: Boolean (default: true),
  skills: [String],
  location: {
    city: String,
    state: String,
    coordinates: [Number] // [longitude, latitude]
  },
  rating: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### **Jobs Collection**

```javascript
{
  _id: ObjectId,
  title: String (required, max: 100),
  description: String (required, max: 2000),
  category: String (enum: categories),
  budget: {
    amount: Number (required, min: 0),
    currency: String (default: "LKR"),
    type: String (enum: ["fixed", "hourly", "negotiable"])
  },
  location: {
    address: String (required),
    city: String (required),
    state: String,
    coordinates: [Number]
  },
  client: ObjectId (ref: "User", required),
  requirements: [String],
  skills: [String],
  status: String (enum: ["open", "in-progress", "completed", "cancelled"]),
  urgency: String (enum: ["low", "medium", "high", "urgent"]),
  images: [{
    url: String,
    description: String,
    publicId: String,
    uploadedAt: Date
  }],
  applicationsCount: Number (default: 0),
  maxApplicants: Number (default: 50),
  isRemote: Boolean (default: false),
  experienceLevel: String (enum: ["beginner", "intermediate", "expert", "any"]),
  assignedWorker: ObjectId (ref: "User"),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Development Roadmap

### **Phase 1: Core Stabilization** (Current - October 2025)

- ✅ WhatsApp integration completion
- 🔄 Job details page optimization
- 🔄 User profile enhancement
- 🔄 Notification system refinement
- 📝 Comprehensive testing

### **Phase 2: Enhanced Features** (November 2025)

- 🔮 Advanced job matching algorithms
- 🔮 Push notifications (PWA)
- 🔮 Payment gateway integration
- 🔮 Advanced search and filters
- 🔮 Mobile app preparation

### **Phase 3: Scalability** (December 2025)

- 🔮 Performance optimization
- 🔮 CDN implementation
- 🔮 Database optimization
- 🔮 Load balancing setup
- 🔮 Monitoring and analytics

### **Phase 4: Advanced Features** (Q1 2026)

- 🔮 AI-powered job recommendations
- 🔮 Video interview integration
- 🔮 Blockchain-based reputation system
- 🔮 Multi-language support
- 🔮 Mobile application launch

---

## 🤝 Contributing

### **Development Workflow**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Standards**

- **Frontend**: ESLint + Prettier configuration
- **Backend**: Node.js best practices + JSDoc comments
- **Database**: Mongoose schema validation
- **Testing**: Jest + React Testing Library
- **Documentation**: Comprehensive README and inline comments

---

## 📞 Support & Contact

### **Development Team**

- **Project Lead**: Tlashla373
- **Repository**: https://github.com/tlashla373/Workie.lk
- **Branch**: malshan (active development)

### **Technical Support**

- **Issues**: GitHub Issues tab
- **Discussions**: GitHub Discussions
- **Email**: workielk@gmail.com (for business inquiries)

---

## 📜 License

This project is proprietary software. All rights reserved.

**Copyright © 2025 Workie.lk Team**

---

**Last Updated**: October 13, 2025  
**Document Version**: 2.0  
**Project Status**: Active Development 🚀
