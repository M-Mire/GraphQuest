import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "~/app/_components/SharedUI/Sidebar";
import Navbar from "~/app/_components/SharedUI/Navbar";
import EditMode from "~/app/_components/CanvasElements/EditMode";
import {
  ACTIONS_NODE,
  ActionNode,
} from "~/app/_components/GraphUI/NodeElement";
import Animation, {
  type ActionLine,
} from "~/app/_components/CanvasElements/Animation";
import { Command, Line } from "~/app/_GraphAlgorithm/Graph";
import { useState, useReducer } from "react";
import type pageConfigurationType from "~/app/_pageConfigs/config";
import type Node from "~/app/model/Node";

const nodeReducer: React.Reducer<Node[], ActionNode> = (nodes, action) => {
  switch (action.type) {
    case ACTIONS_NODE.ADD_NODE:
      const newNode = action.payload as Node;
      const nodeExists = nodes.some((node) => node.val === newNode.val);
      if (!nodeExists) {
        return [...nodes, newNode] as Node[];
      }
      return nodes;
    case ACTIONS_NODE.ADD_CHILD_NODE:
      const { parentNode, childNode, weight } = action.payload as {
        parentNode: number;
        childNode: number;
        weight: number;
      };
      return nodes.map((node) => {
        if (node.val === parentNode && !node.childNodes.includes(childNode)) {
          console.log(node.val, parentNode, childNode, node.distances);
          return {
            ...node,
            childNodes: [...node.childNodes, childNode],
            distances: [...node.distances, weight],
          };
        }
        return node;
      });
    case ACTIONS_NODE.DELETE_NODE:
      const deleteNode = action.payload as Node;
      return nodes.filter((node) => node !== deleteNode);
    case ACTIONS_NODE.NODE_ANIMATE:
      const { value, command } = action.payload as {
        value: number | number[];
        command: Command;
      };
      let pairValue: number[];
      switch (command) {
        case Command.Visited:
          return nodes.map((node) => {
            if (node.val === value) {
              return { ...node, visited: true };
            }
            return node;
          });
        case Command.PoppedQueue:
          return nodes.map((node) => {
            if (node.val === value) {
              return { ...node, visitedChildrens: true };
            }
            return node;
          });
        case Command.Unvisit:
          return nodes.map((node) => {
            if (node.val === value) {
              return { ...node, visited: false };
            }
            return node;
          });
        case Command.VisitPairs:
          pairValue = value as number[];
          return nodes.map((node) => {
            if (node.val === pairValue[0] || node.val === pairValue[1]) {
              return { ...node, currentlyVisitedPair: true };
            }
            return node;
          });
        case Command.UnvisitPairs:
          pairValue = value as number[];
          return nodes.map((node) => {
            if (node.val === pairValue[0] || node.val === pairValue[1]) {
              return { ...node, currentlyVisitedPair: false };
            }
            return node;
          });
        default:
          return nodes;
      }
    case ACTIONS_NODE.NODE_RESET:
      return nodes.map((node) => {
        return { ...node, visited: false, visitedChildrens: false };
      });
    case ACTIONS_NODE.NODE_DISTANCE:
      const {
        node,
        childNode: childVal,
        parsedDistance,
      } = action.payload as {
        node: Node;
        childNode: number;
        parsedDistance: number;
      };
      return nodes.map((n) => {
        if (n === node) {
          node.distances[node.childNodes.indexOf(childVal)] = parsedDistance;
          return n;
        }
        return n;
      });

    case ACTIONS_NODE.UPDATE_COORDS:
      const { val, x, y } = action.payload as {
        val: number;
        x: number;
        y: number;
      };
      return nodes.map((n) => {
        if (n.val === val) {
          return { ...n, x: x, y: y };
        }
        return n;
      });
    default:
      return nodes;
  }
};

const lineReducer: React.Reducer<number[], ActionLine> = (
  lineNumbers,
  action,
) => {
  switch (action.type) {
    case Line.EntryLine:
      return [...lineNumbers, action.payload as number];
    case Line.FinishedLine:
      return lineNumbers.filter(
        (number) => number !== (action.payload as number),
      );
    case Line.LineReset:
      return [];
    default:
      return lineNumbers;
  }
};

const addNodesFromURL = (
  nodes: Node[],
  dispatch: React.Dispatch<ActionNode>,
  urlNodes: string[],
) => {
  if (nodes.length === 0 && urlNodes.length > 0) {
    urlNodes.forEach((urlNode) => {
      const deserializedObj = JSON.parse(decodeURIComponent(urlNode)) as Node;
      console.log(deserializedObj, "decode");
      const newNode = deserializedObj;
      dispatch({
        type: ACTIONS_NODE.ADD_NODE,
        payload: newNode,
      });
    });
  }
};

interface PageProps {
  pageConfiguration: pageConfigurationType;
}

const MainPage: React.FC<PageProps> = ({ pageConfiguration }) => {
  const searchParams = useSearchParams();
  const urlNodes = searchParams.getAll("node");
  const [nodeCount, setNodeCount] = useState<number>(urlNodes.length);

  const [rootValue, setRootValue] = useState<number | null>(null);
  const [nodes, dispatch] = useReducer(nodeReducer, []);
  const [speed, setSpeed] = useState<number>(500);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [lineNumbers, dispatchLineNumbers] = useReducer(lineReducer, []);
  const isEditMode = searchParams.get("edit") === "true";

  useEffect(() => {
    addNodesFromURL(nodes, dispatch, urlNodes);
  }, []);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar setRootValue={setRootValue} rootValue={rootValue} />
        <div className="flex flex-1 flex-col">
          <div className="h-[4rem] w-full">
            <Navbar
              rootValue={rootValue}
              setRootValue={setRootValue}
              setSpeed={setSpeed}
              speed={speed}
              dispatch={dispatch}
              setCurrentIndex={setCurrentIndex}
              setPlay={setPlay}
              isPlay={isPlay}
              dispatchLineNumbers={dispatchLineNumbers}
              algorithmName={pageConfiguration.algorithmName}
            />
          </div>
          <div className="flex-1 bg-gray-200">
            {!isEditMode ? (
              <Animation
                nodes={nodes}
                rootValue={rootValue}
                dispatch={dispatch}
                speed={speed}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                isPlay={isPlay}
                lineNumbers={lineNumbers}
                dispatchLineNumbers={dispatchLineNumbers}
                runAlgorithm={pageConfiguration.runAlgorithm}
                code={pageConfiguration.code}
                algorithmName={pageConfiguration.algorithmName}
                provideEdgeLength={pageConfiguration.provideEdgeLength}
                addEdge={pageConfiguration.addEdge}
              />
            ) : (
              <EditMode
                dispatch={dispatch}
                nodes={nodes}
                nodeCount={nodeCount}
                incrementNodeCount={() => {
                  setNodeCount(nodeCount + 1);
                }}
                provideEdgeLength={pageConfiguration.provideEdgeLength}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
