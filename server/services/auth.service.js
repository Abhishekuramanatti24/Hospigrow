// services/auth.service.js
// Business logic for authentication. Controllers stay thin and delegate here.

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const { readJson } = require('../utils/jsonDb');

// Find a student record by email (case-insensitive)
const findStudentByEmail = (email) => {
  const students = readJson('students.json');
  return students.find(
    (s) => s.email.toLowerCase() === String(email).toLowerCase()
  );
};

// Find a student record by id
const findStudentById = (id) => {
  const students = readJson('students.json');
  return students.find((s) => s.id === id);
};

// Remove sensitive fields before sending a student object to the client
const sanitizeStudent = (student) => {
  if (!student) return null;
  const { password, ...safeStudent } = student;
  return safeStudent;
};

// Compare a plaintext password against the stored bcrypt hash
const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

// Generate a signed JWT for an authenticated student
const generateToken = (student) => {
  const payload = {
    id: student.id,
    email: student.email,
    name: student.name,
  };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

module.exports = {
  findStudentByEmail,
  findStudentById,
  sanitizeStudent,
  verifyPassword,
  generateToken,
};
