import DraggableNav from "./DraggableNav";
import Node from "./Node";
import Edge from "./Edge";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useState, useRef, useEffect } from "react";

const getCoords = (nodes, target) => {
  const node = nodes.find((node) => node.val === target);
  return { x: node.x, y: node.y };
};

export default function Canvas({ enableEditMode, nodes }) {
  const NAV_ITEMS = [
    { id: 1, Icon: EditSharpIcon, onClickFunc: enableEditMode },
    {
      id: 2,
      Icon: ShuffleIcon,
      onClickFunc: () => console.log("shuffle Clicked"),
    },
    {
      id: 3,
      Icon: DeleteForeverIcon,
      onClickFunc: () => console.log("DeleteClicked Clicked"),
    },
  ];

  const [isMouseDown, setMouseDown] = useState(false);
  const [cavnasSize, setCanvasSize] = useState({});
  const elementRef = useRef(null);
  useEffect(() => {
    setCanvasSize({
      height: elementRef.current.clientHeight,
      width: elementRef.current.clientWidth,
    });
  }, []);

  return (
    <div
      id="canvas"
      className="canvas"
      ref={elementRef}
      onMouseUp={() => {
        setMouseDown(false);
      }}>
      <DraggableNav
        canvasHeight={cavnasSize.height}
        handleMousedown={() => setMouseDown(true)}
        ismousedown={isMouseDown}
        NAV_ITEMS={NAV_ITEMS}
      />
      <svg
        id="canvas-edit-mode"
        style={{ height: cavnasSize.height, width: cavnasSize.width }}>
        {nodes?.map((node) => {
          return <Node key={node.id} val={node.val} x={node.x} y={node.y} />;
        })}
        {nodes
          .filter((node) => node.childNodes.size > 0)
          .map((node) => {
            return Array.from(node.childNodes).map((child) => {
              const childCoords = getCoords(nodes, child);
              return (
                <Edge
                  key={"" + child.id + node.id}
                  x1={node.x}
                  y1={node.y}
                  x2={childCoords.x}
                  y2={childCoords.y}
                />
              );
            });
          })}
      </svg>
    </div>
  );
}
