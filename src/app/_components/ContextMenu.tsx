import React, { useState } from "react";

import NodeElement, {
  ACTIONS_NODE,
  ActionNode,
  newNode,
  Node,
} from "~/app/_components/NodeElement";

interface ContextMenuProps {
  node: Node;
  dispatch: React.Dispatch<ActionNode>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ node, dispatch }) => {
  const { x, y } = node;
  const [hoveredText, setHoveredText] = useState<string | null>(null);

  const handleDelete = () => {
    dispatch({
      type: ACTIONS_NODE.DELETE_NODE,
      payload: node,
    });
  };

  const handleTextHover = (text: string) => {
    setHoveredText(text);
  };

  const handleTextLeave = () => {
    setHoveredText(null);
  };

  const getRectStyles = (text: string) => {
    if (text === hoveredText) {
      return {
        stroke: "blue",
        strokeWidth: 2,
        fillOpacity: 0.4,
      };
    }
    return {
      fill: "transparent",
      stroke: "transparent",
      strokeWidth: 0,
    };
  };

  return (
    <>
      <g transform={`translate(${x}, ${y})`}>
        <rect
          key={`rect-test`}
          width={150}
          height={80}
          fill={`bg-AtomDark`}
          fillOpacity={0.8}
          rx={15}
          stroke="white"
          strokeWidth={3}
        />
        <rect
          x={5}
          y={37}
          width={140}
          height={16}
          {...getRectStyles("Delete Node")}
          onMouseEnter={() => handleTextHover("Delete Node")}
          onMouseLeave={handleTextLeave}
          rx={2}
          onClick={handleDelete}
        />
        <text
          x={10}
          y={50}
          fill="white"
          onMouseEnter={() => handleTextHover("Delete Node")}
          onMouseLeave={handleTextLeave}
          onClick={handleDelete}
        >
          Delete Node
        </text>
        <rect
          x={5}
          y={7}
          width={140}
          height={16}
          {...getRectStyles("Move Node")}
          onMouseEnter={() => handleTextHover("Move Node")}
          onMouseLeave={handleTextLeave}
          rx={2}
        />
        <text
          x={10}
          y={20}
          fill="white"
          onMouseEnter={() => handleTextHover("Move Node")}
          onMouseLeave={handleTextLeave}
        >
          Move Node
        </text>
      </g>
    </>
  );
};

export default ContextMenu;
