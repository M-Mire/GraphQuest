import { useCallback, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Sidebar from "~/app/_components/Sidebar";
import Navbar from "~/app/_components/Navbar";
import EditMode from "~/app/_components/EditMode";
import { ACTIONS_NODE, ActionNode } from "~/app/_components/NodeElement";
import Animation, { ActionLine } from "~/app/_components/Animation";
import Graph, { Command, Line } from "~/app/_GraphAlgorithm/Graph";
import { useState, useReducer } from "react";
import pageConfigurationType from "~/app/_pageConfigs/config";
import Node from "~/app/model/Node";

const nodeReducer: React.Reducer<Node[], ActionNode> = (nodes, action) => {
  switch (action.type) {
    case ACTIONS_NODE.ADD_NODE:
      const newNode = action.payload as Node;
      const nodeExists = nodes.some((node) => node.val === newNode.val);
      if (!nodeExists) {
        // console.log(newNode);
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
          node.distances[node.distances.indexOf(childVal)] = parsedDistance;
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

interface PageProps {
  pageConfiguration: pageConfigurationType;
}

const MainPage: React.FC<PageProps> = ({ pageConfiguration }) => {
  const [rootValue, setRootValue] = useState<number | null>(null);
  const [nodes, dispatch] = useReducer(nodeReducer, []);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(500);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [lineNumbers, dispatchLineNumbers] = useReducer(lineReducer, []);
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
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
