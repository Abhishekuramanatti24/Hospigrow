// components/AssignmentItem.jsx
import { FiCalendar } from 'react-icons/fi';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDaysRemaining = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function AssignmentItem({ assignment }) {
  const daysRemaining = getDaysRemaining(assignment.dueDate);
  const isUrgent = daysRemaining <= 2;

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{assignment.title}</p>
        <p className="text-xs text-slate-400">{assignment.subject}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <FiCalendar size={14} className={isUrgent ? 'text-red-500' : 'text-slate-400'} />
        <span className={`text-xs font-medium ${isUrgent ? 'text-red-500' : 'text-slate-500'}`}>
          {formatDate(assignment.dueDate)}
        </span>
      </div>
    </div>
  );
}
