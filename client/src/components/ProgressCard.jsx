// components/ProgressCard.jsx
// Displays overall course progress as a large circular ring plus a short
// breakdown line. Used on the Dashboard; general enough to reuse elsewhere.

export default function ProgressCard({ percent = 0, stats }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const ringColor =
    clamped >= 80 ? '#22c55e' : clamped >= 40 ? '#14b8a6' : '#f59e0b';

  return (
    <div className="bg-white rounded-xl card-shadow p-6 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Overall Progress</h3>
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#eef2f6" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">{clamped}%</span>
          </div>
        </div>
        {stats && (
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">{stats.completedTopics}</span>
              <span className="text-slate-400"> / {stats.totalTopics} topics</span>
            </p>
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">{stats.completedChapters}</span>
              <span className="text-slate-400"> / {stats.totalChapters} chapters</span>
            </p>
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">{stats.completedSubjects}</span>
              <span className="text-slate-400"> / {stats.totalSubjects} subjects</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
