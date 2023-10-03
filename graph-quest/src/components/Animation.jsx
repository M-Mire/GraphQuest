import Canvas from "./Canvas";
export default function Animation({ enableEditMode }) {
  return (
    <>
      <Canvas enableEditMode={enableEditMode} />
      <div className="animation-code-block">Placeholder Animation Block</div>
      <div className="animation-traverse-block">
        PlaceHolder traverse the code
      </div>
    </>
  );
}
