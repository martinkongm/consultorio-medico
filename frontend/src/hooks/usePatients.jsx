// hooks/usePatients.js
import { useCallback, useState } from 'react';
import patientService from '../services/patientService';

export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.list();
      setPatients(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePatient = useCallback(
    async (id) => {
      try {
        await patientService.remove(id);
        await fetchPatients();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting patient:', err);
        throw err;
      }
    },
    [fetchPatients]
  );

  return { patients, loading, error, fetchPatients, deletePatient };
}
