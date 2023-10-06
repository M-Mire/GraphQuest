import Canvas from "./Canvas";
export default function Animation({ enableEditMode, nodes }) {
  return (
    <>
      <Canvas enableEditMode={enableEditMode} nodes={nodes} />
      <div className="animation-code-block">Placeholder Animation Block</div>
      <div className="animation-traverse-block">
        PlaceHolder traverse the code
      </div>
    </>
  );
}
