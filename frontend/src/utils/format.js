// Convierte "YYYY-MM-DD" a "DD/MM/YYYY".
export function formatDate(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

// Muestra un valor opcional de forma amigable para la UI.
export function displayInfo(value, unit = '') {
  if (value === null || value === undefined || value === '') {
    return 'No registrado';
  }
  return unit ? `${value} ${unit}` : value;
}

// Normaliza texto para búsquedas insensibles a mayúsculas y tildes
// ("César" coincide al buscar "cesar").
export function normalizeForSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
