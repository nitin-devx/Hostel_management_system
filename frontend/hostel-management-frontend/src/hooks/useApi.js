import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Generic hook that wraps an async API call with loading + error handling.
 *
 * Usage:
 *   const { data, loading, execute } = useApi(roomApi.getAll);
 *   useEffect(() => execute(), []);
 */
const useApi = (apiFn, { onSuccess, onError, successMessage } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFn(...args);
        const result = res.data?.data ?? res.data;
        setData(result);
        if (successMessage) toast.success(successMessage);
        if (onSuccess) onSuccess(result);
        return result;
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Something went wrong';
        setError(msg);
        toast.error(msg);
        if (onError) onError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFn, successMessage, onSuccess, onError]
  );

  return { data, loading, error, execute };
};

export default useApi;
