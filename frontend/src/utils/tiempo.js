// Unidades admitidas para el campo "Tiempo de enfermedad".
export const TIEMPO_ENFERMEDAD_UNITS = [
  { value: 'dias', label: 'Días', singular: 'día', plural: 'días' },
  { value: 'semanas', label: 'Semanas', singular: 'semana', plural: 'semanas' },
  { value: 'meses', label: 'Meses', singular: 'mes', plural: 'meses' },
];

const UNIT_MAP = Object.fromEntries(
  TIEMPO_ENFERMEDAD_UNITS.map((u) => [u.value, u])
);

// Devuelve el texto legible de una historia: "3 semanas", "No precisado", etc.
export function tiempoEnfermedadText(record = {}) {
  if (record.tiempo_enfermedad_no_precisa) {
    return 'No precisado';
  }

  const cantidad = record.tiempo_enfermedad;
  if (cantidad === null || cantidad === undefined || cantidad === '') {
    return 'No registrado';
  }

  const unit = UNIT_MAP[record.tiempo_enfermedad_unidad];
  const word =
    Number(cantidad) === 1 && unit
      ? unit.singular
      : unit?.plural || record.tiempo_enfermedad_unidad || '';

  return `${cantidad} ${word}`.trim();
}
