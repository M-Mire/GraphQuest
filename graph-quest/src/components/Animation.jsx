import Canvas from "./Canvas";
import TraverseCode from "./TraverseCode";
export default function Animation({ enableEditMode, nodes }) {
  return (
    <>
      <Canvas nodes={nodes} />
      <TraverseCode />
      <div className="animation-code-block">Placeholder Animation Block</div>
    </>
  );
}
