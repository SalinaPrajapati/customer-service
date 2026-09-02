import { useCallback, useState } from "react";
import type { ApiError } from "../types/domain";


export const useAsync = <T>() => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<ApiError>();
  const [loading, setLoading] = useState(false);
  const execute = useCallback(async (operation: () => Promise<T>) => {
    setLoading(true);
    setError(undefined);
    try {
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      setError(err as ApiError);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);
  return { data, error, loading, execute, setData };
};
