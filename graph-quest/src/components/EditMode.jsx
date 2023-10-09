import React, { useState, useRef, useEffect } from "react";
import DraggableNav from "./DraggableNav";
import Node from "./Node";
import Edge from "./Edge";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ACTIONS } from "./App.jsx";

const getCoords = (nodes, target) => {
  const node = nodes.find((node) => node.val === target);
  return { x: node.x, y: node.y };
};

export default function EditMode({ enableEditMode, dispatch, nodes }) {
  const [count, setCount] = useState(0);
  const [isMouseDown, setMouseDown] = useState(false);
  const [activeNode, setActiveNode] = useState(-1);
  const [cavnasSize, setCanvasSize] = useState({});
  const elementRef = useRef(null);

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
  function handleNode(e) {
    // True Coordinate for x,y
    const { pageX: x, pageY: y, target } = e;
    const { nodeName } = target;
    const textContent = target.getAttribute("name");
    if (nodeName !== "svg" && nodeName !== "circle" && nodeName !== "text") {
      return;
    }
    if (nodeName === "circle" || nodeName === "text") {
      const clickedNode = parseInt(textContent);
      if (activeNode === -1) {
        setActiveNode(clickedNode);
      } else if (activeNode === clickedNode) {
        setActiveNode(-1);
      } else if (activeNode !== -1 && clickedNode >= 0) {
        dispatch({
          type: ACTIONS.ADD_CHILD_NODE,
          payload: { parentNode: activeNode, childNode: clickedNode },
        });
      }
      return;
    }
    // DISPATCH TO ADD A NEW NOD
    const rect = document.getElementById("editMode").getBoundingClientRect();
    const node_x = x - rect.left + window.scrollX;
    const node_y = y - rect.top + window.scrollY;
    dispatch({
      type: ACTIONS.ADD_NODE,
      payload: { x: node_x, y: node_y, val: count, childNode: {} },
    });
    setCount(count + 1);
    return;
  }

  useEffect(() => {
    setCanvasSize({
      height: elementRef.current.clientHeight,
      width: elementRef.current.clientWidth,
    });
  }, []);

  return (
    <div
      id="editMode"
      className="canvas-edit"
      ref={elementRef}
      onMouseDown={(e) => {
        handleNode(e);
      }}
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
          return (
            <Node
              key={node.id}
              val={node.val}
              x={node.x}
              y={node.y}
              curActiveNode={activeNode}
            />
          );
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
