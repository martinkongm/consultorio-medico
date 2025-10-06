
// hooks/useRecords.js
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/records';

export function useRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchRecords();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting record:', err);
      throw err;
    }
  };

  return { records, loading, error, fetchRecords, deleteRecord };
}