// components/RecordTable.jsx
export function RecordTable({ records, patients, onViewFiles, onViewDetail, onEdit, onDelete }) {
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  if (records.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 border rounded mb-8">
        No se encontraron historias clínicas para los criterios de búsqueda.
      </div>
    );
  }

  return (
    <table className="w-full border shadow rounded text-sm mb-8">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border">Paciente</th>
          <th className="p-2 border">Fecha de registro</th>
          <th className="p-2 border">Motivo de la consulta</th>
          <th className="p-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.id} className="hover:bg-gray-50 even:bg-gray-50">
            <td className="p-2 border">{r.patient_name}</td>
            <td className="p-2 border">{formatDate(r.date)}</td>
            <td className="p-2 border">{r.motivo_consulta}</td>
            <td className="p-2 border space-x-1">
              <button
                className="bg-sky-600 text-white px-2 py-1 rounded hover:bg-sky-700"
                onClick={() => onViewFiles(r.id)}
              >
                Archivos
              </button>
              <button
                className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                onClick={() => onViewDetail(r)}
              >
                Ver detalle
              </button>
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                onClick={() => onEdit(r)}
              >
                Editar
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                onClick={() => onDelete(r.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
