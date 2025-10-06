// hooks/usePatientForm.js
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/patients';

const INITIAL_FORM_STATE = {
  name: '',
  dni: '',
  birthdate: '',
  gender: '',
  phone: '',
  edad: '',
  domicilio: '',
};

export function usePatientForm(patients, fetchPatients) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

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

    // Check for duplicate DNI
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
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      resetForm();
      await fetchPatients();
    } catch (err) {
      console.error('Error del servidor:', err.response?.data || err.message);
      alert(
        err.response?.data?.details || 'Ocurrió un error al guardar el paciente.'
      );
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setEditId(null);
    setErrors({});
  };

  return {
    form,
    errors,
    editId,
    setForm,
    setEditId,
    handleSubmit,
    resetForm,
  };
}