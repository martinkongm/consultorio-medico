// Canal imperativo para mostrar mensajes tipo "Message" de AntD sin contexto.
// ToastProvider registra un listener al montarse; cualquier módulo puede
// llamar a toast.success(...) / toast.error(...) desde fuera de React.

let handler = null;

export function registerToastHandler(fn) {
  handler = fn;
  return () => {
    if (handler === fn) handler = null;
  };
}

function emit(type, message, duration) {
  if (handler) handler(type, message, duration);
}

export const toast = {
  success: (message, duration) => emit('success', message, duration),
  error: (message, duration) => emit('error', message, duration),
  info: (message, duration) => emit('info', message, duration),
  warning: (message, duration) => emit('warning', message, duration),
};
