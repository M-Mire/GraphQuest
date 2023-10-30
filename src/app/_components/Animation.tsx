import React, { useState, useEffect, useReducer } from "react";
import Canvas from "~/app/_components/Canvas";
import TraverseCode from "~/app/_components/TraverseCode";
import TraverseAnimation from "~/app/_components/TraverseAnimation";
import { Node, ACTIONS_NODE, ActionNode } from "./NodeElement";
import Graph, { Command, Line } from "~/app/_GraphAlgorithm/Graph";
import PseudoCode from "~/app/_components/PseudoCode";

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
  runAlgorithm: (g: Graph, rootValue: number) => void;
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
  runAlgorithm,
}) => {
  const [tracker, setTracker] = useState<Array<[Command | Line, any]>>([]);
  const calculateRedRectangleHeight = () => {
    const screenHeight = window.innerHeight;
    const blueRectangleHeight = 0.75 * screenHeight;
    const redRectangleHeight = screenHeight - blueRectangleHeight;
    return redRectangleHeight;
  };

  const [redRectangleHeight, setRedRectangleHeight] = useState(
    calculateRedRectangleHeight(),
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
      runAlgorithm(g, rootValue);
      setTracker(g.getTracker());
    }
  }, [rootValue]);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (currentIndex < (tracker.length as number) && isPlay) {
        const [command, val] = tracker[currentIndex] as [Command | Line, any];
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
      <div className="relative h-full w-full">
        <Canvas nodes={nodes} />
        <TraverseAnimation nodes={nodes} />
        <div className="over absolute right-0 top-0 h-full w-1/4">
          <TraverseCode lineNumbers={lineNumbers} />
          <PseudoCode />
        </div>
      </div>
    </>
  );
};

export default Animation;
