// components/ContinueLearningCard.jsx
import { FiPlayCircle, FiArrowRight } from 'react-icons/fi';
import ProgressBar from './ProgressBar';

export default function ContinueLearningCard({ data, onContinue }) {
  if (!data) {
    return (
      <div className="bg-white rounded-xl card-shadow p-6 h-full flex flex-col items-center justify-center text-center">
        <FiPlayCircle className="text-slate-300 mb-2" size={32} />
        <p className="text-sm text-slate-500">No topic in progress yet. Start learning to see it here!</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-6 h-full flex flex-col justify-between text-white shadow-md">
      <div>
        <p className="text-xs uppercase tracking-wide text-brand-100 font-medium mb-2">
          Continue Learning
        </p>
        <h3 className="text-lg font-bold leading-snug">{data.topicName}</h3>
        <p className="text-sm text-brand-100 mt-1">
          {data.subjectName} · {data.chapterName}
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-3">
          <div className="w-full bg-white/25 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-white rounded-full transition-all duration-500"
              style={{ width: `${data.progress}%` }}
            />
          </div>
          <p className="text-xs text-brand-100 mt-1">{data.progress}% complete</p>
        </div>
        <button
          onClick={() => onContinue?.(data)}
          className="flex items-center gap-2 bg-white text-brand-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-brand-50 transition"
        >
          Resume Topic
          <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
