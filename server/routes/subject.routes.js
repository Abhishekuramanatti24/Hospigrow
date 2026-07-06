// routes/subject.routes.js
const express = require('express');
const router = express.Router();

const { getSubjects, getSubjectById } = require('../controllers/subject.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/subjects', protect, getSubjects);
router.get('/subjects/:id', protect, getSubjectById);

module.exports = router;
