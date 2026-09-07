// components/PatientDetailModal.jsx
import Modal from './Modal';
import { formatDate } from '../utils/format';

function DetailRow({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-800 break-words">{value || '--'}</dd>
    </div>
  );
}

export default function PatientDetailModal({ patient, isOpen, onClose }) {
  return (
    <Modal open={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-800">
          Detalle del Paciente
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

      <div className="px-6 py-4">
        {patient ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow label="Nombre" value={patient.name} />
            <DetailRow label="DNI" value={patient.dni} />
            <DetailRow label="Edad" value={patient.edad} />
            <DetailRow
              label="Fecha de nacimiento"
              value={formatDate(patient.birthdate)}
            />
            <DetailRow label="Sexo" value={patient.gender} />
            <DetailRow label="Teléfono" value={patient.phone} />
            <DetailRow label="Domicilio" value={patient.domicilio} />
          </dl>
        ) : (
          <p className="text-sm text-gray-500">Sin información disponible.</p>
        )}
      </div>

      <div className="flex justify-end border-t border-gray-100 px-6 py-3">
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
