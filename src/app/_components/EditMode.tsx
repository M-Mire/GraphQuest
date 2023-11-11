import { useRef, useState } from "react";
import NodeElement, {
  ACTIONS_NODE,
  ActionNode,
  newNode,
  Node,
} from "~/app/_components/NodeElement";
import Edge from "~/app/_components/Edge";

interface EditModeProps {
  dispatch: React.Dispatch<ActionNode>;
  nodes: Node[];
  nodeCount: number;
  incrementNodeCount: () => void;
  provideEdgeLength?: boolean;
}

const EditMode: React.FC<EditModeProps> = ({
  dispatch,
  nodes,
  nodeCount,
  incrementNodeCount,
  provideEdgeLength,
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [activeNode, setActiveNode] = useState<number>(-1);

  const handleClick = (e: React.MouseEvent) => {
    const { pageX: x, pageY: y, target } = e;
    const targetAsElem = target as HTMLElement;
    const nodeName = targetAsElem.tagName;
    if (nodeName !== "svg" && nodeName !== "circle" && nodeName !== "text") {
      return;
    }
    if (nodeName === "circle" || nodeName === "text") {
      const textContent = targetAsElem.getAttribute("name");
      if (textContent) {
        const clickedNode = nodes.find(
          (node) => node.val === parseInt(textContent),
        )!.val;
        if (activeNode === -1) {
          setActiveNode(clickedNode);
        } else if (activeNode === clickedNode) {
          setActiveNode(-1);
        } else if (activeNode !== null && clickedNode >= 0) {
          dispatch({
            type: ACTIONS_NODE.ADD_CHILD_NODE,
            payload: { parentNode: activeNode, childNode: clickedNode },
          });
        }
      }
      return;
    }

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const node_x = x - rect.left + window.scrollX;
      const node_y = y - rect.top + window.scrollY;
      dispatch({
        type: ACTIONS_NODE.ADD_NODE,
        payload: newNode(node_x, node_y, nodeCount),
      });
      incrementNodeCount();
      return;
    }
  };
  return (
    <>
      <div
        id="editMode"
        ref={elementRef}
        className="absolute left-0 top-0 h-3/4 w-3/4 bg-gray-200"
        onMouseDown={(e) => handleClick(e)}
        style={{ position: "relative" }}
      >
        <svg
          height="100%"
          width="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {nodes?.map((node) => {
            return (
              <NodeElement key={node.id} node={node} activeNode={activeNode} />
            );
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
                    dispatch={dispatch}
                  />
                );
              });
            })}
        </svg>
      </div>
      <div className="relative w-1/4"></div>
    </>
  );
};

export default EditMode;

const getChildNode = (nodes: Node[], target: number) => {
  const node: Node = nodes.find((node: Node) => node.val === target)!;
  return node;
};
