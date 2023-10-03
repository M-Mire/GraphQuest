import React, { useState, useCallback } from "react";
import DraggableNavEdit from "./DraggableNav";
export default function EditMode({ enableEditMode }) {
  const [height, setHeight] = useState(0);
  const [isMouseDown, setMouseDown] = useState(false);
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  return (
    <div id="editMode" className="canvas-edit" ref={measuredRef}>
      <DraggableNavEdit
        canvasHeight={height}
        handleMousedown={() => setMouseDown(true)}
        ismousedown={isMouseDown}
        enableEditMode={enableEditMode}
      />
    </div>
  );
}
