// components/ToastProvider.jsx
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { registerToastHandler } from '../utils/toast';

const TYPE_CONFIG = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />,
    border: 'border-green-200',
  },
  error: {
    icon: <XCircle className="h-5 w-5 text-red-600 shrink-0" />,
    border: 'border-red-200',
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
    border: 'border-blue-200',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    border: 'border-amber-200',
  },
};

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  useEffect(() => {
    const push = (type, message, duration = 4000) => {
      const id = ++idCounter.current;
      setToasts((prev) => [...prev, { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    };

    return registerToastHandler(push);
  }, []);

  return (
    <>
      {children}
      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 px-4 pointer-events-none w-full max-w-md"
        role="status"
        aria-live="polite"
      >
        {toasts.map(({ id, type, message }) => {
          const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
          return (
            <div
              key={id}
              className={`flex items-start gap-2.5 bg-white border rounded-lg px-4 py-2.5 text-sm text-gray-700 shadow-lg pointer-events-auto toast-animate ${config.border}`}
            >
              {config.icon}
              <span className="leading-snug">{message}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
