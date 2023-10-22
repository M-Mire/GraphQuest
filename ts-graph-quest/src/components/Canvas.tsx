import { useRef, useState } from "react";
import NodeElement, { Node } from "./NodeElement";
import Edge from "./Edge";

interface CanvasProps {
  nodes: Node[];
}

const EditMode: React.FC<CanvasProps> = ({ nodes }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [activeNode, setActiveNode] = useState<number>(-1);

  return (
    <>
      <div
        id="editMode"
        ref={elementRef}
        className="flex-1 bg-gray-200"
        style={{ position: "relative" }}>
        <svg
          height="100%"
          width="100%"
          style={{ position: "absolute", top: 0, left: 0 }}>
          {nodes?.map((node) => {
            return (
              <NodeElement key={node.id} node={node} activeNode={activeNode} />
            );
          })}
          {nodes
            .filter((node) => node.childNodes.size > 0)
            .map((node) => {
              return Array.from(node.childNodes).map((child, id) => {
                const childCoords = getCoords(nodes, child);
                return (
                  <Edge
                    key={id}
                    x1={node.x}
                    y1={node.y}
                    x2={childCoords.x}
                    y2={childCoords.y}
                  />
                );
              });
            })}
        </svg>
      </div>
    </>
  );
};

export default EditMode;

const getCoords = (nodes: Node[], target: number) => {
  const node = nodes.find((node: Node) => node.val === target)!;
  return { x: node.x, y: node.y };
};
