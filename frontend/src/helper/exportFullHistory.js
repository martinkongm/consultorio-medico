import axios from 'axios';
import jsPDF from 'jspdf';
import logoBase64 from '../assets/LogoBase64';

export const exportFullHistory = async (patientId, patientName) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/api/records/patient/${patientId}`
    );
    const records = res.data;

    if (records.length === 0) {
      alert('Este paciente no tiene historias clínicas registradas.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Logo (opcional)
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', pageWidth - 50, 5, 40, 15);
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Historial Clínico de ${patientName}`, 14, 20);
    doc.setLineWidth(0.2);
    doc.line(14, 24, pageWidth - 14, 24);

    let y = 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    records.forEach((record, index) => {
      const clean = (val, unit = '') =>
        val === null || val === undefined || val === ''
          ? 'No registrado'
          : `${val}${unit}`;

      const fields = [
        ['Motivo de consulta', clean(record.motivo_consulta)],
        ['Antecedentes', clean(record.antecedentes)],
        ['Examen clínico', clean(record.examen_clinico)],
        ['Diagnóstico', clean(record.diagnosis)],
        ['Tratamiento', clean(record.treatment)],
        ['Examen laboratorio', clean(record.examen_laboratorio)],
        ['Temperatura (°C)', clean(record.temperatura, ' °C')],
        [
          'Frecuencia respiratoria (FR)',
          clean(record.frecuencia_respiratoria, ' rpm'),
        ],
        ['Pulso', clean(record.pulso, ' lpm')],
        ['Saturación de oxígeno', clean(record.spo2, ' %')],
      ];

      // 🔎 Calcular la altura estimada de esta historia
      let estimatedHeight = 18; // encabezado
      fields.forEach(([_, value]) => {
        const lines = doc.splitTextToSize(value || '—', pageWidth - 32);
        estimatedHeight += lines.length * 6 + 10;
      });

      if (y + estimatedHeight > 270) {
        doc.addPage();
        y = 20;
      }

      // 🧾 Encabezado de historia
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(230, 230, 230); // gris claro
      doc.rect(14, y, pageWidth - 28, 8, 'F');
      doc.text(
        `Historia #${index + 1} — Fecha: ${formatDate(record.date)}`,
        16,
        y + 6
      );
      y += 18;

      // 📄 Contenido de campos
      fields.forEach(([label, value]) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        const displayValue =
          value === null || value === undefined || value === ''
            ? 'No registrado'
            : value;

        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 16, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        const textLines = doc.splitTextToSize(
          displayValue || '—',
          pageWidth - 32
        );
        doc.text(textLines, 20, y);
        y += textLines.length * 6 + 4;
      });

      y += 4;
    });

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Exportado el ${new Date().toLocaleDateString()} – Consultorio Médico Martín Kong`,
      14,
      pageHeight - 10
    );

    doc.save(`Historial_${patientName}.pdf`);
  } catch (err) {
    console.error('Error al exportar historial:', err);
    alert('No se pudo exportar el historial clínico.');
  }
};

export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};
