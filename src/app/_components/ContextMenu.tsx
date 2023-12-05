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

  const handleMove = () => {
    const handleMouseMove = (event: MouseEvent) => {
      console.log("x:", event.clientX, "y:", event.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mouseup", handleMouseUp);
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
          key={`rect-${node.val}`}
          width={150}
          height={80}
          fill={`bg-AtomDark`}
          fillOpacity={0.8}
          rx={15}
          stroke="white"
          strokeWidth={3}
        />
        <rect
          key={`rectDelete-${node.val}`}
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
          key={`textDelete-${node.val}`}
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
          key={`rectMove<-${node.val}`}
          x={5}
          y={7}
          width={140}
          height={16}
          {...getRectStyles("Move Node")}
          onMouseEnter={() => handleTextHover("Move Node")}
          onMouseLeave={handleTextLeave}
          onClick={handleMove}
          rx={2}
        />
        <text
          key={`textMove-${node.val}`}
          x={10}
          y={20}
          fill="white"
          onMouseEnter={() => handleTextHover("Move Node")}
          onMouseLeave={handleTextLeave}
          onClick={handleMove}
        >
          Move Node
        </text>
      </g>
    </>
  );
};

export default ContextMenu;
