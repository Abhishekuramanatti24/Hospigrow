// routes/auth.routes.js
const express = require('express');
const router = express.Router();

const { login, logout, getProfile } = require('../controllers/auth.controller');
const { validateLogin } = require('../middleware/validators/authValidator');
const { protect } = require('../middleware/auth.middleware');

// Public
router.post('/login', validateLogin, login);

// Protected (logout still requires a valid token — you can't log out of a
// session you were never authenticated into)
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);

module.exports = router;
