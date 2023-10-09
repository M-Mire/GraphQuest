import { useState } from "react";

export default function Node({ x, y, val, curActiveNode }) {
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
        fill="red"></rect>
      <circle name={val} cx={x} cy={y} r="16" fill="white" />
      <circle
        name={val}
        cx={x}
        cy={y}
        r="18"
        fill={isClicked ? "blue" : "black"}
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
        fill="white"
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
