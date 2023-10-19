import { useState } from "react";
const COLOUR_SELECTION = (isClicked, visited, visitedChildrens) => {
  return isClicked
    ? "blue"
    : visited
    ? visitedChildrens
      ? "grey"
      : "purple"
    : "none";
};
export default function Node({
  x,
  y,
  val,
  curActiveNode,
  visited,
  visitedChildrens,
}) {
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
        fill={COLOUR_SELECTION(isClicked, visited, visitedChildrens)}
      />
      <circle
        name={val}
        cx={x}
        cy={y}
        r="18"
        stroke="black"
        strokeWidth="3"
        fill={COLOUR_SELECTION(isClicked, visited, visitedChildrens)}
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
