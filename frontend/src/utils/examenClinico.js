// Regiones del examen clínico (campos TEXT). El campo "examen_clinico"
// original queda como legacy para historias anteriores a esta división.
export const EXAMEN_REGIONS = [
  { field: 'examen_orofaringe', label: 'Orofaringe' },
  { field: 'examen_pulmones', label: 'Pulmones' },
  { field: 'examen_cardiovascular', label: 'Cardiovascular' },
  { field: 'examen_abdomen', label: 'Abdomen' },
  { field: 'examen_genitourinario', label: 'Genitourinario' },
  { field: 'examen_neurologico', label: 'Neurológico' },
  { field: 'examen_otros', label: 'Otros' },
];

function hasContent(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function hasAnyRegion(record) {
  return EXAMEN_REGIONS.some(({ field }) => hasContent(record[field]));
}

export function hasRegionContent(record = {}) {
  return hasAnyRegion(record);
}

// Devuelve filas [label, texto] del examen clínico de una historia.
// Si la historia ya tiene regiones, devuelve solo las completadas.
// Si es una historia antigua (solo examen_clinico), la muestra tal cual.
// Si no hay nada, devuelve una única fila "No registrado".
export function examenClinicoRows(record = {}) {
  if (hasAnyRegion(record)) {
    return EXAMEN_REGIONS.filter(({ field }) => hasContent(record[field])).map(
      ({ field, label }) => [label, record[field]]
    );
  }

  if (hasContent(record.examen_clinico)) {
    return [['Examen clínico', record.examen_clinico]];
  }

  return [['Examen clínico', 'No registrado']];
}
