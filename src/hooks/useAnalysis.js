import { useState } from 'react';
import { fetchReport } from '../services/api';

export function useAnalysis() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  const analyze = async (handle) => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Initializing...');
    setData(null);

    try {
      const result = await fetchReport(handle, (msg) => setLoadingMessage(msg));
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, loadingMessage, analyze };
}
