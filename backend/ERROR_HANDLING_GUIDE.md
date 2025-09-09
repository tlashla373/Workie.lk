# Error Handling & Crash Prevention Guide

This document outlines the comprehensive error handling system implemented in the Workie.lk backend to prevent silent server crashes.

## 🛡️ Error Handling Features

### 1. **Global Error Handlers**

- **Unhandled Promise Rejections**: Catches and logs all unhandled promise rejections
- **Uncaught Exceptions**: Catches and logs uncaught exceptions before graceful shutdown
- **Process Signals**: Handles SIGTERM and SIGINT for graceful shutdowns

### 2. **Comprehensive Logging System**

- **Multi-level logging**: Error, Warn, Info, Debug levels
- **File-based logs**: Separate files for different log types
- **Request logging**: All HTTP requests are logged with context
- **Structured logging**: JSON format with metadata for better analysis

### 3. **Database Connection Monitoring**

- **Connection events**: Monitors connect, disconnect, error, and reconnect events
- **Automatic reconnection**: Built-in MongoDB connection resilience
- **Health checks**: Database status included in health endpoint

### 4. **Memory Monitoring**

- **Memory usage tracking**: Monitors heap usage every minute
- **Memory leak detection**: Alerts when memory usage exceeds thresholds
- **Performance metrics**: Tracks uptime and system resources

### 5. **Request Context Tracking**

- **Request IDs**: Each request gets a unique ID for tracing
- **User context**: Authentication and authorization failures are logged with user context
- **Error boundaries**: Async operations are wrapped with error handlers

## 📁 Log Files

The system creates the following log files in the `logs/` directory:

- **`app.log`**: All application logs (info, warn, error, debug)
- **`error.log`**: Only error-level logs
- **`crashes.log`**: Crash-specific logs with detailed system information

## 🔧 Available Scripts

```bash
# Development with detailed logging
npm run dev

# Development with debug mode
npm run dev:debug

# Production mode
npm run prod

# View logs in real-time
npm run logs          # All logs
npm run logs:error    # Error logs only
npm run logs:crash    # Crash logs only

# Clean log files
npm run clean:logs

# Check server health
npm run health
```

## 🚨 What Gets Logged

### 1. **Authentication Failures**

- Missing tokens
- Invalid tokens
- Expired tokens
- User not found
- Account deactivation

### 2. **Authorization Failures**

- Insufficient permissions
- Resource ownership violations
- Role-based access denials

### 3. **Database Operations**

- Connection status changes
- Query failures
- Validation errors
- Duplicate key errors

### 4. **HTTP Requests**

- Request method, URL, IP address
- Response status and time
- User agent and user ID
- Request/response payloads (in development)

### 5. **Email Service**

- SMTP connection status
- Email sending success/failure
- Transporter configuration issues

### 6. **System Health**

- Memory usage warnings
- CPU usage (if monitored)
- Uptime statistics
- Process information

## 🔍 Monitoring & Debugging

### Health Check Endpoint

```
GET /api/health
```

Returns comprehensive server status including:

- Database connection status
- Memory usage
- Uptime
- Environment information

### Log Analysis

All logs are in JSON format for easy parsing:

```json
{
  "timestamp": "2025-09-09T10:30:00.000Z",
  "level": "error",
  "message": "Authentication failed: User not found",
  "tokenId": "user123",
  "ip": "192.168.1.1",
  "requestId": "req_1234567890",
  "pid": 1234,
  "memory": {
    "rss": 67108864,
    "heapTotal": 29360128,
    "heapUsed": 20123456
  }
}
```

## 🛠️ Error Prevention Best Practices

### 1. **Use Async Handlers**

All route handlers should use the `asyncHandler` wrapper:

```javascript
const { asyncHandler } = require("../middleware/asyncHandler");

router.get(
  "/endpoint",
  asyncHandler(async (req, res) => {
    // Your async code here
  })
);
```

### 2. **Proper Error Propagation**

Always pass errors to the next middleware:

```javascript
try {
  // Some operation
} catch (error) {
  logger.error("Operation failed", { error: error.message });
  next(error); // Important: pass to error handler
}
```

### 3. **Database Query Safety**

Always handle database connection issues:

```javascript
try {
  const result = await Model.findById(id);
  if (!result) {
    return res.status(404).json({ message: "Not found" });
  }
} catch (error) {
  logger.error("Database query failed", { error: error.message, id });
  next(error);
}
```

## 🔄 Crash Recovery

### Automatic Restart (Recommended: PM2)

For production, use PM2 for automatic restarts:

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name "workie-backend"

# Monitor
pm2 monit

# View logs
pm2 logs workie-backend
```

### Manual Monitoring

The built-in crash detector will:

1. Log detailed crash information
2. Attempt graceful shutdown
3. Clean up resources
4. Exit with appropriate codes

## 📊 Performance Monitoring

### Memory Usage Alerts

The system monitors memory usage and will log warnings when:

- Heap usage exceeds 150MB
- Memory increases rapidly
- Potential memory leaks detected

### Response Time Tracking

All HTTP requests are timed and logged, allowing you to identify slow endpoints.

## 🚨 Emergency Procedures

### If Server Keeps Crashing:

1. **Check crash logs**:

   ```bash
   npm run logs:crash
   ```

2. **Check error logs**:

   ```bash
   npm run logs:error
   ```

3. **Check database connection**:

   ```bash
   npm run health
   ```

4. **Monitor memory usage**:
   Look for memory leak patterns in logs

5. **Enable debug mode**:
   ```bash
   npm run dev:debug
   ```

### Common Issues & Solutions:

- **Database Connection**: Check MongoDB URI and network connectivity
- **Memory Leaks**: Look for unclosed connections or growing arrays
- **Authentication Issues**: Check JWT secret and token expiration
- **Email Service**: Verify SMTP credentials and network access

## 🔧 Configuration

### Environment Variables

Ensure these are properly set:

- `NODE_ENV`: development/production
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Strong secret for token signing
- `EMAIL_USER`, `EMAIL_PASS`: SMTP credentials

### Log Levels

Adjust logging verbosity by setting `NODE_ENV`:

- `development`: All logs including debug
- `production`: Info, warn, error only

## 📈 Metrics & Analytics

The logging system captures metrics that can be used for:

- Performance analysis
- Error rate monitoring
- User behavior tracking
- System health dashboards

Consider integrating with monitoring services like:

- New Relic
- DataDog
- Sentry
- CloudWatch (AWS)

This error handling system provides comprehensive coverage to prevent silent crashes and maintain system stability.
