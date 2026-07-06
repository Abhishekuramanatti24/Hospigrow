// components/ToastContainer.jsx
// Renders active toasts fixed to the top-right of the screen. Mounted once
// in App.jsx so any page can trigger a toast via useToast().

import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

const ICONS = {
  success: <FiCheckCircle className="text-green-500" size={20} />,
  error: <FiXCircle className="text-red-500" size={20} />,
  info: <FiInfo className="text-accent-600" size={20} />,
};

const BORDER_COLORS = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  info: 'border-l-accent-500',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[90vw] max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 bg-white rounded-lg card-shadow border-l-4 ${
            BORDER_COLORS[toast.type] || BORDER_COLORS.info
          } p-4 animate-[fadeIn_0.2s_ease-out]`}
          role="alert"
        >
          <div className="mt-0.5 shrink-0">{ICONS[toast.type] || ICONS.info}</div>
          <p className="text-sm text-slate-700 flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 shrink-0"
            aria-label="Dismiss notification"
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
