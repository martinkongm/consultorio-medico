// Convierte un paciente de la API en el estado editable del formulario.
// Evita propagar campos calculados ("edad") u otros residuos al guardar.
export function patientToForm(patient) {
  return {
    name: patient.name || '',
    dni: patient.dni || '',
    birthdate: patient.birthdate || '',
    gender: patient.gender || '',
    phone: patient.phone || '',
    domicilio: patient.domicilio || '',
  };
}
