import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "~/app/_components/SharedUI/Navbar";
import EditMode from "~/app/_components/CanvasElements/EditMode";
import MultiSwitcher from "./SharedUI/MultiSwitcher";
import { ACTIONS_NODE } from "~/app/_components/GraphUI/NodeElement";
import type { ActionNode } from "~/app/_components/GraphUI/NodeElement";
import Animation, {
  type ActionLine,
} from "~/app/_components/CanvasElements/Animation";
import { Command, Line } from "~/app/_GraphAlgorithm/Graph";
import { useState, useReducer } from "react";
import type pageConfigurationType from "~/app/_pageConfigs/config";
import type Node from "~/app/model/Node";
import Alert from "~/app/_components/SharedUI/Alert";
import type { Alerts } from "~/app/_components/SharedUI/Alert";
import { DEFAULT_RADIUS_BIG_CIRCLE } from "~/app/constants/Node/index";

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
          // console.log(node.val, parentNode, childNode, node.distances);
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
        case Command.Popped:
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
    case ACTIONS_NODE.DELETE_ALL:
      return [] as Node[];
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
      const newNode = deserializedObj;
      newNode.visited = false;
      newNode.visitedChildrens = false;
      dispatch({
        type: ACTIONS_NODE.ADD_NODE,
        payload: newNode,
      });
    });
  }
};

const getMinCanvas = (nodes: Node[], urlNodes: string[]) => {
  if (nodes.length === 0 && urlNodes.length > 0) {
    let maxX = -Infinity;
    let maxY = -Infinity;
    urlNodes.forEach((urlNode) => {
      const deserializedObj = JSON.parse(decodeURIComponent(urlNode)) as Node;
      const newNode = deserializedObj;
      maxX = Math.max(maxX, newNode.x);
      maxY = Math.max(maxY, newNode.y);
    });
    return {
      minWidth: Math.ceil(maxX),
      minHeight: Math.ceil(maxY),
    } as { minHeight: number; minWidth: number };
  }
  return { minWidth: -1, minHeight: -1 } as {
    minHeight: number;
    minWidth: number;
  };
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

  const [showMenu, setShowMenu] = useState(false);
  const [isMultiSwitcherActive, setMultiSwitcher] = useState(false);
  const [alert, setAlert] = useState<Alerts | null>(null);
  const [minCanvas, setMinCanvas] = useState<{
    minHeight: number;
    minWidth: number;
  }>({
    minWidth: -1,
    minHeight: -1,
  });

  useEffect(() => {
    if (nodes.length === 0) {
      addNodesFromURL(nodes, dispatch, urlNodes);
      setMinCanvas(getMinCanvas(nodes, urlNodes));
    }
  }, []);

  useEffect(() => {
    const maxX =
      Math.ceil(Math.max(...nodes.map((node) => node.x))) +
      DEFAULT_RADIUS_BIG_CIRCLE;
    const maxY =
      Math.ceil(Math.max(...nodes.map((node) => node.y))) +
      DEFAULT_RADIUS_BIG_CIRCLE;
    setMinCanvas({
      minWidth: Math.max(minCanvas.minWidth, maxX),
      minHeight: Math.max(minCanvas.minHeight, maxY),
    });
  }, [nodes]);

  useEffect(() => {
    if (isEditMode) {
      dispatch({
        type: ACTIONS_NODE.NODE_RESET,
        payload: NaN,
      });
      setCurrentIndex(0);
      setPlay(false);
      dispatchLineNumbers({
        type: Line.LineReset,
        payload: 0,
      });
    }
  }, [isEditMode]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.append(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const deleteQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams);
      params.delete(name);
      return params.toString();
    },
    [searchParams],
  );

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSVGClick = () => {
    setMultiSwitcher(!isMultiSwitcherActive);
  };

  const clearNodes = () => {
    dispatch({
      type: ACTIONS_NODE.DELETE_ALL,
      payload: -1,
    });
    setNodeCount(0);
    setCurrentIndex(0);
    setPlay(false);
    dispatchLineNumbers({
      type: Line.LineReset,
      payload: 0,
    });
  };

  return (
    <>
      <div className="relative flex h-screen flex-col bg-black">
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
          handleSVGClick={handleSVGClick}
          showMenu={showMenu}
          toggleMenu={toggleMenu}
        />
        <div className="relative h-full bg-black">
          {showMenu ? <ShowMenuItems /> : null}

          {isMultiSwitcherActive && (
            <>
              <MultiSwitcher
                pageConfiguration={pageConfiguration}
                isEditMode={isEditMode}
                setMultiSwitcher={setMultiSwitcher}
                clearNodes={clearNodes}
                createQueryString={createQueryString}
                deleteQueryString={deleteQueryString}
              />
            </>
          )}

          {isEditMode ? (
            <>
              <Alert alert={alert} setAlert={setAlert} />
              <EditMode
                dispatch={dispatch}
                nodes={nodes}
                nodeCount={nodeCount}
                incrementNodeCount={() => {
                  setNodeCount(nodeCount + 1);
                }}
                provideEdgeLength={pageConfiguration.provideEdgeLength}
                setAlert={setAlert}
                minCanvas={minCanvas}
              />
            </>
          ) : (
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
              pageID={pageConfiguration.id}
              minCanvas={minCanvas}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MainPage;

const ShowMenuItems = () => {
  return (
    <div className="absolute inset-0 z-20 bg-red-500 px-4 text-white lg:hidden">
      <div className=" border-b border-white py-3">
        <p>Menu Content Here</p>
      </div>
    </div>
  );
};
