import React, { useState, useReducer, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import EditMode from "./EditMode";
import Animation from "./Animation";
import { ACTIONS_NODE, ActionNode, Node } from "./NodeElement";
import { Graph } from "../GraphAlgorithm/Graph";

const nodeReducer: React.Reducer<Node[], ActionNode> = (nodes, action) => {
  switch (action.type) {
    case ACTIONS_NODE.ADD_NODE:
      return [...nodes, action.payload];
    case ACTIONS_NODE.ADD_CHILD_NODE:
      const { parentNode, childNode } = action.payload;
      return nodes.map((node) => {
        if (node.val === parentNode) {
          return { ...node, childNodes: node.childNodes.add(childNode) };
        }
        return node;
      });
    case ACTIONS_NODE.NODE_ANIMATE:
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
        default:
          return nodes;
      }
    default:
      return nodes;
  }
};

const App: React.FC = () => {
  const [rootValue, setRootValue] = useState<number | null>(null);
  const [nodes, dispatch] = useReducer(nodeReducer, []);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [isEditMode, setEditMode] = useState<boolean>(true);
  const [tracker, setTracker] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (rootValue !== null) {
      const g = new Graph();
      nodes
        .filter((node) => node.childNodes && node.childNodes.size > 0)
        .map((node) => {
          return Array.from(node.childNodes).map((child, id) => {
            return g.addEdge(node.val, child);
          });
        });
      g.BFS(rootValue);
      console.log(g.getTracker());
      setTracker(g.getTracker());
    }
  }, [rootValue]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (currentIndex < tracker.length) {
        const [command, val] = tracker[currentIndex].split(":");
        dispatch({
          type: ACTIONS_NODE.NODE_ANIMATE,
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        setRootValue={setRootValue}
        rootValue={rootValue}
        toggleEdit={setEditMode}
        isEditMode={isEditMode}
      />
      <div className="flex-1">
        <Navbar rootValue={rootValue} setRootValue={setRootValue} />
        <div className="flex h-full">
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
      </div>
    </div>
  );
};

export default App;
