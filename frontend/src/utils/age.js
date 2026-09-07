// Calcula la edad exacta (años, meses y días) a partir de una fecha
// de nacimiento en formato ISO (YYYY-MM-DD).
export function calcularEdadExacta(fechaNacimiento) {
  if (!fechaNacimiento) return '';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return '';

  let years = hoy.getFullYear() - nacimiento.getFullYear();
  let months = hoy.getMonth() - nacimiento.getMonth();
  let days = hoy.getDate() - nacimiento.getDate();

  if (days < 0) {
    months -= 1;
    const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
    days += ultimoMes.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} años, ${months} meses, ${days} días`;
}
