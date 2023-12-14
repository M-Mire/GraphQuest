import { useRef } from "react";
import NodeElement from "./NodeElement";
import Node from "~/app/model/Node";
import Edge from "~/app/_components/Edge";

interface CanvasProps {
  nodes: Node[];
  provideEdgeLength?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ nodes, provideEdgeLength }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  <div className=" bg-blue-500"></div>;
  return (
    <>
      <div
        id="editMode"
        ref={elementRef}
        className="absolute left-0 top-0 h-3/4 w-3/4 bg-gray-200"
        style={{ position: "relative" }}
      >
        <svg
          height="100%"
          width="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {nodes?.map((node) => {
            return <NodeElement key={node.id} node={node} />;
          })}
          {nodes
            .filter((node) => node.childNodes.size > 0)
            .map((node) => {
              return Array.from(node.childNodes).map((child: number, id) => {
                const childNode: Node = getChildNode(nodes, child);
                return (
                  <Edge
                    key={id}
                    x1={node.x}
                    y1={node.y}
                    x2={childNode.x}
                    y2={childNode.y}
                    provideEdgeLength={provideEdgeLength}
                    node={node}
                    childNode={childNode}
                  />
                );
              });
            })}
        </svg>
      </div>
    </>
  );
};

export default Canvas;

const getChildNode = (nodes: Node[], target: number) => {
  const node: Node = nodes.find((node: Node) => node.val === target)!;
  return node;
};
