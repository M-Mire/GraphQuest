import Canvas from "./Canvas";
import TraverseCode from "./TraverseCode";
import TraverseAnimation from "./TraverseAnimation";
import { Node } from "./NodeElement";

interface CanvasProps {
  nodes: Node[];
}

const Animation: React.FC<CanvasProps> = ({ nodes }) => {
  return (
    <>
      <Canvas nodes={nodes} />
      <div className="w-1/4 relative">
        <TraverseCode />
        <TraverseAnimation />
      </div>
    </>
  );
};

export default Animation;
