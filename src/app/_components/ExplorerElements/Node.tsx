import { memo } from "react";
import { GridNode, NodeType } from "~/app/types";
import HikingIcon from "@mui/icons-material/Hiking";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface NodeProps {
  node: GridNode;
  handleMouseDown: (row: number, col: number) => void;
  handleMouseMove: (row: number, col: number) => void;
  handleMouseUp: () => void;
  startNode: GridNode;
  endNode: GridNode;
}

const Node = memo(
  ({
    node,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    startNode,
    endNode,
  }: NodeProps) => {
    const { type, isBlock, row, col } = node;

    const isStartNode = startNode.row === row && startNode.col === col;
    const isEndNode = endNode.row === row && endNode.col === col;

    const iconSize = "100%";

    const nodeClassName = `h-8 w-8 border-2 border-zinc-50 flex items-center justify-center ${
      isStartNode && type !== "shortestPath" && type !== "visited"
        ? "bg-green-500 node-start"
        : isStartNode && type === "shortestPath"
        ? "bg-red-300 node-shortest-path"
        : isEndNode && type !== "shortestPath" && type !== "visited"
        ? "bg-red-500"
        : isBlock
        ? "node-block"
        : type === "visited"
        ? "bg-blue-500 node-visited"
        : type === "shortestPath"
        ? "bg-red-300 node-shortest-path"
        : ""
    }`;

    return (
      <div
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
