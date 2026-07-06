// components/DashboardCard.jsx
// Generic stat tile used in the Quick Statistics grid. Kept generic (icon +
// label + value + accent color) so it's reusable for any future stat.

export default function DashboardCard({ icon, label, value, accent = 'brand' }) {
  const accentClasses = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white rounded-xl card-shadow p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${accentClasses[accent] || accentClasses.brand}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-xs text-slate-500 truncate">{label}</p>
      </div>
    </div>
  );
}
