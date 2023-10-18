import Node from "./Node";
import Edge from "./Edge";
import { useState, useRef, useEffect } from "react";
const getCoords = (nodes, target) => {
  const node = nodes.find((node) => node.val === target);
  return { x: node.x, y: node.y };
};
export default function Canvas({ enableEditMode, nodes }) {
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
              visited={node.visited}
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
