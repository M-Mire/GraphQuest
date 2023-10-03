import AddIcon from "@mui/icons-material/Add";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState, useRef } from "react";

export default function DraggableNav(props) {
  const [isDragNavOpen, toggleDragNav] = useState(false);

  const ref = useRef(null);
  //   const [props.ismousedown, setMouseDown] = useState(false);

  function onDrag({ movementY }) {
    const navStyle = window.getComputedStyle(ref.current),
      navTop = parseInt(navStyle.top),
      navHeight = parseInt(navStyle.height);

    ref.current.style.top = navTop > 0 ? `${navTop + movementY}px` : "1px";
    if (navTop > props.canvasHeight - navHeight) {
      ref.current.style.top = `${props.canvasHeight - navHeight}px`;
    }
  }

  return (
    <>
      {props.canvasHeight}
      <nav
        ref={ref}
        className={isDragNavOpen ? "openDragNav" : null}
        style={{
          top: props.canvasHeight ? (props.canvasHeight - 300) / 2 : "60px",
        }}>
        <div className="nav-content">
          <div
            className="toggle-btn"
            onMouseDown={() => {
              props.handleMousedown();
            }}
            onMouseMove={(e) => {
              if (props.ismousedown) onDrag(e);
            }}
            onClick={() => {
              toggleDragNav(!isDragNavOpen);
            }}>
            <div className="a">
              <AddIcon />
            </div>
          </div>
          <span style={{ "--i": 1 }}>
            <div
              className="a"
              onClick={() => {
                props.enableEditMode();
              }}>
              <EditSharpIcon className="i" />
            </div>
          </span>
          <span style={{ "--i": 2 }}>
            <div className="a">
              <ShuffleIcon className="i" />
            </div>
          </span>
          <span style={{ "--i": 3 }}>
            <div className="a">
              <DeleteForeverIcon className="i" />
            </div>
          </span>
        </div>
      </nav>
    </>
  );
}
