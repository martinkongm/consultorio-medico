// Configuración central de las URLs de la API.
// Se puede sobrescribir en tiempo de build con variables de entorno Vite.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const FILES_BASE_URL =
  import.meta.env.VITE_FILES_URL || 'http://localhost:3001/uploads';

export function getFileUrl(filepath) {
  return `${FILES_BASE_URL}/${filepath}`;
}
