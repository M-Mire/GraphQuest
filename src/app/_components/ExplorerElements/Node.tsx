import { forwardRef, memo, useMemo } from "react";
import type { GridNode } from "~/app/types";
import HikingIcon from "@mui/icons-material/Hiking";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { AlgorithmEnum } from "~/app/_pageConfigs/configExplorer";

interface NodeProps {
  node: GridNode;
  handleMouseDown: (row: number, col: number) => void;
  handleMouseMove: (row: number, col: number) => void;
  handleMouseUp: () => void;
  startNode: GridNode;
  endNode: GridNode;
  isMovedWhilstAnimated: boolean;
  isWeight: boolean;
}

const Node = forwardRef<HTMLElement, NodeProps>(
  (
    {
      node,
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      startNode,
      endNode,
      isMovedWhilstAnimated,
      isWeight,
    }: NodeProps,
    ref,
  ) => {
    const { type, isBlock, row, col, isCost } = node;
    const isStartNode = startNode.row === row && startNode.col === col;
    const isEndNode = endNode.row === row && endNode.col === col;

    const iconSize = "100%";

    const nodeClassName = `h-6 w-6 border-2 border-zinc-50 flex items-center justify-center ${
      isStartNode && type !== "shortestPath" && type !== "visited"
        ? "bg-green-500 node-start"
        : isEndNode && type !== "shortestPath" && type !== "visited"
        ? "bg-red-500"
        : isBlock
        ? "node-block"
        : (isStartNode || isEndNode) && type === "shortestPath"
        ? "bg-red-300 node-shortest-path" // Lighter shade different from the shortestPath
        : type === "shortestPath"
        ? `bg-purple-300 ${!isMovedWhilstAnimated ? "node-shortest-path" : ""}`
        : type === "visited"
        ? `bg-blue-500 ${!isMovedWhilstAnimated ? "node-visited" : ""}`
        : isCost && isWeight
        ? "bg-yellow-500"
        : ""
    }`;

    const memoizedNode = useMemo(
      () => (
        <div
          id={`node-elem-${row}-${col}`}
          ref={ref as React.RefObject<HTMLDivElement>}
          className={nodeClassName}
          onMouseDown={() => handleMouseDown(row, col)}
          onMouseMove={() => handleMouseMove(row, col)}
          onMouseUp={handleMouseUp}
        >
          {isStartNode && (
            <HikingIcon style={{ width: iconSize, height: iconSize }} />
          )}
          {isEndNode && (
            <LocationOnIcon style={{ width: iconSize, height: iconSize }} />
          )}
          {isCost && !isStartNode && !isEndNode && !isBlock && isWeight && (
            <FitnessCenterIcon style={{ width: iconSize, height: iconSize }} />
          )}
        </div>
      ),
      [
        nodeClassName,
        row,
        col,
        isStartNode,
        isEndNode,
        iconSize,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
      ],
    );

    return memoizedNode;
  },
);
Node.displayName = "Node";

export default memo(Node, (prevProps, nextProps) => {
  return (
    prevProps.node.type === nextProps.node.type &&
    prevProps.node.isBlock === nextProps.node.isBlock &&
    prevProps.isMovedWhilstAnimated === nextProps.isMovedWhilstAnimated
  );
});
