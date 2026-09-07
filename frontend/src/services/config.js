// Configuración central de las URLs de la API.
// En producción la app se sirve desde el mismo origen que la API, por eso se
// usan rutas relativas. En desarrollo, Vite redirige "/api" y "/uploads"
// hacia el backend (ver vite.config.js). Se puede sobrescribir en tiempo de
// build con variables de entorno Vite (VITE_API_URL / VITE_FILES_URL).
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const FILES_BASE_URL = import.meta.env.VITE_FILES_URL || '/uploads';

export function getFileUrl(filepath) {
  return `${FILES_BASE_URL}/${filepath}`;
}
