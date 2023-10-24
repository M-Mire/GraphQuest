import React, { useState, useReducer } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import EditMode from "./EditMode";
import Animation, { ActionLine } from "./Animation";
import { ACTIONS_NODE, ActionNode, Node } from "./NodeElement";
import { Command } from "../GraphAlgorithm/Graph";

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
        default:
          return nodes;
      }
    case ACTIONS_NODE.NODE_RESET:
      return nodes.map((node) => {
        return { ...node, visited: false, visitedChildrens: false };
      });
    default:
      return nodes;
  }
};

const App: React.FC = () => {
  const [rootValue, setRootValue] = useState<number | null>(null);
  const [nodes, dispatch] = useReducer(nodeReducer, []);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(2000);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        setRootValue={setRootValue}
        rootValue={rootValue}
        toggleEdit={setEditMode}
        isEditMode={isEditMode}
      />
      <div className="flex-1">
        <Navbar
          rootValue={rootValue}
          setRootValue={setRootValue}
          setSpeed={setSpeed}
          speed={speed}
          dispatch={dispatch}
        />
        <div className="flex h-full">
          {!isEditMode ? (
            <Animation
              nodes={nodes}
              rootValue={rootValue}
              dispatch={dispatch}
              speed={speed}
            />
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
