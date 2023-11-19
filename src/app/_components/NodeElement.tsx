import { useState } from "react";
import { Command } from "../_GraphAlgorithm/Graph";

export interface Node {
  id: number;
  val: number;
  x: number;
  y: number;
  visited: boolean;
  visitedChildrens: boolean;
  childNodes: Set<number>;
  distances: Map<number, number>;
  currentlyVisitedPair: boolean;
}

interface NodeElementProps {
  node: Node;
  activeNode?: number;
}

const NodeElement: React.FC<NodeElementProps> = ({ node, activeNode }) => {
  const [isClicked, setClicked] = useState<boolean>(false);
  const RECT = 70;
  return (
    <>
      <rect
        name={"" + node.val}
        x={node.x - RECT / 2}
        y={node.y - RECT / 2}
        height={RECT}
        width={RECT}
        fill="transparent"
      ></rect>
      <circle
        name={"" + node.val}
        cx={node.x}
        cy={node.y}
        r="16"
        fill={COLOUR_SELECTION(isClicked, node.visited, node.visitedChildrens)}
      />
      <circle
        name={"" + node.val}
        cx={node.x}
        cy={node.y}
        r="18"
        stroke="black"
        strokeWidth="3"
        fill={COLOUR_SELECTION(isClicked, node.visited, node.visitedChildrens)}
        onMouseDown={() => {
          if (activeNode === -1 || activeNode === node.val) {
            setClicked(!isClicked);
          }
        }}
      />
      <text
        name={"" + node.val}
        x={node.x}
        y={node.y + 5.333333}
        fontSize="16"
        fill="black"
        textAnchor="middle"
        className="no-select"
        onMouseDown={() => {
          if (activeNode === -1 || activeNode === node.val) {
            setClicked(!isClicked);
          }
        }}
      >
        {node.val}
      </text>
    </>
  );
};

export default NodeElement;

export function newNode(x: number, y: number, count: number): Node {
  return {
    id: Date.now(),
    val: count,
    x: x,
    y: y,
    visited: false,
    visitedChildrens: false,
    childNodes: new Set(),
    distances: new Map(),
    currentlyVisitedPair: false,
  };
}

export const ACTIONS_NODE = {
  ADD_NODE: "ADD_NODE",
  ADD_CHILD_NODE: "ADD_CHILD_NODE",
  NODE_ANIMATE: "NODE_ANIMATE",
  NODE_RESET: "NODE_RESET",
  NODE_DISTANCE: "NODE_DISTANCE",
};
export type ActionNode = {
  type: string;
  payload:
    | {
        parentNode: number;
        childNode: number;
      }
    | {
        value: number | Map<number, number> | number[];
        command: Command;
      }
    | {
        node: Node;
        childNode: number;
        parsedDistance: number;
      }
    | number
    | Node;
};

export const COLOUR_SELECTION = (
  isClicked: boolean,
  visited: boolean,
  visitedChildrens: boolean,
) => {
  return isClicked
    ? "blue"
    : visited
    ? visitedChildrens
      ? "grey"
      : "purple"
    : "none";
};

export function updateVisitedChildrens(node: Node, newValue: boolean) {
  node.visitedChildrens = newValue;
}
