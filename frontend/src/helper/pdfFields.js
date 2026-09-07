import { tiempoEnfermedadText } from '../utils/tiempo';
import { examenClinicoRows } from '../utils/examenClinico';

// Metadatos compartidos de una historia clínica para generar PDFs.
// Centralizarlos evita que los exportadores se desincronicen (DRY).
export const RECORD_FIELDS = [
  { key: 'motivo_consulta', label: 'Motivo de consulta' },
  {
    label: 'Tiempo de enfermedad',
    getValue: (record) => tiempoEnfermedadText(record),
  },
  { key: 'antecedentes', label: 'Antecedentes' },
  {
    label: 'Examen clínico',
    getRows: (record) => examenClinicoRows(record),
  },
  { key: 'diagnosis', label: 'Diagnóstico' },
  { key: 'treatment', label: 'Tratamiento' },
  { key: 'examen_laboratorio', label: 'Examen laboratorio' },
  { key: 'weight', label: 'Peso (kg)', unit: ' kg' },
  { key: 'temperatura', label: 'Temperatura (°C)', unit: ' °C' },
  {
    key: 'frecuencia_respiratoria',
    label: 'Frecuencia respiratoria (FR)',
    unit: ' rpm',
  },
  { key: 'pulso', label: 'Pulso', unit: ' lpm' },
  { key: 'spo2', label: 'Saturación de oxígeno', unit: ' %' },
];

function cleanValue(value, unit = '') {
  if (value === null || value === undefined || value === '') {
    return 'No registrado';
  }
  return `${value}${unit}`;
}

function valueFor(record, field) {
  if (field.getValue) return field.getValue(record);
  return cleanValue(record[field.key], field.unit);
}

// Devuelve filas [label, texto] listas para imprimir en el PDF.
export function buildRecordRows(record) {
  return RECORD_FIELDS.flatMap((field) => {
    if (field.getRows) return field.getRows(record);
    return [[field.label, valueFor(record, field)]];
  });
}
