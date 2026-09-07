// components/FileUploadSection.jsx
import { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { getFileUrl } from '../services/config';

function formatFileSize(bytes) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export function FileUploadSection({
  recordId,
  patientName,
  selectedFile,
  uploadedFiles,
  onFileSelect,
  onUpload,
  onClose,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handlePick = (e) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
    // Permite volver a elegir el mismo archivo tras una subida/descarte.
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file) onFileSelect(file);
  };

  return (
    <div className="bg-white p-5 border rounded-lg shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            Adjuntar archivos
          </h4>
          <p className="text-sm text-gray-500">
            Historia #{recordId}
            {patientName ? ` — ${patientName}` : ''}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
          title="Cerrar sección"
          aria-label="Cerrar sección"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Zona de selección (clic o arrastrar) */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handlePick}
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={openPicker}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-8 text-center transition ${
          dragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40'
        }`}
        aria-label="Elegir archivo para subir"
      >
        <UploadCloud
          className={`h-10 w-10 ${dragging ? 'text-blue-600' : 'text-gray-400'}`}
        />
        <p className="text-sm font-medium text-gray-700">
          {dragging
            ? 'Suelta el archivo aquí'
            : 'Arrastra y suelta un archivo aquí'}
        </p>
        <p className="text-xs text-gray-500">
          o haz clic para buscar en tu computadora
        </p>
      </button>

      {/* Archivo elegido + acción de subida */}
      {selectedFile && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="h-5 w-5 text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="text-sm text-red-600 hover:underline px-2 py-1"
              title="Quitar archivo"
            >
              Quitar
            </button>
            <button
              type="button"
              onClick={onUpload}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 flex items-center gap-1.5"
            >
              <UploadCloud className="h-4 w-4" />
              Subir archivo
            </button>
          </div>
        </div>
      )}

      {/* Archivos ya adjuntos */}
      <div className="mt-5">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Archivos adjuntos ({uploadedFiles.length})
        </p>
        {uploadedFiles.length === 0 ? (
          <p className="text-sm text-gray-400">
            Todavía no hay archivos en esta historia clínica.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {uploadedFiles.map((f) => (
              <li key={f.id} className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                <a
                  className="text-blue-600 hover:underline text-sm truncate"
                  href={getFileUrl(f.filepath)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {f.filename}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
