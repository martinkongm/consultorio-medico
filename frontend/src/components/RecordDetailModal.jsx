// components/RecordDetailModal.jsx
import Modal from './Modal';
import { displayInfo, formatDate } from '../utils/format';
import { tiempoEnfermedadText } from '../utils/tiempo';
import { examenClinicoRows, hasRegionContent } from '../utils/examenClinico';

function InfoLine({ label, children }) {
  return (
    <p>
      <strong>{label}:</strong> {children}
    </p>
  );
}

export function RecordDetailModal({ record, onClose, onExport }) {
  const examenEntries = examenClinicoRows(record);
  const groupedExamen = hasRegionContent(record);

  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-blue-700">
          <span className="text-2xl">🩺</span> Detalle de Historia Clínica
        </h3>
        <button
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          title="Cerrar"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      <div className="px-6 py-4 space-y-4 text-sm">
        <div className="p-3 bg-gray-50 rounded border">
          <InfoLine label="Paciente">
            {record?.patient_name || 'No registrado'}
          </InfoLine>
          <InfoLine label="Peso">{displayInfo(record?.weight, 'kg')}</InfoLine>
          <InfoLine label="Fecha de consulta">
            {formatDate(record?.date) || 'No registrada'}
          </InfoLine>
        </div>

        <div className="p-3 bg-white rounded border shadow-sm">
          <InfoLine label="Diagnóstico">
            {displayInfo(record?.diagnosis)}
          </InfoLine>
          <InfoLine label="Tratamiento">
            {displayInfo(record?.treatment)}
          </InfoLine>
        </div>

        <div className="p-3 bg-white rounded border shadow-sm">
          <InfoLine label="Motivo de consulta">
            {displayInfo(record?.motivo_consulta)}
          </InfoLine>
          <InfoLine label="Antecedentes">
            {displayInfo(record?.antecedentes)}
          </InfoLine>
          <InfoLine label="Tiempo de enfermedad">
            {tiempoEnfermedadText(record)}
          </InfoLine>

          <div className="border-t border-gray-200 my-3" />
          {groupedExamen && (
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Examen clínico por regiones
            </p>
          )}
          {examenEntries.map(([label, value]) => (
            <p key={label}>
              <strong>{label}:</strong> {displayInfo(value)}
            </p>
          ))}
        </div>

        <div className="p-3 bg-white rounded border shadow-sm">
          <InfoLine label="Examen laboratorio">
            {displayInfo(record?.examen_laboratorio)}
          </InfoLine>
          <InfoLine label="Temperatura">
            {displayInfo(record?.temperatura, '°C')}
          </InfoLine>
          <InfoLine label="Frecuencia respiratoria">
            {displayInfo(record?.frecuencia_respiratoria, 'rpm')}
          </InfoLine>
          <InfoLine label="Pulso">
            {displayInfo(record?.pulso, 'lpm')}
          </InfoLine>
          <InfoLine label="Saturación O₂">
            {displayInfo(record?.spo2, '%')}
          </InfoLine>
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-100 px-6 py-3">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2 text-sm"
          onClick={onExport}
        >
          Exportar PDF
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
