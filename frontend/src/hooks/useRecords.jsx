// hooks/useRecords.js
import { useCallback, useState } from 'react';
import recordService from '../services/recordService';

export function useRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recordService.list();
      setRecords(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecord = useCallback(
    async (id) => {
      try {
        await recordService.remove(id);
        await fetchRecords();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting record:', err);
        throw err;
      }
    },
    [fetchRecords]
  );

  return { records, loading, error, fetchRecords, deleteRecord };
}
