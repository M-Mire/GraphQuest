import { forwardRef, memo } from "react";
import type { GridNode } from "~/app/types";
import HikingIcon from "@mui/icons-material/Hiking";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface NodeProps {
  node: GridNode;
  handleMouseDown: (row: number, col: number) => void;
  handleMouseMove: (row: number, col: number) => void;
  handleMouseUp: () => void;
  startNode: GridNode;
  endNode: GridNode;
  isMovedWhilstAnimated: boolean;
  // forwardedRef: React.MutableRefObject<null>;
}

const Node = memo(
  ({
    node,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    startNode,
    endNode,
    isMovedWhilstAnimated,
  } // forwardedRef,
  : NodeProps) => {
    const { type, isBlock, row, col } = node;
    const isStartNode = startNode.row === row && startNode.col === col;
    const isEndNode = endNode.row === row && endNode.col === col;

    const iconSize = "100%";

    const nodeClassName = `h-6 w-6 border-2 border-zinc-50 flex items-center justify-center ${
      isStartNode && type !== "shortestPath" && type !== "visited"
        ? "bg-green-500 node-start"
        : isStartNode && type === "shortestPath"
        ? "bg-red-300 node-shortest-path"
        : isEndNode && type !== "shortestPath" && type !== "visited"
        ? "bg-red-500"
        : isBlock
        ? "node-block"
        : type === "visited"
        ? `bg-blue-500 ${!isMovedWhilstAnimated ? "node-visited" : ""}`
        : type === "shortestPath"
        ? `bg-purple-300 ${!isMovedWhilstAnimated ? "node-shortest-path" : ""}`
        : ""
    }`;

    return (
      <div
        id={`node-elem-${row}-${col}`}
        // ref={forwardedRef}
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
      </div>
    );
  },
);

Node.displayName = "Node";

export default Node;
