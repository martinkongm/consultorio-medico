export default function PatientDetailModal({ patient, isOpen, onClose }) {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <h3 className="text-xl font-bold mb-4">Detalle del Paciente</h3>

        <p><strong>Nombre:</strong> {patient.name || '--'}</p>
        <p><strong>DNI:</strong> {patient.dni || '--'}</p>
        <p><strong>Edad:</strong> {patient.edad || '--'}</p>
        <p><strong>Fecha de nacimiento:</strong> {patient.birthdate || '--'}</p>
        <p><strong>Sexo:</strong> {patient.gender || '--'}</p>
        <p><strong>Teléfono:</strong> {patient.phone || '--'}</p>
        <p><strong>Domicilio:</strong> {patient.domicilio || '--'}</p>

        <button
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
