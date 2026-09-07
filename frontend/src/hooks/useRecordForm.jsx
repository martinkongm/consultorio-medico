// hooks/useRecordForm.js
import { useState } from 'react';
import recordService from '../services/recordService';
import { getApiErrorMessage } from '../services/apiClient';
import { toast } from '../utils/toast';
import { fieldErrorNames } from '../utils/validation';

const INITIAL_FORM_STATE = {
  patient_id: '',
  date: '',
  weight: '',
  diagnosis: '',
  treatment: '',
  antecedentes: '',
  motivo_consulta: '',
  examen_laboratorio: '',
  examen_orofaringe: '',
  examen_pulmones: '',
  examen_cardiovascular: '',
  examen_abdomen: '',
  examen_genitourinario: '',
  examen_neurologico: '',
  examen_otros: '',
  tiempo_enfermedad: '',
  tiempo_enfermedad_unidad: '',
  tiempo_enfermedad_no_precisa: false,
  temperatura: '',
  frecuencia_respiratoria: '',
  pulso: '',
  spo2: '',
};

const FIELD_LABELS = {
  patient_id: 'Paciente',
  date: 'Fecha de consulta',
  diagnosis: 'Diagnóstico',
  weight: 'Peso',
  tiempo_enfermedad: 'Cantidad de tiempo de enfermedad',
  tiempo_enfermedad_unidad: 'Unidad de tiempo de enfermedad',
};

export function useRecordForm(records, patients, fetchRecords, formRef) {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.patient_id) newErrors.patient_id = 'Selecciona un paciente.';
    if (!form.date) newErrors.date = 'La fecha es obligatoria.';
    if (!form.diagnosis) newErrors.diagnosis = 'El diagnóstico es obligatorio.';

    if (form.weight) {
      if (Number.isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
        newErrors.weight = 'El peso debe ser un número mayor a 0.';
      }
    }

    // Tiempo de enfermedad: coherente solo si no está marcado "no precisa".
    if (!form.tiempo_enfermedad_no_precisa) {
      const cantidad = form.tiempo_enfermedad;
      const hasCantidad = cantidad !== '' && cantidad !== null && cantidad !== undefined;
      const hasUnidad = Boolean(form.tiempo_enfermedad_unidad);

      if (hasCantidad) {
        const numero = Number(cantidad);
        if (!Number.isInteger(numero) || numero <= 0) {
          newErrors.tiempo_enfermedad =
            'Ingresa un número entero mayor a 0.';
        } else if (!hasUnidad) {
          newErrors.tiempo_enfermedad_unidad =
            'Selecciona la unidad (días, semanas o meses).';
        }
      } else if (hasUnidad) {
        newErrors.tiempo_enfermedad = 'Indica la cantidad.';
      }
    }

    return newErrors;
  };

  // Deja la historia lista para la API: numéricos a number y si el doctor
  // marcó "no puede precisarlo", descarta cantidad/unidad.
  const buildPayload = () => {
    const noPrecisa = Boolean(form.tiempo_enfermedad_no_precisa);
    const payload = { ...form };

    payload.tiempo_enfermedad = noPrecisa
      ? null
      : form.tiempo_enfermedad
        ? Number(form.tiempo_enfermedad)
        : null;
    payload.tiempo_enfermedad_unidad = noPrecisa
      ? null
      : form.tiempo_enfermedad_unidad || null;
    payload.tiempo_enfermedad_no_precisa = noPrecisa ? 1 : 0;

    return payload;
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
      const payload = buildPayload();
      setSaving(true);
      if (editId) {
        await recordService.update(editId, payload);
      } else {
        await recordService.create(payload);
      }

      resetForm();
      await fetchRecords();
      toast.success('Historia clínica guardada correctamente.');
    } catch (err) {
      console.error('Error al guardar historia clínica:', err.response?.data || err.message);
      toast.error(
        getApiErrorMessage(
          err,
          'No se pudo guardar la historia clínica. Revisa los campos o intenta más tarde.'
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setForm({
      patient_id: Number(record.patient_id),
      date: record.date || '',
      weight: record.weight || '',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      antecedentes: record.antecedentes || '',
      motivo_consulta: record.motivo_consulta || '',
      examen_laboratorio: record.examen_laboratorio || '',
      examen_orofaringe: record.examen_orofaringe || '',
      examen_pulmones: record.examen_pulmones || '',
      examen_cardiovascular: record.examen_cardiovascular || '',
      examen_abdomen: record.examen_abdomen || '',
      examen_genitourinario: record.examen_genitourinario || '',
      examen_neurologico: record.examen_neurologico || '',
      examen_otros: record.examen_otros || '',
      tiempo_enfermedad: record.tiempo_enfermedad || '',
      tiempo_enfermedad_unidad: record.tiempo_enfermedad_unidad || '',
      tiempo_enfermedad_no_precisa: Boolean(record.tiempo_enfermedad_no_precisa),
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

  return {
    form,
    errors,
    editId,
    saving,
    setForm,
    handleSubmit,
    handleEdit,
    resetForm,
  };
}
