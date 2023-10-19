import { useState, useReducer, useEffect } from "react";
import Navbar from "./Navbar";
import Animation from "./Animation";
import EditMode from "./EditMode";
import Sidebar from "./Sidebar";
import { Graph } from "../GraphAlgorithm/Graph";

export const ACTIONS = {
  ADD_NODE: "ADD_NODE",
  ADD_CHILD_NODE: "ADD_CHILD_NODE",
  NODE_ANIMATE: "NODE_ANIMATE",
};

function reducer(nodes, action) {
  switch (action.type) {
    case ACTIONS.ADD_NODE:
      const { x, y, val } = action.payload;
      // console.log(nodes);
      return [
        ...nodes,
        {
          id: Date.now(),
          val: val,
          x: x,
          y: y,
          visited: false,
          visitedChildrens: false,
          childNodes: new Set(),
        },
      ];
    case ACTIONS.ADD_CHILD_NODE:
      const { parentNode, childNode } = action.payload;
      // console.log(parentNode, childNode);
      return nodes.map((node) => {
        if (node.val === parentNode) {
          // console.log(nodes);
          return { ...node, childNodes: node.childNodes.add(childNode) };
        }
        return node;
      });
    case ACTIONS.NODE_ANIMATE:
      const { value, command } = action.payload;
      switch (command) {
        case "V":
          return nodes.map((node) => {
            if (node.val === value) {
              return { ...node, visited: true };
            }
            return node;
          });
        case "F":
          return nodes.map((node) => {
            if (node.val === value) {
              return { ...node, visitedChildrens: true };
            }
            return node;
          });
      }
    default:
      return nodes;
  }
}

const App = () => {
  const [isEditMode, setEditMode] = useState(true);
  const [nodes, dispatch] = useReducer(reducer, []);
  const [nodeCount, setNodeCount] = useState(0);
  const [rootNode, setRootNode] = useState(-1);
  const [tracker, setTracker] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (rootNode >= 0) {
      const g = new Graph();
      nodes
        .filter((node) => node.childNodes && node.childNodes.size > 0)
        .map((node) => {
          return Array.from(node.childNodes).map((child, id) => {
            return g.addEdge(node.val, child);
          });
        });
      g.BFS(parseInt(rootNode));
      console.log(g.getTracker());
      setTracker(g.getTracker());
    }
  }, [rootNode]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (currentIndex < tracker.length) {
        const [command, val] = tracker[currentIndex].split(":");
        dispatch({
          type: ACTIONS.NODE_ANIMATE,
          payload: { value: parseInt(val), command: command },
        });
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(timerId);
      }
    }, 300);

    return () => {
      clearInterval(timerId);
    };
  }, [tracker, currentIndex]);

  return (
    <div className="app">
      <Navbar
        isEditMode={isEditMode}
        rootNode={rootNode}
        setRootNode={setRootNode}
        tracker={tracker}
      />
      <Sidebar
        enableEditMode={() => {
          setEditMode(!isEditMode);
        }}
      />
      {!isEditMode ? (
        <Animation nodes={nodes} />
      ) : (
        <EditMode
          dispatch={dispatch}
          nodes={nodes}
          nodeCount={nodeCount}
          incrementNodeCount={() => {
            setNodeCount(nodeCount + 1);
          }}
        />
      )}
    </div>
  );
};

export default App;
