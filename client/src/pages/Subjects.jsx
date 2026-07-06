// pages/Subjects.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';

import { subjectService } from '../services/subject.service';
import Loader from '../components/Loader';
import SubjectCard from '../components/SubjectCard';

export default function Subjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchSubjects = async () => {
      try {
        const data = await subjectService.getSubjects();
        if (isMounted) setSubjects(data);
      } catch {
        if (isMounted) setError('Could not load subjects. Please try refreshing.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <Loader fullScreen label="Loading subjects..." />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="flex items-center gap-2">
        <FiBookOpen className="text-brand-600" size={22} />
        <h1 className="text-2xl font-bold text-slate-800">My Subjects</h1>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      {!error && subjects.length === 0 && (
        <p className="text-sm text-slate-400 py-10 text-center">No subjects available yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onContinue={(s) => navigate(`/subjects/${s.id}`)}
          />
        ))}
      </div>
    </main>
  );
}
