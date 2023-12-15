import { useCallback } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Node from "../model/Node";

const useUpdateNodeQueryString = (router: AppRouterInstance) => {
  const updateNodeQueryString = useCallback(
    (searchParams: string, node: Node, valueToAdd: string) => {
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

      const encodeNode = valueToAdd;
      params.append(name, encodeNode);
      const queryString = params.toString();
      router.push(`?${queryString}`);
      return queryString;
    },
    [router],
  );

  return updateNodeQueryString;
};

export default useUpdateNodeQueryString;
