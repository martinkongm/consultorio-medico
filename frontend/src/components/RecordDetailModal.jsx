// components/RecordDetailModal.jsx
export function RecordDetailModal({ record, onClose, onExport }) {
  const displayInfo = (data, unit = '') => {
    if (data) {
      return unit !== '' ? `${data} ${unit}` : data;
    }
    return 'No registrado';
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50 transition-opacity duration-300 animate-fade-in">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-red-600 hover:bg-red-100 hover:text-red-800 p-1 rounded-full transition"
          title="Cerrar"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-700">
          <span className="text-2xl">🩺</span> Detalle de Historia Clínica
        </h3>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded border">
            <p><strong>Paciente:</strong> {record.patient_name}</p>
            <p><strong>Fecha de consulta:</strong> {formatDate(record.date)}</p>
          </div>

          <div className="p-3 bg-white rounded border shadow-sm">
            <p><strong>Diagnóstico:</strong> {record.diagnosis}</p>
            <p><strong>Tratamiento:</strong> {record.treatment}</p>
          </div>

          <div className="p-3 bg-white rounded border shadow-sm">
            <p><strong>Antecedentes:</strong> {displayInfo(record.antecedentes)}</p>
            <p><strong>Motivo de consulta:</strong> {displayInfo(record.motivo_consulta)}</p>
            <p><strong>Examen clínico:</strong> {displayInfo(record.examen_clinico)}</p>
            <p><strong>Examen laboratorio:</strong> {displayInfo(record.examen_laboratorio)}</p>
            <p><strong>Temperatura:</strong> {displayInfo(record.temperatura, '°C')}</p>
            <p><strong>Frecuencia respiratoria:</strong> {displayInfo(record.frecuencia_respiratoria, 'rpm')}</p>
            <p><strong>Pulso:</strong> {displayInfo(record.pulso, 'lpm')}</p>
            <p><strong>Saturación O₂:</strong> {displayInfo(record.spo2, '%')}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            onClick={onExport}
          >
            Exportar PDF
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
