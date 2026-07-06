// components/SubjectCard.jsx
import { FiBookOpen, FiChevronRight } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

const SUBJECT_COLORS = {
  Anatomy: 'bg-rose-50 text-rose-500',
  Physiology: 'bg-brand-50 text-brand-600',
  Biochemistry: 'bg-accent-50 text-accent-600',
  Microbiology: 'bg-amber-50 text-amber-600',
};

export default function SubjectCard({ subject, onContinue }) {
  const colorClass = SUBJECT_COLORS[subject.name] || 'bg-slate-100 text-slate-500';

  return (
    <div className="bg-white rounded-xl card-shadow p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
          <FiBookOpen size={20} />
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-800 truncate">{subject.name}</h4>
          <p className="text-xs text-slate-400">
            {subject.completedChapters}/{subject.totalChapters} chapters completed
          </p>
        </div>
      </div>

      <ProgressBar percent={subject.progress} size="sm" />

      <button
        onClick={() => onContinue?.(subject)}
        className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg py-2 transition"
      >
        Continue
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}
