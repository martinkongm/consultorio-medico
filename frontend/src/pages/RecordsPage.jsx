import { useCallback, useEffect, useState, useRef } from 'react';
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
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';
import { normalizeForSearch } from '../utils/format';
import { getApiErrorMessage } from '../services/apiClient';
import { toast } from '../utils/toast';

const ITEMS_PER_PAGE = 10;

export default function RecordsPage() {
  const formRef = useRef(null);
  const filesSectionRef = useRef(null);
  const location = useLocation();

  const [searchDNI, setSearchDNI] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null);

  const { records, fetchRecords, deleteRecord } = useRecords();
  const { patients, fetchPatients } = usePatients();
  const {
    form,
    errors,
    editId,
    saving,
    setForm,
    handleSubmit,
    handleEdit,
    resetForm,
  } = useRecordForm(records, patients, fetchRecords, formRef);

  const {
    selectedFile,
    uploadedFiles,
    selectedRecordId,
    setSelectedFile,
    setUploadedFiles,
    setSelectedRecordId,
    fetchFiles,
    uploadFile,
  } = useFileUpload();

  // Restaura selecciones previas persistidas en localStorage.
  const loadSavedState = useCallback(() => {
    const savedPatientId = localStorage.getItem('lastSelectedPatientId');
    if (savedPatientId) {
      setForm((prev) => ({ ...prev, patient_id: parseInt(savedPatientId) }));
    }

    const savedRecordId = localStorage.getItem('lastSelectedRecordId');
    if (savedRecordId) {
      const id = parseInt(savedRecordId);
      setSelectedRecordId(id);
      fetchFiles(id);
    }
  }, [setForm, setSelectedRecordId, fetchFiles]);

  // Si se llega desde "Pacientes" con ?dni=...&nombre=..., preselecciona.
  const handleURLParams = useCallback(() => {
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
  }, [location.search, patients, setForm]);

  useEffect(() => {
    fetchPatients();
    fetchRecords();
    loadSavedState();
  }, [fetchPatients, fetchRecords, loadSavedState]);

  useEffect(() => {
    handleURLParams();
  }, [handleURLParams]);

  const selectedPatient = patients.find((p) => p.id === form.patient_id);

  const filteredRecords = records
    .filter((r) => {
      if (!searchDNI) return true;
      const patient = patients.find((p) => p.id === r.patient_id);
      return (
        (patient?.dni &&
          normalizeForSearch(patient.dni).includes(normalizeForSearch(searchDNI))) ||
        (patient?.name &&
          normalizeForSearch(patient.name).includes(normalizeForSearch(searchDNI)))
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const { paginatedItems, totalPages, indexOfFirst } = usePagination(
    filteredRecords,
    currentPage,
    ITEMS_PER_PAGE
  );

  const firstShown = filteredRecords.length ? indexOfFirst + 1 : 0;
  const lastShown = Math.min(
    indexOfFirst + ITEMS_PER_PAGE,
    filteredRecords.length
  );

  // Si la página actual supera el total (p. ej. tras filtrar), se reajusta.
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDeleteRecord = async (id) => {
    if (window.confirm('¿Eliminar esta historia clínica?')) {
      try {
        await deleteRecord(id);
        toast.success('Historia clínica eliminada correctamente.');
      } catch (err) {
        toast.error(getApiErrorMessage(err, 'Error al eliminar la historia clínica.'));
      }
    }
  };

  const handleViewFiles = (record) => {
    setSelectedRecordId(record.id);
    fetchFiles(record.id);
    localStorage.setItem('lastSelectedRecordId', record.id);

    // Desplaza la página para dejar visible la sección de archivos (espera a
    // que React renderice la sección tras actualizar selectedRecordId).
    setTimeout(() => {
      filesSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  };

  const handleCloseFiles = () => {
    setSelectedRecordId(null);
    setUploadedFiles([]);
    localStorage.removeItem('lastSelectedRecordId');
  };

  const recordWithFiles = records.find((r) => r.id === selectedRecordId);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Historias Clínicas</h2>

      <RecordForm
        ref={formRef}
        form={form}
        errors={errors}
        editId={editId}
        saving={saving}
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
        onViewFiles={handleViewFiles}
        onViewDetail={(record) => {
          setSelectedRecordDetail(record);
          setShowDetailModal(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDeleteRecord}
      />

      <div className="flex justify-between items-center mb-8 text-sm">
        <p>
          {filteredRecords.length > 0
            ? `Mostrando ${firstShown}–${lastShown} de ${filteredRecords.length} historia(s)`
            : '0 historias'}
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

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
        <div
          ref={filesSectionRef}
          className="scroll-mt-16"
        >
          <FileUploadSection
            recordId={selectedRecordId}
            patientName={recordWithFiles?.patient_name || selectedPatient?.name}
            selectedFile={selectedFile}
            uploadedFiles={uploadedFiles}
            onFileSelect={setSelectedFile}
            onUpload={uploadFile}
            onClose={handleCloseFiles}
          />
        </div>
      )}
    </div>
  );
}
