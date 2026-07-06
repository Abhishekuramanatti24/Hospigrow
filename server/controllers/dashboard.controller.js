// controllers/dashboard.controller.js
const dashboardService = require('../services/dashboard.service');
const authService = require('../services/auth.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { success } = require('../utils/apiResponse');

// GET /api/dashboard
// Requires `protect` middleware — req.user.id comes from the verified JWT.
const getDashboard = asyncHandler(async (req, res) => {
  const student = authService.findStudentById(req.user.id);
  const data = dashboardService.getDashboardData(req.user.id);

  return success(res, 200, 'Dashboard data fetched successfully', {
    studentName: student?.name || req.user.name,
    ...data,
  });
});

module.exports = { getDashboard };
