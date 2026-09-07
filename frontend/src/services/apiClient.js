import axios from 'axios';
import { API_BASE_URL } from './config';

// Instancia única de axios: centraliza baseURL y futuros interceptores.
const api = axios.create({ baseURL: API_BASE_URL });

// Extrae el mensaje legible de un error de la API (DRY para hooks/páginas).
export function getApiErrorMessage(err, fallback = 'Ocurrió un error inesperado') {
  const data = err?.response?.data;
  return data?.details || data?.error || err?.message || fallback;
}

export default api;
