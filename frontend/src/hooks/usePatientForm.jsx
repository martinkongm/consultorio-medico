// hooks/usePatientForm.js
import { useState } from 'react';
import patientService from '../services/patientService';
import { getApiErrorMessage } from '../services/apiClient';
import { toast } from '../utils/toast';
import { fieldErrorNames } from '../utils/validation';

const INITIAL_FORM_STATE = {
  name: '',
  dni: '',
  birthdate: '',
  gender: '',
  phone: '',
  domicilio: '',
};

const FIELD_LABELS = {
  name: 'Nombre',
  dni: 'DNI',
  gender: 'Sexo',
  phone: 'Teléfono',
};

export function usePatientForm(patients, fetchPatients) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name) {
      newErrors.name = 'El nombre es obligatorio.';
    }

    if (form.dni && !/^\d{8}$/.test(form.dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos.';
    }

    if (!form.gender) {
      newErrors.gender = 'Selecciona un sexo válido.';
    }

    // Al crear, el DNI no debe pertenecer a otro paciente ya registrado.
    const duplicate = patients.find(
      (p) => p.dni && p.dni === form.dni && p.id !== editId
    );

    if (!editId && duplicate) {
      newErrors.dni = 'Este DNI ya está registrado.';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const missing = fieldErrorNames(validationErrors, FIELD_LABELS).join(', ');
      toast.error(`Faltan campos por completar o corregir: ${missing}`);
      return;
    }

    try {
      setSaving(true);
      if (editId) {
        await patientService.update(editId, form);
      } else {
        await patientService.create(form);
      }

      resetForm();
      await fetchPatients();
      toast.success('Paciente guardado correctamente.');
    } catch (err) {
      console.error('Error del servidor:', err.response?.data || err.message);
      toast.error(
        getApiErrorMessage(err, 'Ocurrió un error al guardar el paciente.')
      );
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setEditId(null);
    setErrors({});
    localStorage.removeItem('editingPatientId');
  };

  return {
    form,
    errors,
    editId,
    saving,
    setForm,
    setEditId,
    handleSubmit,
    resetForm,
  };
}
