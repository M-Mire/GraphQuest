import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { calculateNewNodePosition } from "~/app/utils/calculateNewNodePosition";
import type Node from "~/app/model/Node";
import { ACTIONS_NODE } from "~/app/_components/GraphUI/NodeElement";
import type { ActionNode } from "~/app/_components/GraphUI/NodeElement";
import useDeleteNodeQueryString from "~/app/hooks/useDeleteNodeQueryString";
import useUpdateNodeQueryString from "~/app/hooks/useUpdateNodeQueryString";
import updateNodeCoordEncoded from "~/app/utils/EncodeNode/updateNodeCoordEncoded";

const CTX_WIDTH = 150;
const CTX_HEIGHT = 80;

interface ContextMenuProps {
  node: Node;
  dispatch: React.Dispatch<ActionNode>;
  setCtxMenu: React.Dispatch<React.SetStateAction<number>>;
  setMoveNode: React.Dispatch<React.SetStateAction<boolean>>;
  isCtxMenu: number;
  nodes: Node[];
  elementRef: React.MutableRefObject<HTMLDivElement | null>;
  minCanvas: { minHeight: number; minWidth: number };
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  node,
  dispatch,
  setMoveNode,
  setCtxMenu,
  isCtxMenu,
  elementRef,
  minCanvas,
}) => {
  const [canvasBounds, setCanvasBounds] = useState<{
    xBound: number;
    yBound: number;
  }>({ xBound: -1, yBound: -1 });

  useEffect(() => {
    if (elementRef?.current) {
      const bound = elementRef.current.getBoundingClientRect();
      setCanvasBounds({
        xBound: Math.max(bound.width, minCanvas.minWidth),
        yBound: Math.max(bound.height, minCanvas.minHeight),
      });
    }
  }, []);

  const { x: xNode, y: yNode } = node;
  const y =
    yNode + CTX_HEIGHT > canvasBounds.yBound ? yNode - CTX_HEIGHT : yNode;
  const x = xNode + CTX_WIDTH > canvasBounds.xBound ? xNode - CTX_WIDTH : xNode;
  const [hoveredText, setHoveredText] = useState<string | null>(null);
  const router = useRouter();
  const deleteNodeQueryString = useDeleteNodeQueryString(router);
  const updateNodeQueryString = useUpdateNodeQueryString(router);
  const searchParams = useSearchParams();
  const handleDelete = () => {
    deleteNodeQueryString(searchParams.toString(), node);
    dispatch({
      type: ACTIONS_NODE.DELETE_NODE,
      payload: node,
    });
  };

  const handleMove = () => {
    setMoveNode(true);
    const handleMouseMove = (event: MouseEvent) => {
      const { node_x, node_y } = calculateNewNodePosition(
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

    const handleMouseUp = (event: MouseEvent) => {
      const { node_x, node_y } = calculateNewNodePosition(
        event.clientX,
        event.clientY,
        elementRef,
      ) as {
        node_x: number;
        node_y: number;
      };
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      setMoveNode(false);
      setCtxMenu(-1);
      updateNodeQueryString(
        searchParams.toString(),
        node,
        updateNodeCoordEncoded(node, node_x, node_y),
      );
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
          width={CTX_WIDTH}
          height={CTX_HEIGHT}
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
          width={CTX_WIDTH - 10}
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
          width={CTX_WIDTH - 10}
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
