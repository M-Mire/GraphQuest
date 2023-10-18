import React, { useState, useRef, useEffect } from "react";
import Node from "./Node";
import Edge from "./Edge";
import { ACTIONS } from "./App.jsx";

const getCoords = (nodes, target) => {
  const node = nodes.find((node) => node.val === target);
  return { x: node.x, y: node.y };
};

export default function EditMode({
  enableEditMode,
  dispatch,
  nodes,
  nodeCount,
  incrementNodeCount,
}) {
  const [count, setCount] = useState(0);
  const [isMouseDown, setMouseDown] = useState(false);
  const [activeNode, setActiveNode] = useState(-1);
  const [cavnasSize, setCanvasSize] = useState({});
  const elementRef = useRef(null);
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
      payload: { x: node_x, y: node_y, val: nodeCount, childNode: {} },
    });
    incrementNodeCount();
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
            return Array.from(node.childNodes).map((child, id) => {
              const childCoords = getCoords(nodes, child);
              return (
                <Edge
                  key={id}
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
