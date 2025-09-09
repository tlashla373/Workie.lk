const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import utilities
const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const crashDetector = require('./utils/crashDetector');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profiles');
const reviewRoutes = require('./routes/reviews');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const mediaRoutes = require('./routes/media');
const connectionRoutes = require('./routes/connections');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Global error handlers for unhandled promises and exceptions
process.on('unhandledRejection', (reason, promise) => {
  logger.logCrash(new Error(`Unhandled Rejection: ${reason}`), 'unhandledRejection');
  logger.error('Unhandled Rejection detected', {
    reason: reason.toString(),
    promise: promise.toString(),
    stack: reason.stack
  });
  
  // Close server gracefully
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  logger.logCrash(err, 'uncaughtException');
  logger.error('Uncaught Exception detected', {
    error: err.message,
    stack: err.stack
  });
  
  // Exit immediately on uncaught exceptions
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      logger.info('Process terminated gracefully');
      process.exit(0);
    });
  }
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      logger.info('Process terminated gracefully');
      process.exit(0);
    });
  }
});

// Monitor memory usage
setInterval(() => {
  const memUsage = process.memoryUsage();
  const threshold = 150 * 1024 * 1024; // 150MB threshold
  
  if (memUsage.heapUsed > threshold) {
    logger.warn('High memory usage detected', {
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
      rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    });
  }
}, 60000); // Check every minute

// Security middleware
app.use(helmet());
app.use(compression());

// Request logging (should be early in middleware stack)
app.use(requestLogger);

// Rate limiting - More lenient in development
const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'development' ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // 1000 requests in dev, 100 in prod
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: process.env.NODE_ENV === 'development' ? '1 minute' : '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks and OPTIONS requests in development
    if (process.env.NODE_ENV === 'development' && 
        (req.url === '/api/health' || req.method === 'OPTIONS')) {
      return true;
    }
    return false;
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5174', // Vite dev server alternative port
    'http://localhost:3000'  // Allow React dev server port too
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Additional CORS headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    logger.debug('CORS preflight request handled', {
      origin: req.headers.origin,
      method: req.method,
      url: req.url,
      requestId: req.requestId
    });
    res.status(200).end();
    return;
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with comprehensive error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workie_db', {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  heartbeatFrequencyMS: 2000,     // Check every 2 seconds
  maxPoolSize: 10,                // Connection pool size
  minPoolSize: 1,                 // Minimum connections
  maxIdleTimeMS: 30000,          // Close connections after 30 seconds of inactivity
})
.then(() => {
  logger.info('MongoDB connected successfully', {
    uri: process.env.MONGODB_URI ? 'Remote MongoDB' : 'Local MongoDB',
    database: 'workie_db'
  });
})
.catch(err => {
  logger.error('MongoDB connection failed', {
    error: err.message,
    stack: err.stack,
    uri: process.env.MONGODB_URI ? 'Remote MongoDB' : 'Local MongoDB'
  });
  process.exit(1); // Exit if can't connect to database
});

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB runtime error', {
    error: err.message,
    stack: err.stack
  });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Handle MongoDB connection errors during runtime
mongoose.connection.on('close', () => {
  logger.warn('MongoDB connection closed');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint with comprehensive status
app.get('/api/health', (req, res) => {
  const healthStatus = {
    status: 'OK',
    message: 'Workie.lk API is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    memory: {
      used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
    },
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  };

  // Return 503 if database is not connected
  const statusCode = mongoose.connection.readyState === 1 ? 200 : 503;
  
  logger.debug('Health check requested', healthStatus);
  res.status(statusCode).json(healthStatus);
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server with error handling
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    pid: process.pid
  });
  
  // Log additional startup info
  logger.info('Server configuration', {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173'
    },
    database: process.env.MONGODB_URI ? 'Remote MongoDB' : 'Local MongoDB',
    features: ['Authentication', 'File Upload', 'Email Service', 'Rate Limiting']
  });

  // Start crash detection monitoring
  crashDetector.startMonitoring();
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use`, {
      error: err.message,
      port: PORT,
      suggestion: 'Try a different port or kill the process using this port'
    });
  } else {
    logger.error('Server error', {
      error: err.message,
      stack: err.stack,
      code: err.code
    });
  }
  process.exit(1);
});

// Handle server timeout
server.timeout = 120000; // 2 minutes timeout

module.exports = { app, server };
