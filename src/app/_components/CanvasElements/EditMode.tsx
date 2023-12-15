import { useRef, useState } from "react";
import { useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Node from "~/app/model/Node";
import createNewNode from "~/app/utils/createNewNode";
import NodeElement, {
  ACTIONS_NODE,
  ActionNode,
} from "~/app/_components/GraphUI/NodeElement";
import Edge from "~/app/_components/GraphUI/Edge";
import ContextMenu from "~/app/_components/SharedUI/ContextMenu";
import InputWeight from "~/app/_components/GraphUI/InputWeight";
import { getCoords } from "../../utils/getCoords";
import useUpdateNodeQueryString from "~/app/hooks/useUpdateNodeQueryString";
import updateNodeEncoded from "~/app/utils/EncodeNode/updateNodeEncoded";

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
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const [isCtxMenu, setCtxMenu] = useState<number>(-1);
  const [isInputWeight, setInputWeight] = useState<boolean>(false);
  const [inputWeightNums, setInputWeightNums] = useState<number[]>([]);
  const updateNodeQueryString = useUpdateNodeQueryString(router);

  //move
  const [isMoveNode, setMoveNode] = useState<boolean>(false);

  const createNodeQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.append(name, value);
      return params.toString();
    },
    [searchParams],
  );

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
        // Handles right click
        if (e.button === 2) {
          setCtxMenu(clickedNode);
          return;
        }
        if (activeNode === -1) setActiveNode(clickedNode);
        else if (activeNode === clickedNode) setActiveNode(-1);
        else if (activeNode !== -1 && clickedNode >= 0) {
          if (provideEdgeLength) {
            setInputWeight(true);
            setInputWeightNums([activeNode, clickedNode]);
          } else {
            dispatch({
              type: ACTIONS_NODE.ADD_CHILD_NODE,
              payload: {
                parentNode: activeNode,
                childNode: clickedNode,
                weight: 0,
              },
            });
            const currentNode = nodes.find((node) => node.val === activeNode)!;
            updateNodeQueryString(
              searchParams.toString(),
              currentNode,
              updateNodeEncoded(currentNode, clickedNode, 0),
            );
          }
        }
      }
      return;
    }
    if (e.button === 2) {
      setCtxMenu(-1);
      return;
    }

    if (!isMoveNode) {
      const { node_x, node_y } = getCoords(x, y, elementRef) as {
        node_x: number;
        node_y: number;
      };
      const addNode = createNewNode(node_x, node_y, nodeCount);
      const serializedObj = encodeURIComponent(JSON.stringify(addNode));
      // // console.log(serializedObj);
      // const deserializedObj = JSON.parse(decodeURIComponent(serializedObj));
      // console.log(deserializedObj);
      // console.log(Router.asPath);
      router.push(`?${createNodeQueryString("node", serializedObj)}`);

      dispatch({
        type: ACTIONS_NODE.ADD_NODE,
        payload: addNode,
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
        onContextMenu={(e) => handleContextMenu(e)}
        style={{ position: "relative" }}
      >
        <svg
          height="100%"
          width="100%"
          style={{
            display: "block",
            margin: "auto",
            position: "relative",
            border: "1px solid black",
          }}
        >
          {nodes?.map((node) => {
            return (
              <NodeElement key={node.id} node={node} activeNode={activeNode} />
            );
          })}
          {nodes?.map((node) =>
            node.val === isCtxMenu && !isMoveNode ? (
              <ContextMenu
                key={node.id}
                node={node}
                dispatch={dispatch}
                setMoveNode={setMoveNode}
                setCtxMenu={setCtxMenu}
                isCtxMenu={isCtxMenu}
                nodes={nodes}
                elementRef={elementRef}
              />
            ) : null,
          )}
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
                    dispatch={dispatch}
                  />
                );
              }
              return null;
            }),
          )}
          {isInputWeight && !isMoveNode ? (
            <InputWeight
              nums={inputWeightNums}
              dispatch={dispatch}
              setInputWeight={setInputWeight}
              setInputWeightNums={setInputWeightNums}
              nodes={nodes}
            />
          ) : null}
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

const handleContextMenu = (e: React.MouseEvent) => {
  e.preventDefault();
};
