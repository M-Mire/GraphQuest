import { useRef, useState } from "react";
import { useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Node from "~/app/model/Node";
import NodeElement, {
  ACTIONS_NODE,
  ActionNode,
} from "~/app/_components/NodeElement";
import createNewNode from "~/app/utils/createNewNode";
import Edge from "~/app/_components/Edge";
import ContextMenu from "~/app/_components/ContextMenu";
import InputWeight from "~/app/_components/InputWeight";
import { getCoords } from "../utils/getCoords";

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

  // const updateNodeQueryString = useCallback(
  //   (
  //     name: string,
  //     valueToRemove: string,
  //     parentNode: number,
  //     childNode: number,
  //   ) => {
  //     const params = new URLSearchParams(searchParams);
  //     const values = params.getAll(name);

  //     if (values.length) {
  //       params.delete(name);
  //       for (const value of values) {
  //         if (value !== valueToRemove) {
  //           params.append(name, value);
  //         }
  //       }
  //     }
  //     const updateNode = nodes.find((node) => node.val === parentNode);
  //     updateNode.childNodes.add(childNode);
  //     console.log(updateNode);

  //     params.append(name, encodeURIComponent(JSON.stringify(updateNode)));
  //     console.log(
  //       encodeURIComponent(JSON.stringify(updateNode)),
  //       " \n",
  //       valueToRemove,
  //     );

  //     console.log(JSON.parse(decodeURIComponent(valueToRemove)));
  //     return params.toString();
  //   },
  //   [searchParams],
  // );

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
          if (activeNode === clickedNode) setActiveNode(-1);
          return;
        }
        if (activeNode === -1) {
          setActiveNode(clickedNode);
        } else if (activeNode === clickedNode) {
          setActiveNode(-1);
        } else if (activeNode !== null && clickedNode >= 0) {
          if (provideEdgeLength) {
            setInputWeight(true);
            setInputWeightNums([activeNode, clickedNode]);
          } else {
            const parentNodeEncoded = encodeURIComponent(
              JSON.stringify(nodes.find((node) => node.val === activeNode)),
            );
            // router.push(
            //   `/?${updateNodeQueryString(
            //     "node",
            //     parentNodeEncoded,
            //     activeNode,
            //     clickedNode,
            //   )}`,
            // );
            dispatch({
              type: ACTIONS_NODE.ADD_CHILD_NODE,
              payload: {
                parentNode: activeNode,
                childNode: clickedNode,
                weight: 0,
              },
            });
            // add updatequery for node
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
      // router.push(`/?${createNodeQueryString("node", serializedObj)}`);
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
          {isInputWeight ? (
            <InputWeight
              nums={inputWeightNums}
              dispatch={dispatch}
              setInputWeight={setInputWeight}
              setInputWeightNums={setInputWeightNums}
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
