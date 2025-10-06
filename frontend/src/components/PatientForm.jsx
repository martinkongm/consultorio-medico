// components/PatientForm.jsx
import { FormField } from "./FormField";

export function PatientForm({ form, errors, editId, firstInputRef, onSubmit, onCancel, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-8">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        {editId ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <FormField
          label="Nombre completo"
          error={errors.name}
          inputRef={firstInputRef}
        >
          <input
            ref={firstInputRef}
            className={`border p-2 rounded w-full ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </FormField>

        <FormField label="DNI del paciente" error={errors.dni}>
          <input
            className={`border p-2 rounded w-full ${
              errors.dni ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="DNI"
            value={form.dni}
            onChange={(e) => handleChange('dni', e.target.value)}
          />
        </FormField>

        <FormField label="Fecha de nacimiento">
          <input
            className="border p-2 rounded w-full"
            type="date"
            value={form.birthdate}
            onChange={(e) => handleChange('birthdate', e.target.value)}
          />
        </FormField>

        <FormField label="Teléfono del paciente" error={errors.phone}>
          <input
            className={`border p-2 rounded w-full ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </FormField>

        <FormField label="Sexo" error={errors.gender}>
          <select
            className={`border p-2 rounded w-full ${
              errors.gender ? 'border-red-500' : 'border-gray-300'
            }`}
            value={form.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            {!editId && <option value="" disabled>Selecciona una opción</option>}
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Domicilio">
            <input
              className="border p-2 rounded w-full"
              placeholder="Dirección del paciente"
              value={form.domicilio}
              onChange={(e) => handleChange('domicilio', e.target.value)}
            />
          </FormField>
        </div>

        <div className="flex gap-2 items-start md:col-span-5">
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
      </div>
    </div>
  );
}