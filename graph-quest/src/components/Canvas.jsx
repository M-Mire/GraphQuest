import DraggableNav from "./DraggableNav";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useState, useCallback } from "react";

export default function Canvas({ enableEditMode }) {
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
        NAV_ITEMS={NAV_ITEMS}
      />
    </div>
  );
}
