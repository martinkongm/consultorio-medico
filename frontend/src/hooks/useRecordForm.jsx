// hooks/useRecordForm.js
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/records';

const INITIAL_FORM_STATE = {
  patient_id: '',
  date: '',
  diagnosis: '',
  treatment: '',
  antecedentes: '',
  motivo_consulta: '',
  examen_clinico: '',
  examen_laboratorio: '',
  temperatura: '',
  frecuencia_respiratoria: '',
  pulso: '',
  spo2: '',
};

export function useRecordForm(records, patients, fetchRecords, formRef) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!form.patient_id) newErrors.patient_id = 'Selecciona un paciente.';
    if (!form.date) newErrors.date = 'La fecha es obligatoria.';
    if (!form.diagnosis) newErrors.diagnosis = 'El diagnóstico es obligatorio.';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
      } else {
        await axios.post(API_URL, form);
      }

      resetForm();
      await fetchRecords();
    } catch (err) {
      console.error('Error al guardar historia clínica:', err.response?.data || err.message);
      alert('No se pudo guardar la historia clínica. Revisa los campos o intenta más tarde.');
    }
  };

  const handleEdit = (record) => {
    setForm({
      patient_id: Number(record.patient_id),
      date: record.date,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      antecedentes: record.antecedentes || '',
      motivo_consulta: record.motivo_consulta || '',
      examen_clinico: record.examen_clinico || '',
      examen_laboratorio: record.examen_laboratorio || '',
      temperatura: record.temperatura || '',
      frecuencia_respiratoria: record.frecuencia_respiratoria || '',
      pulso: record.pulso || '',
      spo2: record.spo2 || '',
    });
    setEditId(record.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(INITIAL_FORM_STATE);
    setEditId(null);
    setErrors({});
    localStorage.removeItem('lastSelectedPatientId');
    localStorage.removeItem('lastSelectedRecordId');
  };

  return { form, errors, editId, setForm, handleSubmit, handleEdit, resetForm };
}