import jsPDF from 'jspdf';
import logoBase64 from '../assets/logoBase64';
import { buildRecordRows } from './pdfFields';
import { formatDate } from '../utils/format';

export const exportSingleRecordToPDF = (record) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

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
  doc.text(`Paciente: ${record.patient_name || 'No registrado'}`, 14, y);
  y += 7;
  doc.text(
    `Fecha de consulta: ${formatDate(record.date) || 'No registrada'}`,
    14,
    y
  );
  y += 10;

  // Sección: Información clínica
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Información clínica', 14, y);
  y += 8;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');

  buildRecordRows(record).forEach(([label, value]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    const splitText = doc.splitTextToSize(value, pageWidth - 28);
    doc.text(splitText, 18, y);
    y += splitText.length * 6 + 4;
  });

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(
    `Generado el ${new Date().toLocaleDateString()} – Consultorio Médico Martín Kong`,
    14,
    pageHeight - 10
  );

  doc.save(`Historia_${record.patient_name || 'paciente'}.pdf`);
};
