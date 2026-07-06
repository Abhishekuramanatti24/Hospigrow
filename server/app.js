// app.js
// Configures the Express application: middleware, routes, and error handling.
// This file does NOT start the server (see server.js) — keeping them separate
// makes the app testable (supertest can import `app` without binding a port).

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config/config');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ---------- Global Middleware ----------
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ---------- Health Check ----------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Learning Dashboard API is running',
    timestamp: new Date().toISOString(),
  });
});

// ---------- API Routes ----------
app.use('/api', require('./routes/auth.routes'));
app.use('/api', require('./routes/dashboard.routes'));
app.use('/api', require('./routes/subject.routes'));
// Further routes (chapters, topics, search) will be mounted here as each
// module is built.

// ---------- 404 + Error Handling (must be last) ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
