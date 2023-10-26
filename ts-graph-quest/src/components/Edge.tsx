import React from "react";

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const Edge: React.FC<EdgeProps> = ({ x1, y1, x2, y2 }) => {
  return (
    <>
      <defs>
        <marker
          id="markerArrow"
          markerWidth="13"
          markerHeight="13"
          refX="2"
          refY="6"
          orient="auto">
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "#HHH" }} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        markerEnd={"url(#markerArrow)"}
        style={{ stroke: "blue", strokeWidth: 2 }}
      />
    </>
  );
};

export default Edge;
