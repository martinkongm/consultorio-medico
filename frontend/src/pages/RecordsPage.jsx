import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { exportSingleRecordToPDF } from '../helper/exportSingleRecordToPDF';
import { useRecords } from '../hooks/useRecords';
import { usePatients } from '../hooks/usePatients';
import { useRecordForm } from '../hooks/useRecordForm';
import { useFileUpload } from '../hooks/useFileUpload';
import { RecordForm } from '../components/RecordForm';
import { RecordTable } from '../components/RecordTable';
import { RecordDetailModal } from '../components/RecordDetailModal';
import { FileUploadSection } from '../components/FileUploadSection';
import { SearchBar } from '../components/SearchBar';
import { usePagination } from '../hooks/usePagination';

export default function RecordsPage() {
  const formRef = useRef(null);
  const location = useLocation();
  
  const [searchDNI, setSearchDNI] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const { records, fetchRecords, deleteRecord } = useRecords();
  const { patients, fetchPatients } = usePatients();
  const {
    form,
    errors,
    editId,
    setForm,
    handleSubmit,
    handleEdit,
    resetForm,
  } = useRecordForm(records, patients, fetchRecords, formRef);

  const {
    selectedFile,
    uploadedFiles,
    setSelectedFile,
    setSelectedRecordId: setFileRecordId,
    uploadFile,
    fetchFiles,
  } = useFileUpload();

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchPatients();
    fetchRecords();
    loadSavedState();
  }, []);

  useEffect(() => {
    handleURLParams();
  }, [location.search, patients]);

  const loadSavedState = () => {
    const savedPatientId = localStorage.getItem('lastSelectedPatientId');
    if (savedPatientId) {
      setForm((prev) => ({ ...prev, patient_id: parseInt(savedPatientId) }));
    }

    const savedRecordId = localStorage.getItem('lastSelectedRecordId');
    if (savedRecordId) {
      const id = parseInt(savedRecordId);
      setSelectedRecordId(id);
      setFileRecordId(id);
      fetchFiles(id);
    }
  };

  const handleURLParams = () => {
    const params = new URLSearchParams(location.search);
    const dniFromUrl = params.get('dni');
    const nameFromUrl = params.get('nombre');

    if ((dniFromUrl || nameFromUrl) && patients.length > 0) {
      const patient = patients.find((p) => {
        const matchByDNI = dniFromUrl && p.dni.trim() === dniFromUrl.trim();
        const matchByName =
          nameFromUrl &&
          p.name.trim().toLowerCase() === nameFromUrl.trim().toLowerCase();
        return matchByDNI || matchByName;
      });

      if (patient) {
        setForm((prev) => ({ ...prev, patient_id: patient.id }));
        localStorage.setItem('lastSelectedPatientId', patient.id);
        setSearchDNI(patient.dni);
      }
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('¿Eliminar esta historia clínica?')) {
      await deleteRecord(id);
    }
  };

  const handleViewFiles = (recordId) => {
    setSelectedRecordId(recordId);
    setFileRecordId(recordId);
    fetchFiles(recordId);
    localStorage.setItem('lastSelectedRecordId', recordId);
  };

  const handleCloseFiles = () => {
    setSelectedRecordId(null);
    setFileRecordId(null);
    localStorage.removeItem('lastSelectedRecordId');
  };

  const filteredRecords = records
    .filter((r) => {
      if (!searchDNI) return true;
      const patient = patients.find((p) => p.id === r.patient_id);
      return (
        patient?.dni.includes(searchDNI) ||
        patient?.name.toLowerCase().includes(searchDNI.toLowerCase())
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const { paginatedItems } = usePagination(
    filteredRecords,
    currentPage,
    ITEMS_PER_PAGE
  );

  const selectedPatient = patients.find((p) => p.id === form.patient_id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Historias Clínicas</h2>

      <RecordForm
        ref={formRef}
        form={form}
        errors={errors}
        editId={editId}
        patients={patients}
        selectedPatient={selectedPatient}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        onChange={setForm}
      />

      <h3 className="text-lg font-semibold mb-3 border-t pt-6">
        Historias Clínicas Registradas
      </h3>

      <SearchBar
        value={searchDNI}
        onChange={setSearchDNI}
        placeholder="Buscar por DNI o nombre del paciente"
      />

      <RecordTable
        records={paginatedItems}
        patients={patients}
        onViewFiles={handleViewFiles}
        onViewDetail={(record) => {
          setSelectedRecordDetail(record);
          setShowDetailModal(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDeleteRecord}
      />

      <RecordPagination
        currentPage={currentPage}
        totalItems={filteredRecords.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />

      {showDetailModal && selectedRecordDetail && (
        <RecordDetailModal
          record={selectedRecordDetail}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRecordDetail(null);
          }}
          onExport={() => exportSingleRecordToPDF(selectedRecordDetail)}
        />
      )}

      {selectedRecordId && (
        <FileUploadSection
          recordId={selectedRecordId}
          patientName={selectedPatient?.name}
          selectedFile={selectedFile}
          uploadedFiles={uploadedFiles}
          onFileSelect={setSelectedFile}
          onUpload={uploadFile}
          onClose={handleCloseFiles}
        />
      )}
    </div>
  );
}

// Pagination component specific to records
function RecordPagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center mb-10 text-sm">
      <p>
        Mostrando {startItem}–{endItem} de {totalItems} historia(s)
      </p>
      <div className="space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
          className={`px-3 py-1 rounded border ${
            currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'hover:bg-gray-100'
          }`}
        >
          Anterior
        </button>
        <button
          disabled={currentPage * itemsPerPage >= totalItems}
          onClick={() => onPageChange((prev) => prev + 1)}
          className={`px-3 py-1 rounded border ${
            currentPage * itemsPerPage >= totalItems
              ? 'bg-gray-200 text-gray-400'
              : 'hover:bg-gray-100'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

