// components/RecordForm.jsx
import { forwardRef } from 'react';
import Select from 'react-select';

export const RecordForm = forwardRef(({ form, errors, editId, patients, selectedPatient, onSubmit, onCancel, onChange }, ref) => {
  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.dni})`,
  }));

  const handleChange = (field, value) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <div ref={ref} className="bg-white p-6 rounded shadow mb-10">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">
        {editId ? 'Editar Historia Clínica' : 'Registrar Nueva Historia Clínica'}
      </h3>
      
      {selectedPatient && (
        <p className="text-sm text-gray-600 mb-4">
          Registrando historia para: <strong>{selectedPatient.name}</strong> (DNI: {selectedPatient.dni})
        </p>
      )}

      <PatientDataFieldset
        form={form}
        errors={errors}
        patientOptions={patientOptions}
        onPatientChange={(option) => {
          const id = option?.value || '';
          handleChange('patient_id', Number(id));
          if (id) localStorage.setItem('lastSelectedPatientId', id);
        }}
        onDateChange={(value) => handleChange('date', value)}
      />

      <VitalSignsFieldset
        form={form}
        onChange={handleChange}
      />

      <ClinicalInfoFieldset
        form={form}
        errors={errors}
        onChange={handleChange}
      />

      <FormActions editId={editId} onSubmit={onSubmit} onCancel={onCancel} />
    </div>
  );
});

RecordForm.displayName = 'RecordForm';
export default RecordForm;

// Sub-components
function PatientDataFieldset({ form, errors, patientOptions, onPatientChange, onDateChange }) {
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
            value={patientOptions.find((opt) => opt.value === Number(form.patient_id)) || null}
            classNamePrefix={errors.patient_id ? 'react-select-error' : 'react-select'}
          />
          {errors.patient_id && (
            <p className="text-red-500 text-sm mt-1">{errors.patient_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha de consulta</label>
          <input
            type="date"
            className={`border p-2 rounded w-full ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
            value={form.date}
            onChange={(e) => onDateChange(e.target.value)}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
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

function ClinicalInfoFieldset({ form, errors, onChange }) {
  const clinicalFields = [
    { field: 'motivo_consulta', label: 'Motivo de consulta' },
    { field: 'antecedentes', label: 'Antecedentes personales/familiares' },
    { field: 'examen_clinico', label: 'Examen clínico' },
    { field: 'diagnosis', label: 'Diagnóstico', hasError: true },
    { field: 'treatment', label: 'Tratamiento' },
    { field: 'examen_laboratorio', label: 'Examen de laboratorio' },
  ];

  return (
    <fieldset className="border border-gray-200 rounded p-4 mb-6">
      <legend className="text-sm font-semibold text-gray-600 px-2">
        Información Clínica
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clinicalFields.map(({ field, label, hasError }) => (
          <div key={field} className={field === 'examen_laboratorio' ? 'md:col-span-1' : ''}>
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
        ))}
      </div>
    </fieldset>
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