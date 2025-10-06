// components/PatientTable.jsx
export function PatientTable({ patients, onEdit, onDelete, onViewDetails, onViewHistory, onExport }) {
  return (
    <table className="w-full border shadow rounded overflow-hidden text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border">Nombre</th>
          <th className="p-2 border">Edad</th>
          <th className="p-2 border">DNI</th>
          <th className="p-2 border">Teléfono</th>
          <th className="p-2 border">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="p-2 border">{p.name || '--'}</td>
            <td className="p-2 border">{p.edad || '--'}</td>
            <td className="p-2 border">{p.dni || '--'}</td>
            <td className="p-2 border">{p.phone || '--'}</td>
            <td className="p-2 border space-x-2">
              <button
                className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                onClick={() => onViewDetails(p)}
              >
                Ver datos
              </button>
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                onClick={() => onEdit(p)}
              >
                Editar
              </button>
              <button
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                onClick={() => onDelete(p.id)}
              >
                Eliminar
              </button>
              <button
                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                onClick={() => onViewHistory(p)}
              >
                + Historia
              </button>
              <button
                className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                onClick={() => onExport(p)}
              >
                Exportar historial
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}