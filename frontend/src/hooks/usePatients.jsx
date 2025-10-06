// hooks/usePatients.js
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/patients';

export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      setPatients(res.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchPatients();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting patient:', err);
      throw err;
    }
  };

  return { patients, loading, error, fetchPatients, deletePatient };
}

