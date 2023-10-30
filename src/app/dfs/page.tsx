"use client";
import Sidebar from "~/app/_components/Sidebar";
import Navbar from "~/app/_components/Navbar";
import EditMode from "~/app/_components/EditMode";
import { ACTIONS_NODE, ActionNode, Node } from "~/app/_components/NodeElement";
import Animation, { ActionLine } from "~/app/_components/Animation";
import Graph, { Command, Line } from "~/app/_GraphAlgorithm/Graph";
import { useState, useReducer } from "react";

const pageConfiguration = {
  algorithmName: "Depth-First Search",
  runAlgorithm: (g: Graph, rootValue: number) => {
    g.DFS(rootValue);
  },
};

const nodeReducer: React.Reducer<Node[], ActionNode> = (nodes, action) => {
  switch (action.type) {
    case ACTIONS_NODE.ADD_NODE:
      return [...nodes, action.payload] as Node[];
    case ACTIONS_NODE.ADD_CHILD_NODE:
      const { parentNode, childNode } = action.payload as {
        parentNode: number;
        childNode: number;
      };
      return nodes.map((node) => {
        if (node.val === parentNode) {
          return { ...node, childNodes: node.childNodes.add(childNode) };
        }
        return node;
      });
    case ACTIONS_NODE.NODE_ANIMATE:
      const { value, command } = action.payload as {
        value: number;
        command: Command;
      };
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
  action,
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

export default function BFS() {
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
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          setRootValue={setRootValue}
          rootValue={rootValue}
          toggleEdit={setEditMode}
          isEditMode={isEditMode}
        />
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
}
