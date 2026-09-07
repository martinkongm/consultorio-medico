// components/Modal.jsx
import { useEffect } from 'react';

// Modal base con overlay transparente, cierre con Escape o clic fuera, y
// scroll vertical completo cuando el contenido supera la altura de pantalla.
export default function Modal({
  open,
  onClose,
  maxWidth = 'max-w-2xl',
  children,
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-transparent backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`bg-white rounded-lg border border-gray-300 shadow-xl w-full ${maxWidth} relative my-4`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
