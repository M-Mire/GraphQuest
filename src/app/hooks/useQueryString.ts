import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

const useQueryString = () => {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.append(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name);
      return params.toString();
    },
    [searchParams],
  );

  return { createQueryString, deleteQueryString };
};

export default useQueryString;
