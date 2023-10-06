import React, { useState } from "react";
let NODE_RADIUS = 15; // RADIUS OF THE CIRCLE (WIDTH/2 OR HEIGHT/2)

const INNER_NODE_CSS = {
  MozBorderRadius: NODE_RADIUS,
  WebkitBorderRadius: NODE_RADIUS,
  borderRadius: NODE_RADIUS,
  width: NODE_RADIUS * 2 + "px",
  height: NODE_RADIUS * 2 + "px",
  lineHeight: NODE_RADIUS * 2 + "px",
  fontSize: (NODE_RADIUS * 2) / 3 + "px",
};
const NODE_CSS = {
  height: NODE_RADIUS * 4 + NODE_RADIUS,
  width: NODE_RADIUS * 4 + NODE_RADIUS,
};

export default function Node(props) {
  const [num, setNum] = useState("");
  const [isClicked, setClicked] = useState(false);
  return (
    <div
      id="node"
      className="node"
      style={{
        ...NODE_CSS,
        top: props.y - NODE_CSS.height / 2,
        left: props.x - NODE_CSS.width / 2,
        background: "red",
      }}>
      <div
        className="innerNode"
        style={{ ...INNER_NODE_CSS, background: isClicked ? "red" : "blue" }}
        onMouseDown={(e) => {
          if (props.curActiveNode === -1 || props.curActiveNode === props.val) {
            setClicked(!isClicked);
          }
        }}>
        {props.val}
      </div>
    </div>
  );
}
