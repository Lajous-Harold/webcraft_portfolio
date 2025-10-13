import { useEffect, useState } from "react";

/**
 * Hook de chargement JSON avec gestion d'erreur et état.
 * @param {string} url
 */
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (e) {
        if (!ignore) setError(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (url) run();
    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, loading, error };
}
