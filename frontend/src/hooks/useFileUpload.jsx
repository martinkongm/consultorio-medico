// hooks/useFileUpload.js
import { useCallback, useState } from 'react';
import recordService from '../services/recordService';
import { getApiErrorMessage } from '../services/apiClient';
import { toast } from '../utils/toast';

export function useFileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const fetchFiles = useCallback(async (recordId) => {
    try {
      const data = await recordService.listFiles(recordId);
      setUploadedFiles(data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  }, []);

  const uploadFile = useCallback(async () => {
    if (!selectedFile || !selectedRecordId) return;

    try {
      await recordService.uploadFile(selectedRecordId, selectedFile);
      setSelectedFile(null);
      await fetchFiles(selectedRecordId);
      toast.success('Archivo subido correctamente.');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error(getApiErrorMessage(err, 'Error al subir el archivo'));
    }
  }, [selectedFile, selectedRecordId, fetchFiles]);

  return {
    selectedFile,
    uploadedFiles,
    selectedRecordId,
    setSelectedFile,
    setUploadedFiles,
    setSelectedRecordId,
    fetchFiles,
    uploadFile,
  };
}
