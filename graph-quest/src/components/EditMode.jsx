import React, { useState, useCallback } from "react";
import DraggableNav from "./DraggableNav";
import Node from "./Node";
import Edge from "./Edge";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ACTIONS } from "./App.jsx";

export default function EditMode({ enableEditMode, dispatch, nodes }) {
  const [count, setCount] = useState(0);
  const [measureMode, setMeasureMode] = useState({});
  const [isMouseDown, setMouseDown] = useState(false);
  const [activeNode, setActiveNode] = useState(-1);

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
    const { className, textContent } = target;
    console.log(className, x, y);
    if (className !== "canvas-edit" && className !== "innerNode") {
      return;
    }
    if (className === "innerNode") {
      const clickedNode = parseInt(textContent);
      if (activeNode === -1) {
        setActiveNode(clickedNode);
      } else if (activeNode === clickedNode) {
        setActiveNode(-1);
      } else if (activeNode !== -1 && clickedNode) {
        console.log(clickedNode);
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

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setMeasureMode({
        height: node.getBoundingClientRect().height,
        top: node.getBoundingClientRect().top,
        left: node.getBoundingClientRect().left,
      });
    }
  }, []);

  return (
    <div
      id="editMode"
      className="canvas-edit"
      ref={measuredRef}
      onMouseDown={(e) => {
        handleNode(e);
      }}
      onMouseUp={() => {
        setMouseDown(false);
      }}>
      <DraggableNav
        canvasHeight={measureMode.height}
        handleMousedown={() => setMouseDown(true)}
        ismousedown={isMouseDown}
        NAV_ITEMS={NAV_ITEMS}
      />
      {nodes?.map((node) => {
        return (
          <Node
            key={node.id}
            val={node.val}
            x={node.x}
            y={node.y}
            handleNode={handleNode}
            curActiveNode={activeNode}
          />
        );
      })}
      <br></br>
      {nodes?.length}
      <br></br>
      {nodes?.map((node) => {
        return (
          <>
            {node.val} {node.x} {node.y}
            <br></br>
          </>
        );
      })}
      {/* <Edge /> */}
    </div>
  );
}
