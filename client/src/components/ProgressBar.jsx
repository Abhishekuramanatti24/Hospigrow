// components/ProgressBar.jsx
// Reusable progress bar. Color shifts from amber (early) to brand teal
// (well underway) to green (near/at completion) so progress feels tangible
// at a glance, not just a percentage number.

const getColorClass = (percent) => {
  if (percent >= 80) return 'bg-green-500';
  if (percent >= 40) return 'bg-brand-500';
  if (percent > 0) return 'bg-amber-500';
  return 'bg-slate-300';
};

export default function ProgressBar({ percent = 0, showLabel = true, size = 'md' }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} ${getColorClass(clamped)} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-medium text-slate-600">{clamped}%</span>
        </div>
      )}
    </div>
  );
}
