// components/Loader.jsx
// Reusable loading spinner. `fullScreen` centers it in the viewport for
// route-level loading states (e.g. while the initial auth check runs).

export default function Loader({ fullScreen = false, label = 'Loading...' }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      {label && <p className="text-sm text-slate-500">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
}
