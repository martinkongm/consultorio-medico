// components/FileUploadSection.jsx
export function FileUploadSection({ recordId, patientName, selectedFile, uploadedFiles, onFileSelect, onUpload, onClose }) {
  return (
    <div className="bg-white p-4 border rounded shadow relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
        title="Cerrar"
      >
        ✕
      </button>
      <h4 className="text-lg font-semibold mb-4">
        Archivos de la historia #{recordId} {patientName ? `— ${patientName}` : ''}
      </h4>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="file"
          onChange={(e) => onFileSelect(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={onUpload}
        >
          Subir archivo
        </button>
      </div>
      <ul className="list-disc list-inside">
        {uploadedFiles.map((f) => (
          <li key={f.id}>
            <a
              className="text-blue-600 hover:underline"
              href={`http://localhost:3001/uploads/${f.filepath}`}
              target="_blank"
              rel="noreferrer"
            >
              {f.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}