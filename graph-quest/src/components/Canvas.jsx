import DraggableNav from "./DraggableNav";
import React, { useState, useCallback } from "react";

export default function Canvas({ enableEditMode }) {
  const [height, setHeight] = useState(0);
  const [isMouseDown, setMouseDown] = useState(false);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div
      id="canvas"
      className="canvas"
      ref={measuredRef}
      onMouseUp={() => {
        setMouseDown(false);
      }}>
      <DraggableNav
        canvasHeight={height}
        handleMousedown={() => setMouseDown(true)}
        ismousedown={isMouseDown}
        enableEditMode={enableEditMode}
      />
    </div>
  );
}
