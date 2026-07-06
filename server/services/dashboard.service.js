// services/dashboard.service.js
// Aggregates data from multiple JSON "tables" into the single payload the
// Dashboard page needs. Keeping this assembly logic here (not in the
// controller) means it's reusable and independently testable.

const { readJson } = require('../utils/jsonDb');

const MAX_RECENT_SUBJECTS = 4;
const MAX_UPCOMING_ASSIGNMENTS = 4;
const MAX_RECENT_QUIZ_SCORES = 4;

const getRecentSubjects = (studentId) => {
  const subjects = readJson('subjects.json');
  return subjects
    .map((subject) => {
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
    })
    .sort((a, b) => b.progress - a.progress)
    .slice(0, MAX_RECENT_SUBJECTS);
};

const getUpcomingAssignments = (studentId) => {
  const assignments = readJson('assignments.json');
  return assignments
    .filter((a) => a.studentId === studentId && a.status === 'pending')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, MAX_UPCOMING_ASSIGNMENTS);
};

const getRecentQuizScores = (studentId) => {
  const quizScores = readJson('quizScores.json');
  return quizScores
    .filter((q) => q.studentId === studentId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, MAX_RECENT_QUIZ_SCORES);
};

const getDashboardSummary = (studentId) => {
  const dashboardRecords = readJson('dashboard.json');
  return dashboardRecords.find((d) => d.studentId === studentId) || null;
};

const getDashboardData = (studentId) => {
  const summary = getDashboardSummary(studentId);

  return {
    continueLearning: summary?.continueLearning || null,
    overallProgress: summary?.overallProgress ?? 0,
    quickStats: summary?.quickStats || {
      completedTopics: 0,
      totalTopics: 0,
      completedChapters: 0,
      totalChapters: 0,
      completedSubjects: 0,
      totalSubjects: 0,
      studyStreakDays: 0,
    },
    recentSubjects: getRecentSubjects(studentId),
    upcomingAssignments: getUpcomingAssignments(studentId),
    recentQuizScores: getRecentQuizScores(studentId),
  };
};

module.exports = { getDashboardData };
