import { useCallback } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type Node from "../model/Node";

const useDeleteNodeQueryString = (router: AppRouterInstance) => {
  const deleteNodeQueryString = useCallback(
    (searchParams: string, node: Node) => {
      const name = "node";
      const params = new URLSearchParams(searchParams);
      const values = params.getAll(name);

      if (values.length) {
        params.delete(name);
        for (const value of values) {
          const deserializedObj = JSON.parse(decodeURIComponent(value)) as Node;
          if (node.id !== deserializedObj.id) {
            params.append(name, value);
          }
        }
      }
      const queryString = params.toString();
      router.push(`?${queryString}`);
      return queryString;
    },
    [router],
  );

  return deleteNodeQueryString;
};

export default useDeleteNodeQueryString;
