import { useState, memo } from "react";
import type { Command } from "../../_GraphAlgorithm/Graph";
import {
  DEFAULT_RADIUS_SMALL_CIRCLE,
  DEFAULT_RADIUS_BIG_CIRCLE,
  DEFAULT_NODE_ROOT_STROKE_COLOUR,
} from "~/app/constants/Node/index";
import { getNodeColour } from "~/app/utils/getNodeColour";
import type Node from "~/app/model/Node";
import { useThemeContext } from "~/app/context/ThemeContext";
import { Theme } from "~/app/types";
import { useSearchParams } from "next/navigation";
import convertToLetter from "~/app/utils/convertToLetter";

interface NodeElementProps {
  node: Node;
  activeNode?: number;
  rootValue?: number | null;
}

const NodeElement: React.FC<NodeElementProps> = memo(
  ({ node, activeNode, rootValue }) => {
    const [isClicked, setClicked] = useState<boolean>(false);
    const { theme } = useThemeContext();
    const searchParams = useSearchParams();
    const isLetter = searchParams?.get("lettered") === "true";
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
        <circle
          data-testid={`node-${node.val}`}
          name={"node-circle-" + node.val}
          cx={node.x}
          cy={node.y}
          r={DEFAULT_RADIUS_SMALL_CIRCLE}
          fill={getNodeColour(isClicked, node.visited, node.visitedChildrens)}
        />
        <circle
          name={"" + node.val}
          cx={node.x}
          cy={node.y}
          r={DEFAULT_RADIUS_BIG_CIRCLE}
          stroke={
            rootValue === node.val
              ? DEFAULT_NODE_ROOT_STROKE_COLOUR
              : theme.background.quaternary
          }
          strokeWidth="3"
          fill={getNodeThemeColour(
            isClicked,
            node.visited,
            node.visitedChildrens,
            theme,
          )}
          onMouseDown={(e) => {
            handleClick(e);
          }}
        />
        <text
          name={"" + node.val}
          x={node.x}
          y={node.y + 5.333333}
          fontSize="16"
          fill={theme.text.secondary}
          textAnchor="middle"
          className="no-select"
          onMouseDown={(e) => {
            handleClick(e);
          }}
        >
          {isLetter ? convertToLetter(node.val) : node.val}
        </text>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.node === nextProps.node &&
      prevProps.activeNode === nextProps.activeNode &&
      prevProps.rootValue === nextProps.rootValue
    );
  },
);

NodeElement.displayName = "NodeElement";

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
  REMOVE_CHILD_NODE: "REMOVE_CHILD_NODE",
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
    | {
        parent: number;
        childRemove: number;
      }
    | { deleteId: string }
    | number
    | Node;
};

const getNodeThemeColour = (
  isClicked: boolean,
  visited: boolean,
  visitedChildrens: boolean,
  currentTheme: Theme,
) => {
  return isClicked
    ? currentTheme.node.active
    : visited
    ? visitedChildrens
      ? currentTheme.node.completed
      : currentTheme.node.visited
    : currentTheme.node.unvisited;
};
