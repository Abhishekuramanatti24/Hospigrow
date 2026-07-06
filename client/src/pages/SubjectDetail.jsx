// pages/SubjectDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiLayers } from 'react-icons/fi';

import { subjectService } from '../services/subject.service';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import ProgressBar from '../components/ProgressBar';

const SUBJECT_COLORS = {
  Anatomy: 'bg-rose-50 text-rose-500',
  Physiology: 'bg-brand-50 text-brand-600',
  Biochemistry: 'bg-accent-50 text-accent-600',
  Microbiology: 'bg-amber-50 text-amber-600',
};

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    const fetchSubject = async () => {
      try {
        const data = await subjectService.getSubjectById(id);
        if (isMounted) setSubject(data);
      } catch (err) {
        if (isMounted) {
          if (err?.response?.status === 404) {
            setNotFound(true);
          } else {
            showToast('Could not load this subject. Please try again.', 'error');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSubject();
    return () => {
      isMounted = false;
    };
  }, [id, showToast]);

  if (loading) {
    return <Loader fullScreen label="Loading subject..." />;
  }

  if (notFound || !subject) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-slate-500 mb-4">This subject could not be found.</p>
        <Link
          to="/subjects"
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
        >
          <FiArrowLeft size={16} />
          Back to Subjects
        </Link>
      </main>
    );
  }

  const colorClass = SUBJECT_COLORS[subject.name] || 'bg-slate-100 text-slate-500';

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <button
        onClick={() => navigate('/subjects')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <FiArrowLeft size={16} />
        Back to Subjects
      </button>

      {/* Subject header */}
      <div className="bg-white rounded-xl card-shadow p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
            <FiBookOpen size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-800">{subject.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{subject.description}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <ProgressBar percent={subject.progress} />
          </div>
          <p className="text-sm text-slate-500 sm:text-right">
            <span className="font-semibold text-slate-800">{subject.completedChapters}</span> /{' '}
            {subject.totalChapters} chapters completed
          </p>
        </div>
      </div>

      {/* Chapters placeholder — built in the next step */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FiLayers className="text-brand-600" size={18} />
          <h2 className="text-sm font-semibold text-slate-700">Chapters</h2>
        </div>
        <div className="bg-white rounded-xl card-shadow p-10 text-center">
          <p className="text-sm text-slate-400">
            The Chapter Module is coming in the next step — this is where {subject.name}'s
            chapters will appear, each opening into its Topics.
          </p>
        </div>
      </div>
    </main>
  );
}
