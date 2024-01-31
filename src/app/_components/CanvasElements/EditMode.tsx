import { useRef, useState } from "react";
import { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type Node from "~/app/model/Node";
import createNewNode from "~/app/utils/createNewNode";
import NodeElement, {
  ACTIONS_NODE,
} from "~/app/_components/GraphUI/NodeElement";
import type { ActionNode } from "~/app/_components/GraphUI/NodeElement";
import Edge from "~/app/_components/GraphUI/Edge";
import ContextMenu from "~/app/_components/SharedUI/ContextMenu";
import InputWeight from "~/app/_components/GraphUI/InputWeight";
import { calculateNewNodePosition } from "../../utils/calculateNewNodePosition";
import useUpdateNodeQueryString from "~/app/hooks/useUpdateNodeQueryString";
import updateNodeEncoded from "~/app/utils/EncodeNode/updateNodeEncoded";
import { Alerts } from "~/app/_components/SharedUI/Alert";
import InformationBoardGraphNode from "../SharedUI/InformationBoardItems/InformationBoardGraphNode";
import InformationBoard from "../SharedUI/InformationBoard";
import { useThemeContext } from "~/app/context/ThemeContext";

interface EditModeProps {
  dispatch: React.Dispatch<ActionNode>;
  nodes: Node[];
  isWeighted: boolean;
  setAlert: React.Dispatch<React.SetStateAction<Alerts | null>>;
  minCanvas: { minHeight: number; minWidth: number };
  isUndirectedGraph: boolean;
}

const EditMode: React.FC<EditModeProps> = ({
  dispatch,
  nodes,
  isWeighted,
  setAlert,
  minCanvas,
  isUndirectedGraph,
}) => {
  const style = {
    minWidth: `${minCanvas.minWidth ? `${minCanvas.minWidth + 16}` : "100%"}`,
    width: "100%",
    minHeight: `${
      minCanvas.minHeight ? `calc( ${minCanvas.minHeight}px )` : "100%"
    }`,
    height: "calc(100% - 50px)",
  };

  const { theme } = useThemeContext();

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
          if (isWeighted) {
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

    if (!isMoveNode && nodes.length < 20 && elementRef) {
      const { node_x, node_y } = calculateNewNodePosition(x, y, elementRef) as {
        node_x: number;
        node_y: number;
      };
      const addNode = createNewNode(node_x, node_y, nodes.length);
      const serializedObj = encodeURIComponent(JSON.stringify(addNode));
      router.push(`?${createNodeQueryString("node", serializedObj)}`);

      dispatch({
        type: ACTIONS_NODE.ADD_NODE,
        payload: addNode,
      });
      if (nodes.length === 10) {
        setAlert(Alerts.Amber);
      }
    } else if (nodes.length === 20) {
      setAlert(Alerts.Warning);
    }
    return;
  };
  return (
    <div className="absolute h-full w-full p-4">
      <div
        className="mx-auto my-14 h-2/3 overflow-auto rounded-2xl  md:relative md:left-0 md:top-0 md:w-[65%] lg:w-[70%]"
        style={{
          background: theme.background.secondary,
          borderColor: theme.background.quaternary,
        }}
      >
        <InformationBoard minCanvas={minCanvas}>
          <InformationBoardGraphNode
            name={"Active Node"}
            colour={theme.node.active}
          />
          <InformationBoardGraphNode
            name={"Node"}
            colour={theme.node.unvisited}
          />
        </InformationBoard>
        <div style={style} id="editMode" ref={elementRef} className="">
          <svg
            style={{
              minWidth: `${
                minCanvas.minWidth ? `${minCanvas.minWidth + 16}` : "100%"
              }`,
              width: "100%",
              minHeight: `${
                minCanvas.minHeight
                  ? `calc(2/3 * ${minCanvas.minHeight}px )`
                  : " 100% "
              }`,
              height: "100%",
            }}
            role="img"
            onMouseDown={(e) => handleClick(e)}
            onContextMenu={(e) => handleContextMenu(e)}
          >
            {nodes?.map((node) => {
              return (
                <NodeElement
                  key={node.id}
                  node={node}
                  activeNode={activeNode}
                />
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
                  minCanvas={minCanvas}
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
                      isWeighted={isWeighted}
                      node={parentNode}
                      childNode={childNode}
                      dispatch={dispatch}
                      isUndirectedGraph={isUndirectedGraph}
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
      </div>
    </div>
  );
};

export default EditMode;

const handleContextMenu = (e: React.MouseEvent) => {
  e.preventDefault();
};
