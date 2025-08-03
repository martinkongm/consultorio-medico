import jsPDF from 'jspdf';
import logoBase64 from '../assets/LogoBase64';

export const exportSingleRecordToPDF = (record) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Logo centrado
  doc.addImage(logoBase64, 'PNG', (pageWidth - 60) / 2, 10, 60, 30);

  // Título
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('HISTORIA CLÍNICA', pageWidth / 2, 50, { align: 'center' });

  // Línea divisoria
  doc.setDrawColor(0);
  doc.line(14, 55, pageWidth - 14, 55);

  let y = 65;

  // Sección: Datos del paciente
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos del paciente', 14, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Paciente: ${record.patient_name}`, 14, y);
  y += 7;
  doc.text(`Fecha de consulta: ${record.date}`, 14, y);
  y += 10;

  // Sección: Información clínica
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Información clínica', 14, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  const clean = (val, unit = '') =>
    val === null || val === undefined || val === ''
      ? 'No registrado'
      : `${val}${unit}`;

  const content = [
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

  content.forEach(([label, value]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const displayValue =
      value === null || value === undefined || value === ''
        ? 'No registrado'
        : value;

    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');

    const splitText = doc.splitTextToSize(displayValue || '—', pageWidth - 28);
    doc.text(splitText, 18, y);
    y += splitText.length * 6 + 4;
  });

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(
    `Generado el ${new Date().toLocaleDateString()} – Consultorio Médico Martín Kong`,
    14,
    290
  );

  doc.save(`Historia_${record.patient_name || 'paciente'}.pdf`);
};
