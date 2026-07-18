import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from './middleware/mongoSanitize.js';
import mongoose from 'mongoose';

// Import local configs, routes, and middlewares
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables from .env
dotenv.config();

/**
 * checkRequiredEnvVars
 * Validates that all required environment variables are set before startup.
 * Prevents booting in misconfigured production containers.
 */
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`CRITICAL CONFIGURATION ERROR: The following required environment variables are missing: ${missing.join(', ')}`);
    process.exit(1);
  }
};

// Run environment configurations check first
checkRequiredEnvVars();

const app = express();

// Set HTTP Security headers using helmet
app.use(helmet());

// MongoDB NoSQL Injection Protection
app.use(mongoSanitize());

// Logger configuration depending on environment
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Whitelisted CORS restrictions configurations
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'https://your-app.vercel.app'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or local testing tools)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Two-Tier rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs on auth routes
  message: 'Too many auth attempts.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply limiters to relevant route domains
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Body parsing parser middleware with request size limit (10kb)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
  });
});

// Map routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Catch-all route for missing endpoints
app.use((req, res, next) => {
  const error = new Error(`Cannot find requested path: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global central error handler middleware (must be registered last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database first, then bind listener
let server;
connectDB().then(() => {
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
});

/**
 * handleGracefulShutdown
 * Shuts down HTTP listeners and mongoose connections cleanly before exiting.
 */
const handleGracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Server shutting down gracefully...`);
  
  if (server) {
    server.close(() => {
      console.log('HTTP Server closed.');
      mongoose.connection.close(false).then(() => {
        console.log('MongoDB connection disconnected.');
        process.exit(0);
      }).catch((err) => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      });
    });
  } else {
    process.exit(0);
  }
};

// Graceful shutdown signals capture listeners
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
