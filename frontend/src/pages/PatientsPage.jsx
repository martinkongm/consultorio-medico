import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { FaSearch } from 'react-icons/fa';
import logoBase64 from '../assets/LogoBase64';

const exportFullHistory = async (patientId, patientName) => {
  try {
    const res = await axios.get(
      `http://localhost:3001/api/records/patient/${patientId}`
    );
    const records = res.data;

    if (records.length === 0) {
      alert('Este paciente no tiene historias clínicas registradas.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Logo (opcional)
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', pageWidth - 50, 5, 40, 15);
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Historial Clínico de ${patientName}`, 14, 20);
    doc.setLineWidth(0.2);
    doc.line(14, 24, pageWidth - 14, 24);

    let y = 30;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    records.forEach((record, index) => {
      const fields = [
        ['Motivo de consulta', record.motivo_consulta],
        ['Antecedentes', record.antecedentes],
        ['Examen clínico', record.examen_clinico],
        ['Diagnóstico', record.diagnosis],
        ['Tratamiento', record.treatment],
        ['Examen laboratorio', record.examen_laboratorio],
      ];

      // 🔎 Calcular la altura estimada de esta historia
      let estimatedHeight = 18; // encabezado
      fields.forEach(([_, value]) => {
        const lines = doc.splitTextToSize(value || '—', pageWidth - 32);
        estimatedHeight += lines.length * 6 + 10;
      });

      if (y + estimatedHeight > 270) {
        doc.addPage();
        y = 20;
      }

      // 🧾 Encabezado de historia
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(230, 230, 230); // gris claro
      doc.rect(14, y, pageWidth - 28, 8, 'F');
      doc.text(
        `Historia #${index + 1} — Fecha: ${formatDate(record.date)}`,
        16,
        y + 6
      );
      y += 18;

      // 📄 Contenido de campos
      fields.forEach(([label, value]) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 16, y);
        y += 6;

        doc.setFont('helvetica', 'normal');
        const textLines = doc.splitTextToSize(value || '—', pageWidth - 32);
        doc.text(textLines, 20, y);
        y += textLines.length * 6 + 4;
      });

      y += 4;
    });

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(
      `Exportado el ${new Date().toLocaleDateString()} – Consultorio Médico Martín Kong`,
      14,
      pageHeight - 10
    );

    doc.save(`Historial_${patientName}.pdf`);
  } catch (err) {
    console.error('Error al exportar historial:', err);
    alert('No se pudo exportar el historial clínico.');
  }
};

const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

export default function PatientsPage() {
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: '',
    dni: '',
    birthdate: '',
    gender: '',
    phone: '',
  });
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  const navigate = useNavigate();

  const fetchPatients = async () => {
    const res = await axios.get('http://localhost:3001/api/patients');
    setPatients(res.data);
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!form.name) newErrors.name = 'El nombre es obligatorio.';
    if (!form.dni) {
      newErrors.dni = 'El DNI es obligatorio.';
    } else if (!/^\d{8}$/.test(form.dni)) {
      newErrors.dni = 'El DNI debe tener exactamente 8 dígitos.';
    }
    if (!form.gender) newErrors.gender = 'Selecciona un sexo válido.';
    if (!form.phone) newErrors.phone = 'El número telefónico es obligatorio.';

    // Verificar si el DNI ya existe al crear nuevo paciente
    const duplicate = patients.find(
      (p) => p.dni === form.dni && p.id !== editId
    );
    if (!editId && duplicate) {
      newErrors.dni = 'Este DNI ya está registrado.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (editId) {
        await axios.put(`http://localhost:3001/api/patients/${editId}`, form);
      } else {
        await axios.post('http://localhost:3001/api/patients', form);
      }

      setForm({ name: '', dni: '', birthdate: '', gender: '', phone: '' });
      setEditId(null);
      setErrors({});
      localStorage.removeItem('editingPatientId');
      fetchPatients();
    } catch (err) {
      console.error('Error del servidor:', err.response?.data || err.message);
      alert(
        err.response?.data?.details ||
          'Ocurrió un error al guardar el paciente.'
      );
    }
  };

  const handleEdit = (patient) => {
    setForm(patient);
    setEditId(patient.id);
    localStorage.setItem('editingPatientId', patient.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este paciente?')) {
      await axios.delete(`http://localhost:3001/api/patients/${id}`);
      fetchPatients();
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const savedPatientId = localStorage.getItem('editingPatientId');
    if (savedPatientId) {
      const id = parseInt(savedPatientId);
      const saved = patients.find((p) => p.id === id);
      if (saved) {
        setForm(saved);
        setEditId(id);
      }
    }
  }, [patients]);

  const filteredPatients = patients
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dni.includes(searchTerm)
    )
    .sort((a, b) => b.id - a.id);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Pacientes</h2>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b pb-2">
          {editId ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              className={`border p-2 rounded w-full ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DNI del paciente
            </label>
            <input
              className={`border p-2 rounded w-full ${
                errors.dni ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="DNI"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
            />
            {errors.dni && (
              <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <input
              className="border p-2 rounded w-full"
              type="date"
              value={form.birthdate}
              onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono del paciente
            </label>
            <input
              className={`border p-2 rounded w-full ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Teléfono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sexo
            </label>
            <select
              className={`border p-2 rounded w-full ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              {!editId && (
                <option value="" disabled>
                  Selecciona una opción
                </option>
              )}
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div className="flex gap-2 items-start md:col-span-5">
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
                    name: '',
                    dni: '',
                    birthdate: '',
                    gender: '',
                    phone: '',
                  });
                  setEditId(null);
                  setErrors({});
                  localStorage.removeItem('editingPatientId');
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Pacientes Registrados</h3>
        <div className="relative mb-4 md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por DNI o nombre del paciente"
            className="pl-10 pr-8 py-2 border rounded w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Limpiar"
            >
              ✕
            </button>
          )}
        </div>

        {searchTerm && filteredPatients.length === 0 && (
          <p className="text-red-500 text-sm mt-2">
            No se encontraron pacientes que coincidan con tu búsqueda.
          </p>
        )}
        <table className="w-full border shadow rounded overflow-hidden text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">DNI</th>
              <th className="p-2 border">Nacimiento</th>
              <th className="p-2 border">Género</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.dni}</td>
                <td className="p-2 border">{formatDate(p.birthdate)}</td>
                <td className="p-2 border">{p.gender}</td>
                <td className="p-2 border">{p.phone}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    onClick={() => handleDelete(p.id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    onClick={() => navigate(`/historias?dni=${p.dni}`)}
                  >
                    + Historia
                  </button>
                  <button
                    className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                    onClick={() => exportFullHistory(p.id, p.name)}
                  >
                    Exportar historial
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            « Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente »
          </button>
        </div>
      </div>
    </div>
  );
}
