// hooks/useFileUpload.js
import { useState } from 'react';
import axios from 'axios';

export function useFileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  const fetchFiles = async (recordId) => {
    try {
      const res = await axios.get(`http://localhost:3001/api/records/${recordId}/files`);
      setUploadedFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile || !selectedRecordId) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(
        `http://localhost:3001/api/records/${selectedRecordId}/upload`,
        formData
      );
      setSelectedFile(null);
      await fetchFiles(selectedRecordId);
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Error al subir el archivo');
    }
  };

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