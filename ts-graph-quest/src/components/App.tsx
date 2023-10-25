import React, { useState, useReducer } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import EditMode from "./EditMode";
import Animation, { ActionLine } from "./Animation";
import { ACTIONS_NODE, ActionNode, Node } from "./NodeElement";
import { Command, Line } from "../GraphAlgorithm/Graph";

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

const lineReducer: React.Reducer<number[], ActionLine> = (
  lineNumbers,
  action
) => {
  switch (action.type) {
    case Line.EntryLine:
      return [...lineNumbers, action.payload];
    case Line.FinishedLine:
      return lineNumbers.filter((number) => number !== action.payload);
    case Line.LineReset:
      return [];
    default:
      return lineNumbers;
  }
};

const App: React.FC = () => {
  const [rootValue, setRootValue] = useState<number | null>(null);
  const [nodes, dispatch] = useReducer(nodeReducer, []);
  const [nodeCount, setNodeCount] = useState<number>(0);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(500);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlay, setPlay] = useState<boolean>(false);
  const [lineNumbers, dispatchLineNumbers] = useReducer(lineReducer, []);

  return (
    <>
      <div className="h-screen flex overflow-hidden">
        <Sidebar
          setRootValue={setRootValue}
          rootValue={rootValue}
          toggleEdit={setEditMode}
          isEditMode={isEditMode}
        />
        <div className="flex-1 flex flex-col">
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
            />
          </div>
          <div className="bg-gray-200 flex-1">
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
    </>
  );
};

export default App;
