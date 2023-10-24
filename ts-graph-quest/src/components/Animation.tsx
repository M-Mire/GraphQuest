import React, { useState, useEffect, useReducer } from "react";
import Canvas from "./Canvas";
import TraverseCode from "./TraverseCode";
import TraverseAnimation from "./TraverseAnimation";
import { Node, ACTIONS_NODE, ActionNode } from "./NodeElement";
import Graph, { Command, Line } from "../GraphAlgorithm/Graph";

interface CanvasProps {
  nodes: Node[];
  rootValue: number | null;
  dispatch: React.Dispatch<ActionNode>;
  speed: number;
}

function isCommand(command: Command | Line): command is Command {
  return (command as Command) in Command;
}
export interface ActionLine {
  type: Line;
  payload: number;
}

const lineReducer: React.Reducer<number[], ActionLine> = (
  lineNumbers,
  action
) => {
  switch (action.type) {
    case Line.EntryLine:
      return [...lineNumbers, action.payload];
    case Line.FinishedLine:
      return lineNumbers.filter((number) => number !== action.payload);
    default:
      return lineNumbers;
  }
};

const Animation: React.FC<CanvasProps> = ({
  nodes,
  rootValue,
  dispatch,
  speed,
}) => {
  const [tracker, setTracker] = useState<Array<[Command | Line, any]>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lineNumbers, dispatchLineNumbers] = useReducer(lineReducer, []);

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
        const [command, val] = tracker[currentIndex];
        if (isCommand(command)) {
          dispatch({
            type: ACTIONS_NODE.NODE_ANIMATE,
            payload: { value: parseInt(val), command: command },
          });
        } else {
          if (Object.values(Line).includes(command)) {
            dispatchLineNumbers({
              type: command,
              payload: val,
            });
          }
        }
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(timerId);
      }
    }, speed);

    return () => {
      clearInterval(timerId);
    };
  }, [tracker, currentIndex, dispatch]);

  return (
    <>
      <Canvas nodes={nodes} />
      <div className="w-1/4 relative">
        <TraverseCode lineNumbers={lineNumbers} />
        <TraverseAnimation />
      </div>
    </>
  );
};

export default Animation;