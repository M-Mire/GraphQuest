import React, { useState, useEffect, useReducer } from "react";
import Canvas from "./Canvas";
import TraverseCode from "./TraverseCode";
import TraverseAnimation from "./TraverseAnimation";
import { Node, ACTIONS_NODE, ActionNode } from "./NodeElement";
import Graph, { Command, Line } from "../GraphAlgorithm/Graph";
import PseudoCode from "./PseudoCode";

interface CanvasProps {
  nodes: Node[];
  rootValue: number | null;
  dispatch: React.Dispatch<ActionNode>;
  speed: number;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlay: boolean;
  dispatchLineNumbers: React.Dispatch<ActionLine>;
  lineNumbers: number[];
}

function isCommand(command: Command | Line): command is Command {
  return (command as Command) in Command;
}
export interface ActionLine {
  type: Line;
  payload: number;
}

const Animation: React.FC<CanvasProps> = ({
  nodes,
  rootValue,
  dispatch,
  speed,
  currentIndex,
  setCurrentIndex,
  isPlay,
  dispatchLineNumbers,
  lineNumbers,
}) => {
  const [tracker, setTracker] = useState<Array<[Command | Line, any]>>([]);
  const calculateRedRectangleHeight = () => {
    const screenHeight = window.innerHeight;
    const blueRectangleHeight = 0.75 * screenHeight; // 75% of screen height
    const redRectangleHeight = screenHeight - blueRectangleHeight;
    return redRectangleHeight;
  };

  const [redRectangleHeight, setRedRectangleHeight] = useState(
    calculateRedRectangleHeight()
  );

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
      // console.log(g.getTracker());
      setTracker(g.getTracker());
    }
  }, [rootValue]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (currentIndex < tracker.length && isPlay) {
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
  }, [tracker, currentIndex, dispatch, isPlay]);

  return (
    <>
      <div className="relative w-full h-full">
        <Canvas nodes={nodes} />
        <TraverseAnimation nodes={nodes} />
        <div className="absolute right-0 top-0 w-1/4 h-full over">
          <TraverseCode lineNumbers={lineNumbers} />
          <PseudoCode />
        </div>
      </div>
    </>
  );
};

export default Animation;
