// services/subject.service.js
import api from './api';

const getSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data.data;
};

const getSubjectById = async (id) => {
  const response = await api.get(`/subjects/${id}`);
  return response.data.data;
};

export const subjectService = { getSubjects, getSubjectById };
