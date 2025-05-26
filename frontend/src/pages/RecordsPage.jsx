import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FaSearch } from 'react-icons/fa';

const exportSingleRecordToPDF = (record) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Historia Clínica', 14, 20);

  const lines = [
    `Paciente: ${record.patient_name}`,
    `Fecha: ${record.date}`,
    `Diagnóstico: ${record.diagnosis}`,
    `Tratamiento: ${record.treatment}`,
    `Antecedentes: ${record.antecedentes}`,
    `Motivo de consulta: ${record.motivo_consulta}`,
    `Examen clínico: ${record.examen_clinico}`,
    `Examen laboratorio: ${record.examen_laboratorio}`,
  ];

  let y = 30;
  doc.setFontSize(12);
  lines.forEach((line) => {
    doc.text(line, 14, y);
    y += 10;
  });

  doc.save(`Historia_${record.patient_name || 'paciente'}.pdf`);
};

export default function RecordsPage() {
  const formRef = useRef(null);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dniFromUrl = params.get('dni');

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null);

  const [searchDNI, setSearchDNI] = useState('');
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient_id: '',
    date: '',
    diagnosis: '',
    treatment: '',
    antecedentes: '',
    motivo_consulta: '',
    examen_clinico: '',
    examen_laboratorio: '',
  });

  const [editId, setEditId] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errors, setErrors] = useState([]);

  const getPatientById = (id) => patients.find((p) => p.id === id);

  const getPatientIdByDNI = (dni) => {
    const cleanDNI = dni.trim();
    const patient = patients.find((p) => p.dni.trim() === cleanDNI);
    return patient ? String(patient.id) : null;
  };

  const filteredRecords = records.filter((r) => {
    if (!searchDNI) return true;
    const patient = patients.find((p) => p.id === r.patient_id);
    return (
      patient?.dni.includes(searchDNI) ||
      patient?.name.toLowerCase().includes(searchDNI.toLowerCase())
    );
  });

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.dni})`,
  }));

  const fetchRecords = async () => {
    const res = await axios.get('http://localhost:3001/api/records');
    setRecords(res.data);
  };

  const fetchPatients = async () => {
    const res = await axios.get('http://localhost:3001/api/patients');
    setPatients(res.data);
  };

  const fetchFiles = async (recordId) => {
    const res = await axios.get(
      `http://localhost:3001/api/records/${recordId}/files`
    );
    setUploadedFiles(res.data);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.patient_id) newErrors.patient_id = 'Selecciona un paciente.';
    if (!form.date) newErrors.date = 'La fecha es obligatoria.';
    if (!form.diagnosis) newErrors.diagnosis = 'El diagnóstico es obligatorio.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (editId) {
        await axios.put(`http://localhost:3001/api/records/${editId}`, form);
      } else {
        await axios.post('http://localhost:3001/api/records', form);
      }

      setForm({
        patient_id: '',
        date: '',
        diagnosis: '',
        treatment: '',
        antecedentes: '',
        motivo_consulta: '',
        examen_clinico: '',
        examen_laboratorio: '',
      });
      setEditId(null);
      setErrors({});
      fetchRecords();
    } catch (err) {
      console.error(
        'Error al guardar historia clínica:',
        err.response?.data || err.message
      );
      alert(
        'No se pudo guardar la historia clínica. Revisa los campos o intenta más tarde.'
      );
    }
  };

  const handleEdit = (record) => {
    setForm({
      patient_id: Number(record.patient_id),
      date: record.date,
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      antecedentes: record.antecedentes || '',
      motivo_consulta: record.motivo_consulta || '',
      examen_clinico: record.examen_clinico || '',
      examen_laboratorio: record.examen_laboratorio || '',
    });
    setEditId(record.id);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta historia clínica?')) {
      await axios.delete(`http://localhost:3001/api/records/${id}`);
      fetchRecords();
    }
  };

  const uploadFile = async () => {
    if (!selectedFile || !selectedRecordId) return;
    const formData = new FormData();
    formData.append('file', selectedFile);

    await axios.post(
      `http://localhost:3001/api/records/${selectedRecordId}/upload`,
      formData
    );
    setSelectedFile(null);
    fetchFiles(selectedRecordId);
  };

  useEffect(() => {
    fetchPatients();
    fetchRecords();

    const savedPatientId = localStorage.getItem('lastSelectedPatientId');
    if (savedPatientId) {
      setForm((prev) => ({ ...prev, patient_id: parseInt(savedPatientId) }));
    }

    const savedRecordId = localStorage.getItem('lastSelectedRecordId');
    if (savedRecordId) {
      setSelectedRecordId(parseInt(savedRecordId));
      fetchFiles(parseInt(savedRecordId));
    }
  }, []);

  useEffect(() => {
    if (dniFromUrl && patients.length > 0) {
      const patient = patients.find((p) => p.dni.trim() === dniFromUrl.trim());
      if (patient) {
        setForm((prev) => ({ ...prev, patient_id: patient.id }));
        localStorage.setItem('lastSelectedPatientId', patient.id);
        setSearchDNI(dniFromUrl);
      }
    }
  }, [dniFromUrl, patients]);

  const selectedPatient = getPatientById(form.patient_id);

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Historias Clínicas</h2>

      <div ref={formRef} className="bg-white p-6 rounded shadow mb-10">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">
          {editId
            ? 'Editar Historia Clínica'
            : 'Registrar Nueva Historia Clínica'}
        </h3>
        {selectedPatient && (
          <p className="text-sm text-gray-600 mb-4">
            Registrando historia para: <strong>{selectedPatient.name}</strong>{' '}
            (DNI: {selectedPatient.dni})
          </p>
        )}

        <fieldset className="border border-gray-200 rounded p-4 mb-6">
          <legend className="text-sm font-semibold text-gray-600 px-2">
            Datos del paciente
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Paciente</label>
              <Select
                options={patientOptions}
                placeholder="Selecciona un paciente"
                onChange={(option) => {
                  const id = option?.value || '';
                  setForm({ ...form, patient_id: Number(id) });
                  if (id) localStorage.setItem('lastSelectedPatientId', id);
                }}
                value={
                  patientOptions.find(
                    (opt) => opt.value === Number(form.patient_id)
                  ) || null
                }
                classNamePrefix={
                  errors.patient_id ? 'react-select-error' : 'react-select'
                }
              />
              {errors.patient_id && (
                <p className="text-red-500 text-sm mt-1">{errors.patient_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha de registro</label>
              <input
                type="date"
                className={`border p-2 rounded w-full ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="border border-gray-200 rounded p-4 mb-6">
          <legend className="text-sm font-semibold text-gray-600 px-2">
            Información Clínica
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Motivo de consulta
              </label>
              <textarea
                className="border p-2 rounded w-full resize-y min-h-[80px]"
                value={form.motivo_consulta}
                onChange={(e) =>
                  setForm({ ...form, motivo_consulta: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Antecedentes personales/familiares
              </label>
              <textarea
                className="border p-2 rounded w-full resize-y min-h-[80px]"
                value={form.antecedentes}
                onChange={(e) =>
                  setForm({ ...form, antecedentes: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Examen clínico
              </label>
              <textarea
                className="border p-2 rounded w-full resize-y min-h-[80px]"
                value={form.examen_clinico}
                onChange={(e) =>
                  setForm({ ...form, examen_clinico: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Diagnóstico
              </label>
              <textarea
                className={`border p-2 rounded w-full resize-y min-h-[80px] ${
                  errors.diagnosis ? 'border-red-500' : 'border-gray-300'
                }`}
                value={form.diagnosis}
                onChange={(e) =>
                  setForm({ ...form, diagnosis: e.target.value })
                }
              />
              {errors.diagnosis && (
                <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tratamiento
              </label>
              <textarea
                className="border p-2 rounded w-full resize-y min-h-[80px]"
                value={form.treatment}
                onChange={(e) =>
                  setForm({ ...form, treatment: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">
                Examen de laboratorio
              </label>
              <textarea
                className="border p-2 rounded w-full resize-y min-h-[80px]"
                value={form.examen_laboratorio}
                onChange={(e) =>
                  setForm({ ...form, examen_laboratorio: e.target.value })
                }
              />
            </div>
          </div>
        </fieldset>

        <div className="flex gap-2 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            {editId ? 'Guardar' : 'Agregar'}
          </button>
          {editId && (
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              onClick={() => {
                setForm({
                  patient_id: '',
                  date: '',
                  diagnosis: '',
                  treatment: '',
                  antecedentes: '',
                  motivo_consulta: '',
                  examen_clinico: '',
                  examen_laboratorio: '',
                });
                setEditId(null);
                setErrors({});
                localStorage.removeItem('lastSelectedPatientId');
                localStorage.removeItem('lastSelectedRecordId');
                setSelectedRecordId(null);
                setUploadedFiles([]);
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div className="relative mb-6 md:w-1/2">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por DNI o nombre del paciente"
          className="pl-10 pr-8 py-2 border rounded w-full"
          value={searchDNI}
          onChange={(e) => setSearchDNI(e.target.value)}
        />
        {searchDNI && (
          <button
            onClick={() => setSearchDNI('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            title="Limpiar"
          >
            ✕
          </button>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-3">
        Historias Clínicas Registradas
      </h3>
      <table className="w-full border shadow rounded text-sm mb-8">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Paciente</th>
            <th className="p-2 border">Fecha de registro</th>
            <th className="p-2 border">Diagnóstico</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredRecords.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No se encontraron historias clínicas para los criterios de
                búsqueda.
              </td>
            </tr>
          ) : (
            filteredRecords.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-2 border">{r.patient_name}</td>
                <td className="p-2 border">{formatDate(r.date)}</td>
                <td className="p-2 border">{r.diagnosis}</td>
                <td className="p-2 border space-x-1">
                  <button
                    className="bg-sky-600 text-white px-2 py-1 rounded hover:bg-sky-700"
                    onClick={() => {
                      setSelectedRecordId(r.id);
                      fetchFiles(r.id);
                      localStorage.setItem('lastSelectedRecordId', r.id);
                    }}
                  >
                    Archivos
                  </button>
                  <button
                    className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                    onClick={() => {
                      setSelectedRecordDetail(r);
                      setShowDetailModal(true);
                    }}
                  >
                    Ver detalle
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(r)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(r.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showDetailModal && selectedRecordDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50 transition-opacity duration-300 animate-fade-in">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-2 text-red-600 hover:bg-red-100 hover:text-red-800 p-1 rounded-full transition"
              title="Cerrar"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedRecordDetail(null);
              }}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-700">
              <span className="text-2xl">🩺</span> Detalle de Historia Clínica
            </h3>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded border">
                <p>
                  <strong>Paciente:</strong> {selectedRecordDetail.patient_name}
                </p>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {formatDate(selectedRecordDetail.date)}
                </p>
              </div>

              <div className="p-3 bg-white rounded border shadow-sm">
                <p>
                  <strong>Diagnóstico:</strong> {selectedRecordDetail.diagnosis}
                </p>
                <p>
                  <strong>Tratamiento:</strong> {selectedRecordDetail.treatment}
                </p>
              </div>

              <div className="p-3 bg-white rounded border shadow-sm">
                <p>
                  <strong>Antecedentes:</strong>{' '}
                  {selectedRecordDetail.antecedentes}
                </p>
                <p>
                  <strong>Motivo de consulta:</strong>{' '}
                  {selectedRecordDetail.motivo_consulta}
                </p>
                <p>
                  <strong>Historia enfermedad actual:</strong>{' '}
                  {selectedRecordDetail.historia_enfermedad_actual}
                </p>
                <p>
                  <strong>Examen laboratorio:</strong>{' '}
                  {selectedRecordDetail.examen_laboratorio}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => exportSingleRecordToPDF(selectedRecordDetail)}
              >
                Exportar PDF
              </button>

              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedRecordDetail(null);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedRecordId && (
        <div className="bg-white p-4 border rounded shadow relative">
          <button
            onClick={() => {
              setSelectedRecordId(null);
              setUploadedFiles([]);
              localStorage.removeItem('lastSelectedRecordId');
            }}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
            title="Cerrar"
          >
            ✕
          </button>
          <h4 className="text-lg font-semibold mb-4">
            Archivos de la historia #{selectedRecordId}{' '}
            {selectedPatient ? `– ${selectedPatient.name}` : ''}
          </h4>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="border p-2 rounded"
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={uploadFile}
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
      )}
    </div>
  );
}
