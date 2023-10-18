import { useState, useReducer, useEffect } from "react";
import Navbar from "./Navbar";
import Animation from "./Animation";
import EditMode from "./EditMode";
import Sidebar from "./Sidebar";

class Graph {
  constructor() {
    this.graph = new Map();
    this.TRACKER = [];
  }

  addEdge(u, v) {
    if (!this.graph.has(u)) {
      this.graph.set(u, []);
    }
    this.graph.get(u).push(v);
  }
  getTracker() {
    return this.TRACKER;
  }

  BFS(root) {
    const visited = new Set();
    const queue = [root];
    this.TRACKER.push("V:" + root);
    visited.add(root);

    while (queue.length > 0) {
      const currQueue = [...queue].reverse();
      const vertex = queue.shift();
      this.TRACKER.push("C:" + vertex);

      for (const neighbour of this.graph.get(vertex) || []) {
        if (!visited.has(neighbour)) {
          this.TRACKER.push("V:" + neighbour);
          visited.add(neighbour);
          queue.push(neighbour);
        }
      }
    }
  }
}

export const ACTIONS = {
  ADD_NODE: "ADD_NODE",
  ADD_CHILD_NODE: "ADD_CHILD_NODE",
  NODE_VISITED: "NODE_VISITED",
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
          queued: false,
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
    case ACTIONS.NODE_VISITED:
      return nodes.map((node) => {
        if (node.val === action.payload.val) {
          return { ...node, visited: true };
        }
        return node;
      });
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
        .filter((node) => node.childNodes.size > 0)
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
        if (command === "V") {
          dispatch({
            type: ACTIONS.NODE_VISITED,
            payload: { val: parseInt(val) },
          });
        }
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(timerId);
      }
    }, 1000);

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
