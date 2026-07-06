// services/subject.service.js
// Business logic for the Subject module. Reuses the same subjects.json
// catalog that the Dashboard module reads from (services/dashboard.service.js),
// so progress data always stays consistent between the two.

const { readJson } = require('../utils/jsonDb');

const mapSubjectForStudent = (subject, studentId) => {
  const studentProgress = subject.progressByStudent[studentId] || {
    progress: 0,
    completedChapters: 0,
  };

  return {
    id: subject.id,
    name: subject.name,
    description: subject.description,
    image: subject.image,
    totalChapters: subject.totalChapters,
    progress: studentProgress.progress,
    completedChapters: studentProgress.completedChapters,
  };
};

// GET /api/subjects — full catalog, each annotated with this student's progress
const getAllSubjects = (studentId) => {
  const subjects = readJson('subjects.json');
  return subjects.map((subject) => mapSubjectForStudent(subject, studentId));
};

// GET /api/subjects/:id — single subject, or null if it doesn't exist
const getSubjectById = (subjectId, studentId) => {
  const subjects = readJson('subjects.json');
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) return null;
  return mapSubjectForStudent(subject, studentId);
};

module.exports = { getAllSubjects, getSubjectById };
