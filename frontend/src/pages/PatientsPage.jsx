import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { exportFullHistory } from '../helper/exportFullHistory';
import PatientDetailModal from '../components/PatientDetailModal';
import { usePatients } from '../hooks/usePatients';
import { usePatientForm } from '../hooks/usePatientForm';
import { PatientForm } from '../components/PatientForm';
import { PatientTable } from '../components/PatientTable';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

export default function PatientsPage() {
  const navigate = useNavigate();
  const firstInputRef = useRef(null);
  
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { patients, loading, error, fetchPatients, deletePatient } = usePatients();
  const {
    form,
    errors,
    editId,
    setForm,
    setEditId,
    handleSubmit,
    resetForm
  } = usePatientForm(patients, fetchPatients);

  const PATIENTS_PER_PAGE = 10;

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const savedPatientId = localStorage.getItem('editingPatientId');
    if (savedPatientId && patients.length > 0) {
      const id = parseInt(savedPatientId);
      const saved = patients.find((p) => p.id === id);
      if (saved) {
        setForm(saved);
        setEditId(id);
      }
    }
  }, [patients, setForm, setEditId]);

  const handleEdit = (patient) => {
    setForm(patient);
    setEditId(patient.id);
    localStorage.setItem('editingPatientId', patient.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => firstInputRef.current?.focus(), 300);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este paciente?')) {
      await deletePatient(id);
    }
  };

  const handleCancel = () => {
    resetForm();
    localStorage.removeItem('editingPatientId');
  };

  const filteredPatients = patients
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.dni && p.dni.includes(searchTerm))
    )
    .sort((a, b) => b.id - a.id);

  const { paginatedItems, totalPages } = usePagination(
    filteredPatients,
    currentPage,
    PATIENTS_PER_PAGE
  );

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Pacientes</h2>

      <PatientForm
        form={form}
        errors={errors}
        editId={editId}
        firstInputRef={firstInputRef}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onChange={setForm}
      />

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Pacientes Registrados</h3>
        
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar por DNI o nombre del paciente"
        />

        {searchTerm && filteredPatients.length === 0 && (
          <p className="text-red-500 text-sm mt-2">
            No se encontraron pacientes que coincidan con tu búsqueda.
          </p>
        )}

        <PatientTable
          patients={paginatedItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={(patient) => {
            setSelectedPatient(patient);
            setIsModalOpen(true);
          }}
          onViewHistory={(patient) =>
            navigate(
              `/historias?dni=${encodeURIComponent(patient.dni)}&nombre=${encodeURIComponent(patient.name)}`
            )
          }
          onExport={(patient) => exportFullHistory(patient.id, patient.name)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <PatientDetailModal
        patient={selectedPatient}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}