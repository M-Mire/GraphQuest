import AddIcon from "@mui/icons-material/Add";
import { useState, useRef } from "react";

export default function DraggableNav(props) {
  const [isDragNavOpen, toggleDragNav] = useState(false);
  const ref = useRef(null);

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
          {props.NAV_ITEMS.map((nav_item) => {
            return (
              <span style={{ "--i": nav_item.id }} key={nav_item.id}>
                <div className="a" onClick={nav_item.onClickFunc}>
                  <nav_item.Icon className="i" />
                </div>
              </span>
            );
          })}
        </div>
      </nav>
    </>
  );
}
