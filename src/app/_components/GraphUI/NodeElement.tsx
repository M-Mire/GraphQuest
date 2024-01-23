import { useState } from "react";
import type { Command } from "../../_GraphAlgorithm/Graph";
import {
  DEFAULT_RECTANGLE_SIZE,
  DEFAULT_RADIUS_SMALL_CIRCLE,
  DEFAULT_RADIUS_BIG_CIRCLE,
  DEFAULT_NODE_PROCESSED_COLOUR,
  DEFAULT_NODE_VISITED_COLOUR,
  DEFAULT_NODE_CLICKED_COLOUR,
  DEFAULT_NODE_COLOUR,
} from "~/app/constants/Node/index";
import type Node from "~/app/model/Node";

interface NodeElementProps {
  node: Node;
  activeNode?: number;
}

const NodeElement: React.FC<NodeElementProps> = ({ node, activeNode }) => {
  const [isClicked, setClicked] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent) => {
    if (e.button === 2) {
      return;
    }
    if (activeNode === -1 || activeNode === node.val) {
      setClicked(!isClicked);
    }
  };

  return (
    <>
      <rect
        name={"" + node.val}
        x={node.x - DEFAULT_RECTANGLE_SIZE / 2}
        y={node.y - DEFAULT_RECTANGLE_SIZE / 2}
        height={DEFAULT_RECTANGLE_SIZE}
        width={DEFAULT_RECTANGLE_SIZE}
        fill="none"
      ></rect>
      <circle
        data-testid={`node-${node.val}`}
        name={"node-circle-" + node.val}
        cx={node.x}
        cy={node.y}
        r={DEFAULT_RADIUS_SMALL_CIRCLE}
        fill={COLOUR_SELECTION(isClicked, node.visited, node.visitedChildrens)}
      />
      <circle
        name={"" + node.val}
        cx={node.x}
        cy={node.y}
        r={DEFAULT_RADIUS_BIG_CIRCLE}
        stroke="black"
        strokeWidth="3"
        fill={COLOUR_SELECTION(isClicked, node.visited, node.visitedChildrens)}
        onMouseDown={(e) => {
          handleClick(e);
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
        onMouseDown={(e) => {
          handleClick(e);
        }}
      >
        {node.val}
      </text>
    </>
  );
};

export default NodeElement;

export const ACTIONS_NODE = {
  ADD_NODE: "ADD_NODE",
  ADD_CHILD_NODE: "ADD_CHILD_NODE",
  NODE_ANIMATE: "NODE_ANIMATE",
  NODE_RESET: "NODE_RESET",
  NODE_DISTANCE: "NODE_DISTANCE",
  DELETE_NODE: "DELETE_NODE",
  UPDATE_COORDS: "UPDATE_COORDS",
  CHANGE_NODE_WEIGHT: "CHANGE_NODE_WEIGHT",
  DELETE_ALL: "DELETE_ALL",
  TEST_NODE_DIAGNOSTIC: "TEST_NODE_DIAGNOSTIC",
};
export type ActionNode = {
  type: string;
  payload:
    | {
        parentNode: number;
        childNode: number;
        weight: number;
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
    | {
        val: number;
        x: number;
        y: number;
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
    ? DEFAULT_NODE_CLICKED_COLOUR
    : visited
    ? visitedChildrens
      ? DEFAULT_NODE_VISITED_COLOUR
      : DEFAULT_NODE_PROCESSED_COLOUR
    : DEFAULT_NODE_COLOUR;
};

export function updateVisitedChildrens(node: Node, newValue: boolean) {
  node.visitedChildrens = newValue;
}
