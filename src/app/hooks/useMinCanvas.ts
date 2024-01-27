import { useEffect, useState } from "react";
import type Node from "~/app/model/Node";
import { DEFAULT_RADIUS_BIG_CIRCLE } from "../constants/Node";

const useMinCanvas = (nodes: Node[], urlNodes: string[]) => {
  const [minCanvas, setMinCanvas] = useState<{
    minWidth: number;
    minHeight: number;
  }>({
    minWidth: -1,
    minHeight: -1,
  });

  useEffect(() => {
    if (nodes.length === 0) {
      setMinCanvas(getMinCanvas(nodes, urlNodes));
    }
  }, []);

  useEffect(() => {
    const maxX =
      Math.ceil(Math.max(...nodes.map((node) => node.x))) +
      DEFAULT_RADIUS_BIG_CIRCLE;
    const maxY =
      Math.ceil(Math.max(...nodes.map((node) => node.y))) +
      DEFAULT_RADIUS_BIG_CIRCLE;

    setMinCanvas({
      minWidth: Math.max(minCanvas.minWidth, maxX),
      minHeight: Math.max(minCanvas.minHeight, maxY),
    });
  }, [nodes, minCanvas.minWidth, minCanvas.minHeight]);

  return minCanvas;
};

export default useMinCanvas;

const getMinCanvas = (nodes: Node[], urlNodes: string[]) => {
  if (nodes.length === 0 && urlNodes.length > 0) {
    let maxX = -Infinity;
    let maxY = -Infinity;
    urlNodes.forEach((urlNode) => {
      const deserializedObj = JSON.parse(decodeURIComponent(urlNode)) as Node;
      const newNode = deserializedObj;
      maxX = Math.max(maxX, newNode.x);
      maxY = Math.max(maxY, newNode.y);
    });
    return {
      minWidth: Math.ceil(maxX),
      minHeight: Math.ceil(maxY),
    } as { minHeight: number; minWidth: number };
  }
  return { minWidth: -1, minHeight: -1 } as {
    minHeight: number;
    minWidth: number;
  };
};
