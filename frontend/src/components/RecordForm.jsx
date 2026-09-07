// components/RecordForm.jsx
import { forwardRef, useEffect, useRef } from 'react';
import Select from 'react-select';
import { calcularEdadExacta } from '../utils/age';
import { TIEMPO_ENFERMEDAD_UNITS } from '../utils/tiempo';
import { EXAMEN_REGIONS } from '../utils/examenClinico';

const EXAMEN_PLACEHOLDERS = {
  examen_orofaringe: 'Mucosas, faringe, amígdalas…',
  examen_pulmones: 'Campos pulmonares, ruidos respiratorios…',
  examen_cardiovascular: 'Ruidos cardíacos, pulsos…',
  examen_abdomen: 'Inspección, palpación, ruidos…',
  examen_genitourinario: 'Genitales, vía urinaria…',
  examen_neurologico: 'Pares craneales, reflejos, marcha…',
  examen_otros: 'Piel, extremidades, otros hallazgos…',
};

export const RecordForm = forwardRef(
  (
    { form, errors, editId, patients, selectedPatient, onSubmit, onCancel, onChange },
    ref
  ) => {
    const patientOptions = patients.map((p) => ({
      value: p.id,
      label: `${p.name} (${p.dni})`,
    }));

    const handleChange = (field, value) => {
      onChange({ ...form, [field]: value });
    };

    const ageText = selectedPatient?.birthdate
      ? calcularEdadExacta(selectedPatient.birthdate)
      : '';

    return (
      <div ref={ref} className="bg-white p-6 rounded shadow mb-10">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          {editId ? 'Editar Historia Clínica' : 'Registrar Nueva Historia Clínica'}
        </h3>

        {selectedPatient && (
          <p className="text-sm text-gray-600 mb-4">
            Registrando historia para: <strong>{selectedPatient.name}</strong>{' '}
            (DNI: {selectedPatient.dni})
          </p>
        )}

        <PatientDataFieldset
          form={form}
          errors={errors}
          ageText={ageText}
          patientOptions={patientOptions}
          onPatientChange={(option) => {
            const id = option?.value || '';
            handleChange('patient_id', Number(id));
            if (id) localStorage.setItem('lastSelectedPatientId', id);
          }}
          onDateChange={(value) => handleChange('date', value)}
          onWeightChange={(value) => handleChange('weight', value)}
        />

        <VitalSignsFieldset form={form} onChange={handleChange} />

        <ClinicalInfoFieldset form={form} errors={errors} onChange={handleChange} />

        <FormActions editId={editId} onSubmit={onSubmit} onCancel={onCancel} />
      </div>
    );
  }
);

RecordForm.displayName = 'RecordForm';
export default RecordForm;

// Sub-components
function PatientDataFieldset({
  form,
  errors,
  ageText,
  patientOptions,
  onPatientChange,
  onDateChange,
  onWeightChange,
}) {
  const inputClass = (hasError) =>
    `border p-2 rounded w-full ${hasError ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <fieldset className="border border-gray-200 rounded p-4 mb-6">
      <legend className="text-sm font-semibold text-gray-600 px-2">
        Datos del paciente
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Paciente</label>
          <Select
            options={patientOptions}
            placeholder="Selecciona un paciente"
            onChange={onPatientChange}
            value={
              patientOptions.find((opt) => opt.value === Number(form.patient_id)) ||
              null
            }
            classNamePrefix={errors.patient_id ? 'react-select-error' : 'react-select'}
          />
          {errors.patient_id && (
            <p className="text-red-500 text-sm mt-1">{errors.patient_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Fecha de consulta
          </label>
          <input
            type="date"
            className={inputClass(errors.date)}
            value={form.date}
            onChange={(e) => onDateChange(e.target.value)}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Edad</label>
          <input
            type="text"
            value={ageText}
            disabled
            className="border border-gray-300 p-2 rounded w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            placeholder="Se calcula al elegir paciente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            className={inputClass(errors.weight)}
            value={form.weight || ''}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="Ej. 70.5"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
          )}
        </div>
      </div>
    </fieldset>
  );
}

function VitalSignsFieldset({ form, onChange }) {
  const vitalSigns = [
    { field: 'temperatura', label: 'Temperatura (°C)', type: 'number', step: '0.1' },
    { field: 'frecuencia_respiratoria', label: 'Frecuencia respiratoria (FR)', type: 'number' },
    { field: 'pulso', label: 'Pulso', type: 'number' },
    { field: 'spo2', label: 'Saturación O₂ (SPO₂)', type: 'number' },
  ];

  return (
    <fieldset className="border border-gray-200 rounded p-4 mb-6">
      <legend className="text-sm font-semibold text-gray-600 px-2">
        Funciones Vitales
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vitalSigns.map(({ field, label, type, step }) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type={type}
              step={step}
              className="border p-2 rounded w-full"
              value={form[field]}
              onChange={(e) => onChange(field, e.target.value)}
            />
          </div>
        ))}
      </div>
    </fieldset>
  );
}

// Regiones del examen clínico, integradas dentro de "Información Clínica".
// Compacto: 3 columnas responsive y textareas que crecen solas; "Otros" a lo
// ancho al final.
function ExamenClinicoRegions({ form, onChange }) {
  return (
    <div className="border border-dashed border-gray-300 rounded p-3 mb-4 mt-4">
      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
        Examen clínico por regiones
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXAMEN_REGIONS.map(({ field, label }) => (
          <div
            key={field}
            className={
              field === 'examen_otros'
                ? 'md:col-span-2 lg:col-span-3'
                : ''
            }
          >
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {label}
            </label>
            <AutoGrowTextarea
              value={form[field] || ''}
              onChange={(e) => onChange(field, e.target.value)}
              placeholder={EXAMEN_PLACEHOLDERS[field]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Textarea que arranca en 2 líneas y se estira automáticamente al escribir.
function AutoGrowTextarea({ value, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 44)}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={2}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-gray-300 rounded px-2 py-1.5 w-full text-sm resize-none leading-snug focus:border-blue-500 focus:outline-none"
    />
  );
}

function ClinicalInfoFieldset({ form, errors, onChange }) {
  const clinicalTop = [
    { field: 'motivo_consulta', label: 'Motivo de consulta' },
    { field: 'antecedentes', label: 'Antecedentes personales/familiares' },
  ];

  const clinicalBottom = [
    { field: 'diagnosis', label: 'Diagnóstico', hasError: true },
    { field: 'treatment', label: 'Tratamiento' },
    { field: 'examen_laboratorio', label: 'Examen de laboratorio' },
  ];

  const renderTextareas = (fields) =>
    fields.map(({ field, label, hasError }) => (
      <div key={field}>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <textarea
          className={`border p-2 rounded w-full resize-y min-h-[80px] ${
            hasError && errors[field] ? 'border-red-500' : 'border-gray-300'
          }`}
          value={form[field]}
          onChange={(e) => onChange(field, e.target.value)}
        />
        {hasError && errors[field] && (
          <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        )}
      </div>
    ));

  return (
    <fieldset className="border border-gray-200 rounded p-4 mb-6">
      <legend className="text-sm font-semibold text-gray-600 px-2">
        Información Clínica
      </legend>

      <TiempoEnfermedadField form={form} errors={errors} onChange={onChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderTextareas(clinicalTop)}
      </div>

      <ExamenClinicoRegions form={form} onChange={onChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderTextareas(clinicalBottom)}
      </div>
    </fieldset>
  );
}

// Campo compuesto "Tiempo de enfermedad": cantidad + unidad + "no puede precisar".
function TiempoEnfermedadField({ form, errors, onChange }) {
  const noPrecisa = Boolean(form.tiempo_enfermedad_no_precisa);
  const disabledClass =
    'bg-gray-100 text-gray-400 cursor-not-allowed';
  const fieldError = errors.tiempo_enfermedad || errors.tiempo_enfermedad_unidad;

  return (
    <div
      className={`border rounded p-4 mb-6 ${
        fieldError
          ? 'border-red-300 bg-red-50/50'
          : 'border-dashed border-gray-300'
      }`}
    >
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">
          Tiempo de enfermedad
        </p>
        <span className="text-xs text-gray-400">
          Duración de la enfermedad actual
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <input
            type="number"
            min="1"
            step="1"
            disabled={noPrecisa}
            className={`border p-2 rounded w-28 ${
              errors.tiempo_enfermedad ? 'border-red-500' : 'border-gray-300'
            } ${noPrecisa ? disabledClass : ''}`}
            value={form.tiempo_enfermedad || ''}
            onChange={(e) => onChange('tiempo_enfermedad', e.target.value)}
            placeholder="Ej. 3"
            aria-label="Cantidad de tiempo de enfermedad"
          />
        </div>

        {/* Unidad (botones segmentados) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidad
          </label>
          <div
            className={`inline-flex rounded border overflow-hidden ${
              errors.tiempo_enfermedad_unidad
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
            role="group"
            aria-label="Unidad de tiempo"
          >
            {TIEMPO_ENFERMEDAD_UNITS.map((unit) => {
              const active = form.tiempo_enfermedad_unidad === unit.value;
              const className = noPrecisa
                ? disabledClass
                : active
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-white text-gray-700 hover:bg-blue-50';
              return (
                <button
                  key={unit.value}
                  type="button"
                  disabled={noPrecisa}
                  aria-pressed={active}
                  className={`px-3 py-1.5 text-sm transition ${className}`}
                  onClick={() =>
                    onChange(
                      'tiempo_enfermedad_unidad',
                      active ? '' : unit.value
                    )
                  }
                >
                  {unit.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* No puede precisar */}
        <label className="flex items-center gap-2 mb-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={noPrecisa}
            onChange={() =>
              onChange('tiempo_enfermedad_no_precisa', !noPrecisa)
            }
            className="h-4 w-4 accent-blue-600"
          />
          No puede precisarlo
        </label>
      </div>

      {fieldError && (
        <p className="text-red-500 text-sm mt-2">{fieldError}</p>
      )}
    </div>
  );
}

function FormActions({ editId, onSubmit, onCancel }) {
  return (
    <div className="flex gap-2 mt-4">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={onSubmit}
      >
        {editId ? 'Guardar' : 'Agregar'}
      </button>
      {editId && (
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          onClick={onCancel}
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
