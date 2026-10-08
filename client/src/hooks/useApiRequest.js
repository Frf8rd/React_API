
import { useState, useCallback, useRef } from "react";


export function useApiRequest() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 


  const requestIdRef = useRef(0);

  const execute = useCallback(async (apiFn, ...args) => {
    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFn(...args);


      if (currentRequestId !== requestIdRef.current) return;

      setData(result);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;

      if (err && err.name === "ApiError") {
        setError(err);
      } else {
      
        console.error(err);
        setError({ name: "ApiError", status: null, message: "A apărut o eroare neașteptată." });
      }
      setData(null);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  return { data, loading, error, execute };
}