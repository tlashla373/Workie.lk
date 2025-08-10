import { useEffect, useState } from 'react';
import apiService from '../services/apiService.js';

export default function ApiTester() {
  const [status, setStatus] = useState('Checking backend...');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiService.get('/health', { includeAuth: false });
        if (!cancelled) setStatus(res?.message || 'Backend OK');
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="p-2 text-xs rounded border inline-block mt-2">
      {error ? <span className="text-red-600">Backend error: {error}</span> : <span className="text-green-600">{status}</span>}
    </div>
  );
}
