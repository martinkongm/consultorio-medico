// Convierte un objeto de errores por campo en una lista legible de nombres,
// usando las etiquetas provistas (DRY para los resúmenes de validación).
export function fieldErrorNames(errors, labels) {
  return Object.keys(errors).map((field) => labels[field] || field);
}
