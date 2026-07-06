// pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center bg-white rounded-2xl card-shadow p-10 max-w-md">
        <FiAlertTriangle className="mx-auto text-amber-500 mb-4" size={40} />
        <h1 className="text-3xl font-bold text-slate-800">404</h1>
        <p className="text-slate-500 mt-2">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-block mt-6 bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
