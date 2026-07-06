// controllers/auth.controller.js
// Thin controller layer: parses the request, calls the service layer,
// and formats the response. No business logic lives here.

const authService = require('../services/auth.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { ApiError, success } = require('../utils/apiResponse');

// POST /api/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = authService.findStudentByEmail(email);
  if (!student) {
    throw new ApiError(401, 'Invalid Credentials');
  }

  const isPasswordValid = await authService.verifyPassword(password, student.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid Credentials');
  }

  const token = authService.generateToken(student);
  const safeStudent = authService.sanitizeStudent(student);

  return success(res, 200, 'Login successful', {
    token,
    user: safeStudent,
  });
});

// POST /api/logout
// JWTs are stateless, so there is nothing to invalidate server-side without a
// token blacklist/store. The endpoint exists for API completeness and so the
// frontend has a clear, semantic call to make when the student logs out.
const logout = asyncHandler(async (req, res) => {
  return success(res, 200, 'Logged out successfully', null);
});

// GET /api/profile
// Requires the `protect` middleware to have run first, populating req.user.
const getProfile = asyncHandler(async (req, res) => {
  const student = authService.findStudentById(req.user.id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  const safeStudent = authService.sanitizeStudent(student);
  return success(res, 200, 'Profile fetched successfully', safeStudent);
});

module.exports = { login, logout, getProfile };
