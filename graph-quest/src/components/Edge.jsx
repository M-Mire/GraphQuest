export default function Edge({ x1, x2, y1, y2 }) {
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
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "#ccc" }} />
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
}
