// Cálculo de edad a partir de una fecha ISO (YYYY-MM-DD).
// Devuelve un texto legible en español, p. ej. "32 años", "8 meses".
function calcularEdad(birthdate) {
  if (!birthdate) return null;

  const nacimiento = new Date(`${birthdate}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

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

  if (years > 0) return `${years} años`;
  if (months > 0) return `${months} meses`;
  return `${days} días`;
}

module.exports = { calcularEdad };
