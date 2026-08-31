import { useEffect, useState } from "react";

export default function useAsyncData(loadData) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrentRequest = true;

    async function load() {
      try {
        const result = await loadData();
        if (isCurrentRequest) {
          setData(result);
          setHasError(false);
        }
      } catch {
        if (isCurrentRequest) {
          setData(null);
          setHasError(true);
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCurrentRequest = false;
    };
  }, [loadData, reloadKey]);

  function retry() {
    setIsLoading(true);
    setHasError(false);
    setReloadKey((key) => key + 1);
  }

  return { data, isLoading, hasError, retry };
}
