import React, { useState } from "react";
import { getCoords } from "~/app/utils/getCoords";
import Node from "~/app/model/Node";
import NodeElement, {
  ACTIONS_NODE,
  ActionNode,
} from "~/app/_components/GraphUI/NodeElement";

interface ContextMenuProps {
  node: Node;
  dispatch: React.Dispatch<ActionNode>;
  setCtxMenu: React.Dispatch<React.SetStateAction<number>>;
  setMoveNode: React.Dispatch<React.SetStateAction<boolean>>;
  isCtxMenu: number;
  nodes: Node[];
  elementRef: React.MutableRefObject<HTMLDivElement | null>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  node,
  dispatch,
  setMoveNode,
  setCtxMenu,
  isCtxMenu,
  elementRef,
}) => {
  const { x, y } = node;
  const [hoveredText, setHoveredText] = useState<string | null>(null);

  const handleDelete = () => {
    dispatch({
      type: ACTIONS_NODE.DELETE_NODE,
      payload: node,
    });
  };

  const handleMove = () => {
    setMoveNode(true);
    const handleMouseMove = (event: MouseEvent) => {
      const rect = elementRef.current!.getBoundingClientRect();

      const { node_x, node_y } = getCoords(
        event.clientX,
        event.clientY,
        elementRef,
      ) as {
        node_x: number;
        node_y: number;
      };
      dispatch({
        type: ACTIONS_NODE.UPDATE_COORDS,
        payload: {
          val: isCtxMenu,
          x: node_x,
          y: node_y,
        },
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setMoveNode(false);
      setCtxMenu(-1);
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
