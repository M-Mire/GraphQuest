import { useRef } from "react";
import NodeElement from "../GraphUI/NodeElement";
import Node from "~/app/model/Node";
import Edge from "~/app/_components/GraphUI/Edge";

interface CanvasProps {
  nodes: Node[];
  provideEdgeLength?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ nodes, provideEdgeLength }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div
        id="editMode"
        ref={elementRef}
        className="h-2/3 overflow-auto rounded-2xl bg-slate-600 sm:mb-2 md:relative md:left-0 md:top-0 md:w-[65%] lg:w-[70%]"
      >
        <svg className="h-full w-full">
          {nodes?.map((node) => {
            return <NodeElement key={node.id} node={node} />;
          })}
          {nodes.map((parentNode) =>
            parentNode.childNodes.map((childVal, id) => {
              const childNode = nodes.find((node) => node.val === childVal);
              if (childNode) {
                return (
                  <Edge
                    key={id}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={childNode.x}
                    y2={childNode.y}
                    provideEdgeLength={provideEdgeLength}
                    node={parentNode}
                    childNode={childNode}
                  />
                );
              }
              return null;
            }),
          )}
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
