import { useState } from "react";

export default function Node({ x, y, val, curActiveNode, visited }) {
  const [isClicked, setClicked] = useState(false);
  const RECT = 70;
  return (
    <>
      <rect
        name={val}
        x={x - RECT / 2}
        y={y - RECT / 2}
        height={RECT}
        width={RECT}
        fill="white"></rect>
      <circle
        name={val}
        cx={x}
        cy={y}
        r="16"
        fill={isClicked ? "blue" : visited ? "purple" : "none"}
      />
      <circle
        name={val}
        cx={x}
        cy={y}
        r="18"
        stroke="black"
        strokeWidth="3"
        fill={isClicked ? "blue" : visited ? "purple" : "none"}
        onMouseDown={(e) => {
          if (curActiveNode === -1 || curActiveNode === val) {
            setClicked(!isClicked);
          }
        }}
      />
      <text
        name={val}
        x={x}
        y={y + 5.333333}
        fontSize="16"
        fill="black"
        textAnchor="middle"
        onMouseDown={(e) => {
          if (curActiveNode === -1 || curActiveNode === val) {
            setClicked(!isClicked);
          }
        }}>
        {val}
      </text>
    </>
  );
}
