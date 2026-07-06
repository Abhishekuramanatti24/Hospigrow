// routes/AppRoutes.jsx
// Centralizes all route definitions. All authenticated pages render inside
// MainLayout (shared header/nav), which itself renders inside ProtectedRoute
// (auth guard) — so the nesting is: auth guard -> shared shell -> page.

import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Subjects from '../pages/Subjects';
import SubjectDetail from '../pages/SubjectDetail';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:id" element={<SubjectDetail />} />
          {/* Chapters, Topics, Learning Unit, Profile, etc. will be added
              here as protected routes in later steps. */}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
