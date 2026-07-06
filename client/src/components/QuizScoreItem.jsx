// components/QuizScoreItem.jsx

const getScoreColor = (percent) => {
  if (percent >= 80) return 'text-green-600 bg-green-50';
  if (percent >= 60) return 'text-brand-600 bg-brand-50';
  if (percent >= 40) return 'text-amber-600 bg-amber-50';
  return 'text-red-600 bg-red-50';
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function QuizScoreItem({ quiz }) {
  const percent = Math.round((quiz.score / quiz.totalMarks) * 100);

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{quiz.topic}</p>
        <p className="text-xs text-slate-400">
          {quiz.subject} · {formatDate(quiz.date)}
        </p>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${getScoreColor(percent)}`}>
        {quiz.score}/{quiz.totalMarks}
      </span>
    </div>
  );
}
