// controllers/subject.controller.js
const subjectService = require('../services/subject.service');
const { asyncHandler } = require('../middleware/errorHandler');
const { ApiError, success } = require('../utils/apiResponse');

// GET /api/subjects
const getSubjects = asyncHandler(async (req, res) => {
  const subjects = subjectService.getAllSubjects(req.user.id);
  return success(res, 200, 'Subjects fetched successfully', subjects);
});

// GET /api/subjects/:id
const getSubjectById = asyncHandler(async (req, res) => {
  const subject = subjectService.getSubjectById(req.params.id, req.user.id);
  if (!subject) {
    throw new ApiError(404, `Subject with id "${req.params.id}" was not found.`);
  }
  return success(res, 200, 'Subject fetched successfully', subject);
});

module.exports = { getSubjects, getSubjectById };
