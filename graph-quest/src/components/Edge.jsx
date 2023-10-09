// function hello(x1, x2, y1, y2) {
//   if (x2 < x1 && y1 < y2) {
//     return x2 + 16;
//   } else if (y2 > y1 && x2 < x1) {
//     return y2 - 32;
//   } else if (x2 > x1 && y1 < y2) {
//     return x2 - 16;
//   } else if (x2 < x1 && y1 > y2) {
//   }
// }
export default function Edge({ x1, x2, y1, y2 }) {
  console.log(x1, x2, y1, y2);
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
          <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "#fff" }} />
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
